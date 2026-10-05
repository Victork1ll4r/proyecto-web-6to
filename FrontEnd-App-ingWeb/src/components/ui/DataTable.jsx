import { useMemo, useState } from 'react'
import { cx } from '../../lib/cx.js'
import { Icon } from './Icon.jsx'

/**
 * DataTable — tabla de datos (§3.7).
 *
 * API orientada a datos. `columns` describe cada columna:
 *   { key, header, align?: 'left'|'right', render?: (row) => node }
 *
 * La selección de filas es interna y alimenta `bulkBar`, la barra de acción
 * masiva que aparece sobre la tabla.
 */
export function DataTable({
  columns,
  rows,
  rowKey = (row) => row.id,
  selectable = false,
  bulkBar,
  emptyMessage = 'No hay registros para mostrar',
  className = '',
}) {
  const [selected, setSelected] = useState(() => new Set())

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

  return (
    <div className={cx('c-table-wrap', className)}>
      <table className="c-table">
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
              >
                {col.sortable ? (
                  <span className="c-table__sort">
                    {col.header}
                    <Icon name="unfold_more" size={16} />
                  </span>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                style={{ textAlign: 'center', color: 'var(--text-secondary)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
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
                    <td key={col.key} className={col.align === 'right' ? 'c-table__num' : undefined}>
                      {col.render ? col.render(row, { isSelected, toggle: () => toggleRow(id) }) : row[col.key]}
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
            {bulkBar({ count: selected.size, clear: () => setSelected(new Set()) })}
          </span>
        </div>
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
