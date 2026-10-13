import { ApiError, USE_MOCK, demoraMock, noEncontrado, query, request } from './client.js'
import { RESERVAS } from '../lib/mockData.js'
import { generarCodigoReserva } from '../lib/format.js'

/**
 * Endpoints de reserva (`Reserva` — DESIGN_SYSTEM §6).
 *
 *   GET    /api/reservas?cliente=:id&estado=:estado  → Reserva[]
 *   GET    /api/reservas/:id                          → Reserva
 *   POST   /api/reservas                              → Reserva (201)
 *   DELETE /api/reservas/:id                          → 204
 *
 * Con `VITE_USE_MOCK=true` el mock es **con estado**: crear y cancelar
 * modifican una copia en memoria del módulo, así que un `list()` posterior ve
 * el cambio. Es lo que permite probar el flujo completo sin backend.
 */

/** Copia mutable de las reservas de desarrollo. */
let mockReservas = RESERVAS.map((reserva) => ({ ...reserva }))
let mockSiguienteId = mockReservas.length + 1

/**
 * Reinicia el mock a su estado inicial. Solo para pruebas.
 * @returns {void}
 */
export function _reiniciarMock() {
  mockReservas = RESERVAS.map((reserva) => ({ ...reserva }))
  mockSiguienteId = mockReservas.length + 1
}

/**
 * Lista de reservas, opcionalmente por cliente y por estado.
 * @param {{clienteId?: number|string, estado?: string}} [filtros]
 * @returns {Promise<import('./types.js').Reserva[]>}
 */
export function list({ clienteId, estado } = {}) {
  if (USE_MOCK) {
    let datos = mockReservas
    if (clienteId !== undefined && clienteId !== null && clienteId !== '') {
      datos = datos.filter((reserva) => reserva.clienteId === Number(clienteId))
    }
    if (estado && estado !== 'todas') {
      datos = datos.filter((reserva) => reserva.estado === estado)
    }
    return demoraMock(datos)
  }

  return request(`/api/reservas${query({ cliente: clienteId, estado })}`)
}

/**
 * Una reserva por id.
 * @param {number|string} id
 * @returns {Promise<import('./types.js').Reserva>}
 */
export function getReserva(id) {
  if (USE_MOCK) {
    const reserva = mockReservas.find((r) => r.id === Number(id))
    return reserva ? demoraMock(reserva) : noEncontrado('reserva')
  }
  return request(`/api/reservas/${encodeURIComponent(id)}`)
}

/** Campos que el cliente debe enviar al crear una reserva. */
const CAMPOS_REQUERIDOS = ['canchaId', 'clienteId', 'fecha', 'horaInicio', 'horaFin', 'total']

/**
 * Crea una reserva. El `id`, el `codigo` y el `estado` los pone el servidor
 * (o el mock), nunca el formulario.
 * @param {import('./types.js').ReservaNueva} datos
 * @returns {Promise<import('./types.js').Reserva>}
 */
export function crear(datos) {
  const faltantes = CAMPOS_REQUERIDOS.filter(
    (campo) => datos?.[campo] === undefined || datos?.[campo] === null || datos?.[campo] === '',
  )
  if (faltantes.length > 0) {
    return Promise.reject(
      new ApiError('Faltan datos para confirmar la reserva. Revisa el formulario.', { status: 400 }),
    )
  }

  if (USE_MOCK) {
    /** @type {import('./types.js').Reserva} */
    const nueva = {
      id: mockSiguienteId,
      canchaId: Number(datos.canchaId),
      clienteId: Number(datos.clienteId),
      fecha: datos.fecha,
      horaInicio: datos.horaInicio,
      horaFin: datos.horaFin,
      estado: 'confirmada',
      total: Number(datos.total),
      codigo: generarCodigoReserva(),
      creadaEn: new Date().toISOString(),
    }
    mockSiguienteId += 1
    mockReservas = [nueva, ...mockReservas]
    return demoraMock(nueva)
  }

  return request('/api/reservas', { method: 'POST', body: datos })
}

/**
 * Cancela una reserva. El backend decide si aún está dentro del plazo
 * (más de 24 h de antelación); aquí solo se envía la intención.
 * @param {number|string} id
 * @returns {Promise<import('./types.js').Reserva>}
 */
export function cancelar(id) {
  if (USE_MOCK) {
    const reserva = mockReservas.find((r) => r.id === Number(id))
    if (!reserva) return Promise.reject(noEncontrado('reserva'))
    reserva.estado = 'cancelada'
    return demoraMock(reserva)
  }

  return request(`/api/reservas/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

/** Estados a los que el panel admin puede mover una reserva. */
const ESTADOS_ADMIN = ['confirmada', 'pendiente', 'cancelada']

/**
 * Cambia el estado de una reserva. Lo usa el panel admin para confirmar o
 * cancelar en bloque; el cliente no lo llama (él usa `cancelar`).
 * @param {number|string} id
 * @param {string} estado
 * @returns {Promise<import('./types.js').Reserva>}
 */
export function actualizarEstado(id, estado) {
  if (!ESTADOS_ADMIN.includes(estado)) {
    return Promise.reject(
      new ApiError('Ese estado no es válido para una reserva.', { status: 400 }),
    )
  }

  if (USE_MOCK) {
    const reserva = mockReservas.find((r) => r.id === Number(id))
    if (!reserva) return Promise.reject(noEncontrado('reserva'))
    reserva.estado = estado
    return demoraMock(reserva)
  }

  return request(`/api/reservas/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { estado },
  })
}
