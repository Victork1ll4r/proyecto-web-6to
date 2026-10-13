/**
 * Ordenación de tablas (FASE 4).
 *
 * `comparar` es la comparación por defecto de `DataTable` para las columnas
 * marcadas como `sortable`, y la base de los `sorter` a medida. Puro y sin DOM,
 * así que se puede comprobar en Node.
 */

/**
 * Compara dos valores. Números como números; el resto como texto en español,
 * con los números embebidos en orden natural y sin distinguir mayúsculas.
 * Los vacíos (`null`/`undefined`) van siempre al final.
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns {number}
 */
export function comparar(a, b) {
  if (a === b) return 0
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b

  return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' })
}
