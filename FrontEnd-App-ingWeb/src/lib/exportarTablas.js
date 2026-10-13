import { descargarFilas, filasACSV } from './exportar.js'
import { formatFecha } from './format.js'

/**
 * Exportación a CSV de las tablas del panel admin (FASE 4).
 *
 * Las columnas de cada exportación viven aquí, no en el componente: son puras
 * (`*ACSV`) y se pueden comprobar en Node. `descargar*` es el único envoltorio
 * que toca el DOM.
 */

/**
 * Clientes → matriz de filas (con cabecera).
 * @param {import('../api/types.js').Cliente[]} [clientes]
 */
export function filasClientes(clientes = []) {
  return [
    ['Código', 'Nombre', 'Correo', 'Teléfono', 'Registro', 'Reservas', 'Estado'],
    ...clientes.map((cliente) => [
      cliente.codigo,
      cliente.nombre,
      cliente.email,
      cliente.telefono,
      cliente.registro,
      cliente.reservas,
      cliente.activo ? 'Activo' : 'Inactivo',
    ]),
  ]
}

/** Clientes → texto CSV. */
export function clientesACSV(clientes = []) {
  return filasACSV(filasClientes(clientes))
}

/** Descarga el listado de clientes como CSV. */
export function descargarClientes(clientes = []) {
  return descargarFilas('clientes.csv', filasClientes(clientes))
}

/**
 * Reservas (con cancha y cliente ya resueltos) → matriz de filas.
 * @param {Array<import('../api/types.js').Reserva & {cancha?: object|null, cliente?: object|null}>} [reservas]
 */
export function filasReservas(reservas = []) {
  return [
    ['Código', 'Cliente', 'Cancha', 'Fecha', 'Inicio', 'Fin', 'Estado', 'Total'],
    ...reservas.map((reserva) => [
      reserva.codigo,
      reserva.cliente?.nombre ?? '',
      reserva.cancha?.nombre ?? '',
      formatFecha(reserva.fecha),
      reserva.horaInicio,
      reserva.horaFin,
      reserva.estado,
      reserva.total,
    ]),
  ]
}

/** Reservas → texto CSV. */
export function reservasAdminACSV(reservas = []) {
  return filasACSV(filasReservas(reservas))
}

/** Descarga el listado global de reservas como CSV. */
export function descargarReservas(reservas = []) {
  return descargarFilas('reservas.csv', filasReservas(reservas))
}
