import { useState } from 'react'
import { cx } from '../../lib/cx.js'

/**
 * SlotGrid — rejilla de horarios (§3.5).
 *
 * Soporta rango contiguo: al pulsar un horario libre adyacente al final de la
 * selección actual, se amplía el bloque. Al pulsar dentro del bloque, lo
 * reduce. Es el comportamiento esperado al reservar dos horas seguidas.
 *
 * @param {Array<{hora: string, estado: 'libre'|'ocupado'}>} slots
 * @param {number[]} value        índices seleccionados (controlado, opcional)
 * @param {Function} onChange     recibe el nuevo array de índices
 */
export function SlotGrid({ slots, value, onChange, cols = 4, className = '' }) {
  const [internal, setInternal] = useState([])
  const selected = value ?? internal

  const emit = (next) => {
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }

  function handleClick(index) {
    if (slots[index]?.estado !== 'libre') return

    // Ya está en el bloque → recorta ese tramo.
    if (selected.includes(index)) {
      let start = index
      let end = index
      while (start - 1 >= 0 && selected.includes(start - 1)) start -= 1
      while (end + 1 < slots.length && selected.includes(end + 1)) end += 1
      emit(selected.filter((i) => i < start || i > end))
      return
    }

    // Contiguo al final → amplía el bloque.
    const last = selected.at(-1)
    if (last != null && index === last + 1) {
      emit([...selected, index])
      return
    }

    // Salto → empieza un bloque nuevo.
    emit([index])
  }

  return (
    <div
      className={cx('c-slots', className)}
      style={{ '--slot-cols': cols }}
      role="group"
      aria-label="Horarios disponibles"
    >
      {slots.map((slot, i) => {
        const busy = slot.estado !== 'libre'
        const on = selected.includes(i)

        return (
          <button
            key={slot.hora}
            type="button"
            className={cx('c-slot', on && 'c-slot--on', busy && 'c-slot--busy')}
            onClick={() => handleClick(i)}
            disabled={busy}
            aria-pressed={on}
            title={
              busy
                ? `${slot.hora} — ocupado`
                : on
                  ? `${slot.hora} — seleccionado`
                  : `Seleccionar ${slot.hora}`
            }
          >
            {slot.hora}
          </button>
        )
      })}
    </div>
  )
}

/** Leyenda de estados de la rejilla. Siempre visible sobre el calendario. */
export function SlotLegend({ className = '' }) {
  return (
    <ul className={cx('c-legend', className)}>
      <li className="c-legend__item">
        <span className="c-legend__dot" />
        Libre
      </li>
      <li className="c-legend__item">
        <span className="c-legend__dot c-legend__dot--on" />
        Seleccionado
      </li>
      <li className="c-legend__item">
        <span className="c-legend__dot c-legend__dot--busy" />
        Ocupado
      </li>
    </ul>
  )
}
