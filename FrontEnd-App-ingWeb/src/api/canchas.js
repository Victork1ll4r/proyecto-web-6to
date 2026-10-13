import { ApiError, USE_MOCK, demoraMock, noEncontrado, query, request } from './client.js'
import { CANCHAS, DETALLES_CANCHA, HORARIOS } from '../lib/mockData.js'
import { filtrarCanchas } from '../lib/filtroCanchas.js'
import { fechaISO } from '../lib/format.js'

/**
 * Endpoints de cancha (`Cancha`, `Disponibilidad` — DESIGN_SYSTEM §6).
 *
 * El backend todavía no los expone, así que con `VITE_USE_MOCK=true` (por
 * defecto) responden desde `lib/mockData.js` con la misma forma que tendría
 * la API. `useCanchas` / `useCanchaDetail` ya consumen estas funciones, así
 * que activar el backend real no toca ninguna vista.
 *
 *   GET    /api/canchas                    → Cancha[]
 *   GET    /api/canchas/:id                → Cancha
 *   GET    /api/canchas/:id/disponibilidad → Disponibilidad
 *   POST   /api/canchas                    → Cancha (201)   [panel admin]
 *   PUT    /api/canchas/:id                → Cancha         [panel admin]
 *   DELETE /api/canchas/:id                → 204            [panel admin]
 *
 * El mock es **con estado**: crear, editar y borrar mueven una copia en
 * memoria, así que un `getCanchas()` posterior ve el cambio. Es lo que permite
 * probar el CRUD del panel sin backend.
 */

/** Copia mutable de las canchas de desarrollo. */
let mockCanchas = CANCHAS.map((cancha) => ({ ...cancha }))
let mockSiguienteId = mockCanchas.length + 1

/**
 * Reinicia el mock a su estado inicial. Solo para pruebas.
 * @returns {void}
 */
export function _reiniciarMock() {
  mockCanchas = CANCHAS.map((cancha) => ({ ...cancha }))
  mockSiguienteId = mockCanchas.length + 1
}

/** Campos obligatorios al dar de alta una cancha. */
const CAMPOS_REQUERIDOS = ['nombre', 'deporte', 'zona', 'sede', 'precioHora']

/**
 * Traduce los criterios del catálogo a query params.
 *
 * `filtrarCanchas` deja de ejecutarse en el cliente cuando exista el endpoint:
 * este es el punto exacto donde ese criterio se convierte en URL.
 * @param {object} [criterios]
 */
export function criteriosAQuery(criterios = {}) {
  const { deporte, zona, superficie, techada, iluminacion, busqueda } = criterios
  return {
    deporte: deporte && deporte !== 'todas' ? deporte : undefined,
    zona: zona || undefined,
    superficie: superficie || undefined,
    techada: techada ? 'true' : undefined,
    iluminacion: iluminacion ? 'true' : undefined,
    q: busqueda && busqueda.trim() ? busqueda.trim() : undefined,
  }
}

/**
 * Lista de canchas, filtrada igual que el catálogo.
 * @param {object} [criterios] mismos criterios que `filtrarCanchas`
 * @returns {Promise<import('./types.js').Cancha[]>}
 */
export function getCanchas(criterios = {}) {
  if (USE_MOCK) return demoraMock(filtrarCanchas(mockCanchas, criterios))
  return request(`/api/canchas${query(criteriosAQuery(criterios))}`)
}

/**
 * Detalle de una cancha: la tarjeta más su ficha ampliada.
 *
 * El listado no carga descripción, amenidades ni normas; solo el detalle. Es
 * la misma división que hará `GET /canchas` frente a `GET /canchas/:id`.
 * @param {number|string} id
 * @returns {Promise<import('./types.js').CanchaDetalle>}
 */
export async function getCancha(id) {
  if (USE_MOCK) {
    const cancha = mockCanchas.find((c) => c.id === Number(id))
    if (!cancha) throw noEncontrado('cancha')
    return demoraMock({ ...cancha, ...DETALLES_CANCHA[cancha.id] })
  }
  return request(`/api/canchas/${encodeURIComponent(id)}`)
}

