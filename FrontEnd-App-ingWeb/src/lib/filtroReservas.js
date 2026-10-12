import { descomponerFecha, fechaISO, formatHora } from './format.js'

/**
 * Reglas de presentación de "Mis reservas" (FASE 3).
 *
 * Todo es puro y sin DOM, así que se puede comprobar en Node. La clasificación
 * no la puede hacer el backend: "próxima" o "pasada" depende de la fecha de
 * hoy, no de un campo. El estado sí viene del dato (`Reserva.estado`).
 */

/**
 * Grupos de la pantalla, en el orden en que se muestran las pestañas.
 * @typedef {'proximas'|'pasadas'|'canceladas'|'todas'} GrupoReservas
 */

/** @type {GrupoReservas[]} */
export const GRUPOS = ['proximas', 'pasadas', 'canceladas', 'todas']

/** Etiqueta de cada pestaña. */
export const ETIQUETA_GRUPO = Object.freeze({
  proximas: 'Próximas',
  pasadas: 'Pasadas',
  canceladas: 'Canceladas',
  todas: 'Todas',
})

/** Estados que cuentan como cancelados. */
const CANCELADAS = ['cancelada', 'rechazada']

/**
 * Grupo al que pertenece una reserva. Cancelar manda sobre la fecha: una
 * reserva cancelada del mes que viene no es "próxima".
 * @param {import('../api/types.js').Reserva} reserva
 * @param {Date} [hoy]
 * @returns {'proximas'|'pasadas'|'canceladas'}
 */
export function clasificar(reserva, hoy = new Date()) {
  if (CANCELADAS.includes(reserva?.estado)) return 'canceladas'
  return String(reserva?.fecha ?? '') < fechaISO(hoy) ? 'pasadas' : 'proximas'
}

/**
 * Cruza cada reserva con su cancha, para que la tarjeta no tenga que buscar.
 * Se conserva `cancha: null` si la cancha ya no existe, y la tarjeta lo soporta.
 * @param {import('../api/types.js').Reserva[]} reservas
 * @param {import('../api/types.js').Cancha[]} canchas
 * @returns {Array<import('../api/types.js').Reserva & {cancha: import('../api/types.js').Cancha|null}>}
 */
export function enriquecer(reservas = [], canchas = []) {
  const porId = new Map(canchas.map((cancha) => [cancha.id, cancha]))
  return reservas.map((reserva) => ({ ...reserva, cancha: porId.get(reserva.canchaId) ?? null }))
}

/**
 * Aplica el grupo y el deporte elegidos. `deporte: 'todas'` no filtra.
 * @param {Array<import('../api/types.js').Reserva & {cancha: import('../api/types.js').Cancha|null}>} reservas
 * @param {{grupo?: string, deporte?: string, hoy?: Date}} [filtros]
 */
export function filtrar(reservas = [], { grupo = 'todas', deporte = 'todas', hoy } = {}) {
  return reservas.filter((reserva) => {
    if (grupo !== 'todas' && clasificar(reserva, hoy) !== grupo) return false
    if (deporte !== 'todas' && reserva.cancha?.deporte !== deporte) return false
    return true
  })
}

/**
 * Cuántas reservas hay en cada grupo, para los contadores de las pestañas.
 * @param {import('../api/types.js').Reserva[]} reservas
 * @param {Date} [hoy]
 * @returns {Record<GrupoReservas, number>}
 */
export function contar(reservas = [], hoy = new Date()) {
  const total = { proximas: 0, pasadas: 0, canceladas: 0, todas: reservas.length }
  for (const reserva of reservas) total[clasificar(reserva, hoy)] += 1
  return total
}

/**
 * Horas que faltan para el inicio del turno. Negativo si ya empezó.
 * La fecha y la hora se combinan en **hora local**, que es como las vive el
 * usuario; `new Date("2026-10-14T18:00")` daría otra cosa según la zona.
 * @param {import('../api/types.js').Reserva} reserva
 * @param {Date} [ahora]
 */
export function horasHasta(reserva, ahora = new Date()) {
  const partes = descomponerFecha(reserva?.fecha)
  if (!partes) return 0
  const [hh, mm] = formatHora(reserva.horaInicio).split(':').map(Number)
  const inicio = new Date(partes.anio, partes.mes, partes.dia, hh, mm)
  return (inicio.getTime() - ahora.getTime()) / 3600000
}

/**
 * ¿Se puede cancelar? Solo si el turno sigue en pie (confirmado o pendiente) y
 * faltan más de 24 h (DESIGN_SYSTEM §5: cancelación gratuita hasta 24 h antes).
 * @param {import('../api/types.js').Reserva} reserva
 * @param {Date} [ahora]
 */
export function puedeCancelar(reserva, ahora = new Date()) {
  if (reserva?.estado !== 'confirmada' && reserva?.estado !== 'pendiente') return false
  return horasHasta(reserva, ahora) > 24
}

/**
 * ¿Se puede calificar? Solo un turno ya jugado y no cancelado. Se descarta la
 * reserva del mismo día: la calificación tiene sentido cuando terminó.
 * @param {import('../api/types.js').Reserva} reserva
 * @param {Date} [ahora]
 */
export function puedeCalificar(reserva, ahora = new Date()) {
  if (CANCELADAS.includes(reserva?.estado)) return false
  return horasHasta(reserva, ahora) < 0
}
