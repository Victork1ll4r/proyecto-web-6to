import { useMemo, useState } from 'react'
import { cx } from '../../lib/cx.js'
import { comparar } from '../../lib/orden.js'
import { Icon } from './Icon.jsx'
import { Paginador } from './Paginador.jsx'

/**
 * DataTable — tabla de datos (§3.7).
 *
 * API orientada a datos. `columns` describe cada columna:
 *   {
 *     key, header,
 *     align?: 'left'|'right',
 *     sortable?: boolean,                 // cabecera clicable
 *     sorter?: (a, b) => number,          // si el valor no se compara solo
 *     render?: (row, helpers) => node,
 *   }
 *
 * - Selección: interna y alimenta `bulkBar`, la barra de acción masiva que
 *   aparece sobre la tabla. "Seleccionar todo" marca todas las filas filtradas,
 *   no solo las de la página visible.
 * - Ordenación: opcional por columna (`sortable`). Compara el valor de `key`
 *   salvo que la columna traiga `sorter`.
 * - Paginación: con `pageSize`, corta las filas y pinta un `Paginador`.
 * - `stack`: por debajo de 1024 px cada fila pasa a tarjeta (§3.7), con el
 *   encabezado como etiqueta de cada celda.
 */
export function DataTable({
  columns,
  rows,
  rowKey = (row) => row.id,
  selectable = false,
  bulkBar,
  emptyMessage = 'No hay registros para mostrar',
  className = '',
  pageSize,
  defaultSort = null,
  stack = false,
  paginadorEtiqueta,
}) {
  const [selected, setSelected] = useState(() => new Set())
  const [orden, setOrden] = useState(defaultSort)
  const [pagina, setPagina] = useState(1)

  /* ── Ordenación ──────────────────────────────────────────────────────── */
  const ordenadas = useMemo(() => {
    if (!orden) return rows
    const col = columns.find((c) => c.key === orden.key)
    if (!col) return rows

    const dir = orden.dir === 'desc' ? -1 : 1
    const cmp = col.sorter ?? ((a, b) => comparar(a[orden.key], b[orden.key]))
    return [...rows].sort((a, b) => cmp(a, b) * dir)
  }, [rows, columns, orden])

  /* ── Paginación ──────────────────────────────────────────────────────── */
  const totalPaginas = pageSize ? Math.max(1, Math.ceil(ordenadas.length / pageSize)) : 1
  const paginaActual = Math.min(Math.max(pagina, 1), totalPaginas)
  const visibles = pageSize
    ? ordenadas.slice((paginaActual - 1) * pageSize, paginaActual * pageSize)
    : ordenadas

  /* ── Selección ───────────────────────────────────────────────────────── */
  const allIds = useMemo(() => rows.map(rowKey), [rows, rowKey])
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds))
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function alternarOrden(key) {
    setOrden((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
    setPagina(1)
  }

  function iconoOrden(key) {
    if (!orden || orden.key !== key) return 'unfold_more'
    return orden.dir === 'asc' ? 'arrow_upward' : 'arrow_downward'
  }

  const columnas = columns.length + (selectable ? 1 : 0)

  return (
    <div className={cx('c-table-wrap', className)}>
      <table className={cx('c-table', stack && 'c-table--stack')}>
        <thead>
          <tr>
            {selectable ? (
              <th scope="col" style={{ width: 48 }}>
                <input
                  type="checkbox"
                  className="c-check__input"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Seleccionar todas las filas"
                />
              </th>
            ) : null}

            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={col.align === 'right' ? 'c-table__num' : undefined}
                aria-sort={
                  col.sortable
                    ? orden?.key === col.key
                      ? orden.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined
                }
              >
                {col.sortable ? (
                  <button
                    type="button"
                    className="c-table__sort"
                    onClick={() => alternarOrden(col.key)}
                  >
                    {col.header}
                    <Icon name={iconoOrden(col.key)} size={16} />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {visibles.length === 0 ? (
            <tr>
              <td
                colSpan={columnas}
                style={{ textAlign: 'center', color: 'var(--text-secondary)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            visibles.map((row) => {
              const id = rowKey(row)
              const isSelected = selected.has(id)

              return (
                <tr key={id} data-selected={isSelected}>
                  {selectable ? (
                    <td>
                      <input
                        type="checkbox"
                        className="c-check__input"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        aria-label={`Seleccionar fila ${id}`}
                      />
                    </td>
                  ) : null}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.align === 'right' ? 'c-table__num' : undefined}
                      data-label={stack ? col.header : undefined}
                    >
                      {col.render
                        ? col.render(row, { isSelected, toggle: () => toggleRow(id) })
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {selectable && bulkBar && selected.size > 0 ? (
        <div className="c-bulkbar">
          <span>
            {selected.size}{' '}
            {selected.size === 1 ? 'registro seleccionado' : 'registros seleccionados'}
          </span>
          <span className="u-row" style={{ gap: 'var(--sp-2)' }}>
            {bulkBar({ count: selected.size, clear: () => setSelected(new Set()), selected })}
          </span>
        </div>
      ) : null}

      {pageSize ? (
        <Paginador
          pagina={paginaActual}
          totalPaginas={totalPaginas}
          total={ordenadas.length}
          desde={(paginaActual - 1) * pageSize + 1}
          hasta={Math.min(paginaActual * pageSize, ordenadas.length)}
          onCambiar={setPagina}
          etiqueta={paginadorEtiqueta}
        />
      ) : null}
    </div>
  )
}

/** Botón de icono para la columna de acciones de la tabla. */
export function TableAction({ icon, label, danger = false, onClick }) {
  return (
    <button
      type="button"
      className={cx('c-table__action', danger && 'c-table__action--danger')}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <Icon name={icon} size={20} />
    </button>
  )
}
