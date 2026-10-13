import { cx } from '../../lib/cx.js'
import { Icon } from './Icon.jsx'

/**
 * Paginador — navegación de páginas de una tabla (§3.7).
 *
 * Presentacional y controlado: quien lo usa guarda la página. Vive junto a
 * `DataTable` porque es su compañero natural; `DataTable` lo pinta solo cuando
 * recibe `pageSize`.
 *
 * @param {object} props
 * @param {number} props.pagina        1-based
 * @param {number} props.totalPaginas
 * @param {number} props.total         filas totales
 * @param {number} props.desde         índice 1-based de la primera fila visible
 * @param {number} props.hasta         índice 1-based de la última fila visible
 * @param {(pagina: number) => void} props.onCambiar
 * @param {string} [props.etiqueta]    sustantivo del contador ("registros")
 */
export function Paginador({
  pagina,
  totalPaginas,
  total,
  desde,
  hasta,
  onCambiar,
  etiqueta = 'registros',
}) {
  const paginas = ventana(pagina, totalPaginas)

  return (
    <nav className="c-paginador" aria-label="Paginación">
      <p className="c-paginador__resumen u-tabular">
        {total === 0
          ? `Sin ${etiqueta}`
          : `Mostrando ${desde} a ${hasta} de ${total} ${etiqueta}`}
      </p>

      {totalPaginas > 1 ? (
        <div className="c-paginador__botones">
          <button
            type="button"
            className="c-paginador__btn"
            onClick={() => onCambiar(pagina - 1)}
            disabled={pagina <= 1}
            aria-label="Página anterior"
          >
            <Icon name="chevron_left" size={20} />
          </button>

          {paginas.map((numero) => (
            <button
              key={numero}
              type="button"
              className={cx('c-paginador__btn', numero === pagina && 'c-paginador__btn--activo')}
              onClick={() => onCambiar(numero)}
              aria-current={numero === pagina ? 'page' : undefined}
              aria-label={`Página ${numero}`}
            >
              {numero}
            </button>
          ))}

          <button
            type="button"
            className="c-paginador__btn"
            onClick={() => onCambiar(pagina + 1)}
            disabled={pagina >= totalPaginas}
            aria-label="Página siguiente"
          >
            <Icon name="chevron_right" size={20} />
          </button>
        </div>
      ) : null}
    </nav>
  )
}

/**
 * Números de página a mostrar, centrados en la actual.
 * @param {number} pagina
 * @param {number} total
 * @param {number} [ancho]
 * @returns {number[]}
 */
function ventana(pagina, total, ancho = 5) {
  if (total <= ancho) return Array.from({ length: total }, (_, i) => i + 1)

  let inicio = Math.max(1, pagina - Math.floor(ancho / 2))
  let fin = inicio + ancho - 1

  if (fin > total) {
    fin = total
    inicio = fin - ancho + 1
  }

  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i)
}
