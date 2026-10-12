/**
 * Contratos de datos del frontend (JSDoc).
 *
 * Este archivo no ejecuta nada: es la referencia compartida entre `api/`,
 * `hooks/` y los componentes. Coincide con `docs/design/DESIGN_SYSTEM.md §6`,
 * donde lo real es `Cliente` (user-service) y `Cancha` / `Reserva` /
 * `Disponibilidad` son todavía propuestos hasta que existan los endpoints.
 *
 * Al añadir un campo, se añade aquí primero y luego se propaga a los mocks de
 * `src/lib/mockData.js`.
 */

/* ── Entidades ──────────────────────────────────────────────────────────── */

/**
 * Cancha deportiva.
 * @typedef {object} Cancha
 * @property {number} id
 * @property {string} nombre
 * @property {string} deporte        clave de `lib/deportes.js` (futbol, padel…)
 * @property {string} [deporteLabel] etiqueta larga ("Fútbol 7"); opcional
 * @property {string} zona
 * @property {string} sede
 * @property {string[]} tags
 * @property {number} precioHora     pesos por hora, entero
 * @property {number} puntuacion     0–5, un decimal
 * @property {number} [resenas]
 * @property {'disponible'|'ocupada'|'inactiva'} [estado]
 * @property {string} imagenUrl
 */

/**
 * Cancha con su ficha ampliada, tal como la devuelve `GET /canchas/:id`.
 * El listado del catálogo solo usa `Cancha`; el detalle necesita lo demás.
 * @typedef {Cancha & {
 *   direccion: string,
 *   capacidad: number,
 *   descripcion: string,
 *   amenidades: Amenidad[],
 *   normas: string[],
 *   calzado?: {titulo: string, texto: string},
 *   sedeInfo: {nombre: string, texto: string},
 *   imagenes: string[],
 * }} CanchaDetalle
 */

/**
 * Característica de una cancha, con su icono de Material Symbols Rounded.
 * @typedef {object} Amenidad
 * @property {string} icon
 * @property {string} label
 */

/**
 * Franja de una jornada.
 * @typedef {object} Slot
 * @property {string} hora               formato 24 h "18:00"
 * @property {'libre'|'ocupado'} estado
 */

/**
 * Disponibilidad de una cancha para una fecha concreta.
 * @typedef {object} Disponibilidad
 * @property {number} canchaId
 * @property {string} fecha              ISO "2026-10-08"
 * @property {Slot[]} slots
 */

/**
 * Estados válidos de una reserva. Se corresponden con las etiquetas de
 * `ESTADOS_RESERVA` en `lib/deportes.js` (etiqueta + tono de badge).
 * @typedef {'confirmada'|'pendiente'|'completada'|'cancelada'|'rechazada'} EstadoReserva
 */

/**
 * Reserva de una cancha por un cliente.
 * @typedef {object} Reserva
 * @property {number} id
 * @property {number} canchaId
 * @property {number} clienteId
 * @property {string} fecha              ISO "2026-10-08"
 * @property {string} horaInicio         24 h "18:00"
 * @property {string} horaFin            24 h "19:00"
 * @property {EstadoReserva} estado
 * @property {number} total               pesos
 * @property {string} codigo             "SC-4A7F2"
 * @property {string} creadaEn           ISO con hora
 */

/**
 * Cómo pedir una reserva nueva. El `codigo`, el `id` y el `estado` los decide
 * el backend (o el mock).
 * @typedef {object} ReservaNueva
 * @property {number} canchaId
 * @property {number} clienteId
 * @property {string} fecha
 * @property {string} horaInicio
 * @property {string} horaFin
 * @property {number} total
 */

/**
 * Cliente tal como lo devuelve user-service. Ojo: el backend incluye
 * `password` en claro; `api/clientes.js` lo elimina antes de que el dato
 * llegue a cualquier componente (DESIGN_SYSTEM §6).
 * @typedef {object} Cliente
 * @property {number} id
 * @property {string} nombre
 * @property {string} [apellido]
 * @property {string} email
 * @property {string} [telefono]
 * @property {string} [fechaRegistro]
 * @property {boolean} [activo]
 * @property {number} [reservas]         número de reservas (vista admin)
 */

/**
 * Sesión devuelta por auth-service al iniciar sesión.
 * @typedef {object} Sesion
 * @property {string} token
 * @property {Cliente} usuario
 * @property {'cliente'|'admin'} rol
 */

/* ── Guardas de tipo (válidas en runtime) ───────────────────────────────── */

/** Claves de estado admitidas, en el orden en que se muestran. */
export const ESTADOS_RESERVA_CLAVES = Object.freeze([
  'confirmada',
  'pendiente',
  'completada',
  'cancelada',
  'rechazada',
])

/**
 * ¿El valor es un estado de reserva conocido?
 * @param {unknown} valor
 * @returns {valor is EstadoReserva}
 */
export function esEstadoReserva(valor) {
  return ESTADOS_RESERVA_CLAVES.includes(/** @type {EstadoReserva} */ (valor))
}

/**
 * ¿Tiene la forma mínima de una `Cancha`? Sirve para descartar respuestas
 * incompletas antes de que un componente intente pintar `undefined`.
 * @param {unknown} valor
 * @returns {valor is Cancha}
 */
export function esCancha(valor) {
  if (!valor || typeof valor !== 'object') return false
  const c = /** @type {Cancha} */ (valor)
  return typeof c.id === 'number' && typeof c.nombre === 'string' && typeof c.precioHora === 'number'
}

/**
 * ¿Tiene la forma mínima de una `Reserva`?
 * @param {unknown} valor
 * @returns {valor is Reserva}
 */
export function esReserva(valor) {
  if (!valor || typeof valor !== 'object') return false
  const r = /** @type {Reserva} */ (valor)
  return (
    typeof r.id === 'number' &&
    typeof r.canchaId === 'number' &&
    typeof r.fecha === 'string' &&
    esEstadoReserva(r.estado)
  )
}
