import { formatFecha, formatHora } from './format.js'

/**
 * Exportación de comprobantes a CSV (FASE 3).
 *
 * La pantalla de Stitch tiene un botón "Descargar comprobantes" que no depende
 * de ningún endpoint: el listado ya está en el cliente, así que se genera el
 * archivo aquí mismo. `reservasACSV` es puro (se puede comprobar en Node) y
 * `descargarTexto` es lo único que toca el DOM.
 */

/**
 * Escapa una celda: se entrecomilla si trae coma, comilla, salto o punto y coma.
 * @param {unknown} valor
 * @returns {string}
 */
function celda(valor) {
  const texto = String(valor ?? '')
  return /[",\n;]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
}

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

/**
 * Dispara la descarga de un texto como archivo. Sin DOM (SSR) no hace nada y
 * devuelve `false`, para que quien llama no dé por hecho la descarga.
 *
 * @param {string} nombre    nombre del archivo, con extensión
 * @param {string} contenido
 * @param {string} [tipo]    MIME
 * @returns {boolean}
 */
export function descargarTexto(nombre, contenido, tipo = 'text/csv;charset=utf-8') {
  if (typeof document === 'undefined') return false

  const blob = new Blob([contenido], { type: tipo })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')

  enlace.href = url
  enlace.download = nombre
  enlace.style.display = 'none'

  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  URL.revokeObjectURL(url)

  return true
}
