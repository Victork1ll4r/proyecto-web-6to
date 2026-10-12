import { USE_MOCK, demoraMock, noEncontrado, query, request } from './client.js'
import { CANCHAS, HORARIOS } from '../lib/mockData.js'
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
 *   GET /api/canchas                       → Cancha[]
 *   GET /api/canchas/:id                   → Cancha
 *   GET /api/canchas/:id/disponibilidad    → Disponibilidad
 */

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
  if (USE_MOCK) return demoraMock(filtrarCanchas(CANCHAS, criterios))
  return request(`/api/canchas${query(criteriosAQuery(criterios))}`)
}

/**
 * Detalle de una cancha.
 * @param {number|string} id
 * @returns {Promise<import('./types.js').Cancha>}
 */
export async function getCancha(id) {
  if (USE_MOCK) {
    const cancha = CANCHAS.find((c) => c.id === Number(id))
    if (!cancha) throw noEncontrado('cancha')
    return demoraMock(cancha)
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
    const cancha = CANCHAS.find((c) => c.id === Number(canchaId))
    if (!cancha) return Promise.reject(noEncontrado('cancha'))
    return demoraMock({ canchaId: Number(canchaId), fecha: dia, slots: HORARIOS })
  }

  return request(
    `/api/canchas/${encodeURIComponent(canchaId)}/disponibilidad${query({ fecha: dia })}`,
  )
}
