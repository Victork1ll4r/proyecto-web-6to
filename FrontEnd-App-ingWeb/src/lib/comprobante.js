import { formatFecha, formatHora } from './format.js'
import { celda } from './exportar.js'

/**
 * Exportación de comprobantes a CSV (FASE 3).
 *
 * La pantalla de Stitch tiene un botón "Descargar comprobantes" que no depende
 * de ningún endpoint: el listado ya está en el cliente, así que se genera el
 * archivo aquí mismo. `reservasACSV` es puro (se puede comprobar en Node); el
 * resto (celdas y descarga) lo presta `lib/exportar.js`.
 *
 * Se re-exporta `descargarTexto` para que "Mis reservas" siga importando todo
 * de este módulo.
 */

export { descargarTexto } from './exportar.js'

/**
 * Convierte las reservas en un CSV con una fila por turno.
 *
 * El total va como número pelado (`24000`), sin símbolo ni separador, para que
 * la hoja de cálculo lo trate como cifra y no como texto.
 *
 * @param {Array<import('../api/types.js').Reserva & {cancha?: import('../api/types.js').Cancha|null}>} reservas
 * @param {import('../api/types.js').Cancha[]} [canchas] se usa si la reserva no trae `cancha`
 * @returns {string}
 */
export function reservasACSV(reservas = [], canchas = []) {
  const porId = new Map(canchas.map((cancha) => [cancha.id, cancha]))

  const filas = [['Código', 'Cancha', 'Fecha', 'Inicio', 'Fin', 'Estado', 'Total']]

  for (const reserva of reservas) {
    const cancha = reserva.cancha ?? porId.get(reserva.canchaId) ?? null
    filas.push([
      reserva.codigo,
      cancha?.nombre ?? '',
      formatFecha(reserva.fecha),
      formatHora(reserva.horaInicio),
      formatHora(reserva.horaFin),
      reserva.estado,
      reserva.total,
    ])
  }

  return filas.map((fila) => fila.map(celda).join(',')).join('\n')
}