/**
 * Disponibilidad de una cancha para una fecha.
 * @param {number|string} canchaId
 * @param {{fecha?: string}} [opciones] `fecha` en ISO; por defecto hoy
 * @returns {Promise<import('./types.js').Disponibilidad>}
 */
export function getDisponibilidad(canchaId, { fecha } = {}) {
  const dia = fecha ?? fechaISO()

  if (USE_MOCK) {
    const cancha = mockCanchas.find((c) => c.id === Number(canchaId))
    if (!cancha) return Promise.reject(noEncontrado('cancha'))
    return demoraMock({ canchaId: Number(canchaId), fecha: dia, slots: HORARIOS })
  }

  return request(
    `/api/canchas/${encodeURIComponent(canchaId)}/disponibilidad${query({ fecha: dia })}`,
  )
}

/**
 * Normaliza los datos del formulario y valida lo indispensable.
 * @param {import('./types.js').CanchaNueva} datos
 * @returns {{nombre: string, deporte: string, zona: string, sede: string, precioHora: number, estado: string}}
 */
function normalizar(datos) {
  const faltantes = CAMPOS_REQUERIDOS.filter((campo) => {
    const valor = datos?.[campo]
    return valor === undefined || valor === null || valor === ''
  })

  if (faltantes.length > 0) {
    throw new ApiError('Revisa los campos obligatorios de la cancha.', { status: 400 })
  }

  const precio = Number(datos.precioHora)
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new ApiError('El precio por hora debe ser un número mayor que cero.', { status: 400 })
  }

  return {
    nombre: String(datos.nombre).trim(),
    deporte: String(datos.deporte),
    deporteLabel: datos.deporteLabel ? String(datos.deporteLabel) : undefined,
    zona: String(datos.zona).trim(),
    sede: String(datos.sede).trim(),
    tags: Array.isArray(datos.tags) ? datos.tags : [],
    precioHora: Math.round(precio),
    puntuacion: Number(datos.puntuacion) || 0,
    resenas: Number(datos.resenas) || 0,
    estado: datos.estado ?? 'disponible',
  }
}

/**
 * Da de alta una cancha. El `id` lo pone el servidor (o el mock).
 * @param {import('./types.js').CanchaNueva} datos
 * @returns {Promise<import('./types.js').Cancha>}
 */
export function crear(datos) {
  let limpio
  try {
    limpio = normalizar(datos)
  } catch (error) {
    return Promise.reject(error)
  }

  if (USE_MOCK) {
    /** @type {import('./types.js').Cancha} */
    const nueva = {
      id: mockSiguienteId,
      imagenUrl: CANCHAS[0]?.imagenUrl,
      ...limpio,
    }
    mockSiguienteId += 1
    mockCanchas = [nueva, ...mockCanchas]
    return demoraMock(nueva)
  }

  return request('/api/canchas', { method: 'POST', body: limpio })
}

/**
 * Edita una cancha existente. Solo se aplican los campos enviados.
 * @param {number|string} id
 * @param {Partial<import('./types.js').CanchaNueva>} cambios
 * @returns {Promise<import('./types.js').Cancha>}
 */
export function actualizar(id, cambios) {
  if (USE_MOCK) {
    const indice = mockCanchas.findIndex((c) => c.id === Number(id))
    if (indice < 0) return Promise.reject(noEncontrado('cancha'))

    let limpio
    try {
      limpio = normalizar({ ...mockCanchas[indice], ...cambios })
    } catch (error) {
      return Promise.reject(error)
    }

    const actualizada = { ...mockCanchas[indice], ...limpio, id: mockCanchas[indice].id }
    mockCanchas = mockCanchas.map((c, i) => (i === indice ? actualizada : c))
    return demoraMock(actualizada)
  }

  return request(`/api/canchas/${encodeURIComponent(id)}`, { method: 'PUT', body: cambios })
}

/**
 * Borra una cancha.
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export function eliminar(id) {
  if (USE_MOCK) {
    const existe = mockCanchas.some((c) => c.id === Number(id))
    if (!existe) return Promise.reject(noEncontrado('cancha'))
    mockCanchas = mockCanchas.filter((c) => c.id !== Number(id))
    return demoraMock(undefined)
  }

  return request(`/api/canchas/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
