/**
 * Exportación de tablas a CSV (FASE 3 y FASE 4).
 *
 * `filasACSV` es puro (se puede comprobar en Node) y `descargarTexto` es lo
 * único que toca el DOM: sin navegador no hace nada y devuelve `false`, para
 * que quien llama no dé por hecho la descarga.
 *
 * Las reservas de "Mis reservas" (`lib/comprobante.js`) y las tablas del panel
 * admin comparten estas funciones.
 */

/**
 * Escapa una celda: se entrecomilla si trae coma, comilla, salto o punto y coma.
 * @param {unknown} valor
 * @returns {string}
 */
export function celda(valor) {
  const texto = String(valor ?? '')
  return /[",\n;]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
}

/**
 * Convierte una matriz de filas (la primera, la cabecera) en CSV.
 * Los números van pelados, sin símbolo ni separador, para que la hoja de
 * cálculo los trate como cifras y no como texto.
 * @param {Array<Array<unknown>>} filas
 * @returns {string}
 */
export function filasACSV(filas = []) {
  return filas.map((fila) => fila.map(celda).join(',')).join('\n')
}

/**
 * Dispara la descarga de un texto como archivo.
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

/**
 * Descarga una tabla como CSV. Azúcar sobre `filasACSV` + `descargarTexto`.
 * @param {string} nombre
 * @param {Array<Array<unknown>>} filas
 * @returns {boolean}
 */
export function descargarFilas(nombre, filas) {
  return descargarTexto(nombre, filasACSV(filas))
}
