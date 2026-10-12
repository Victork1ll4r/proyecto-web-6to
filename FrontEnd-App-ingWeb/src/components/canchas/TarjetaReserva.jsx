import { cx } from '../../lib/cx.js'
import {
  formatFechaLarga,
  formatMes,
  formatMoneda,
  horaFin,
  formatRangoHoras,
} from '../../lib/format.js'
import { Button } from '../ui/Button.jsx'
import { Icon } from '../ui/Icon.jsx'
import { Skeleton } from '../ui/Feedback.jsx'
import { SlotGrid, SlotLegend } from '../ui/SlotGrid.jsx'

/**
 * TarjetaReserva — columna de reserva, pegajosa en escritorio (§4.3).
 *
 * Precio, selector de 7 días, rejilla de turnos, desglose del importe y la
 * única acción primaria de la pantalla. No pide datos ni crea nada: todo eso
 * lo dispara `onReservar` hacia el modal de confirmación.
 *
 * @param {object} props
 * @param {import('../../api/types.js').CanchaDetalle} props.cancha
 * @param {Array<{iso: string, diaCorto: string, numero: string, esHoy: boolean}>} props.dias
 * @param {string} props.dia             día elegido (ISO)
 * @param {(iso: string) => void} props.onDia
 * @param {import('../../api/types.js').Slot[]} props.slots
 * @param {number[]} props.seleccion     índices seleccionados
 * @param {(indices: number[]) => void} props.onSeleccion
 * @param {() => void} props.onReservar
 * @param {boolean} [props.cargando]     el horario se está cargando
 */
export function TarjetaReserva({
  cancha,
  dias = [],
  dia,
  onDia,
  slots = [],
  seleccion = [],
  onSeleccion,
  onReservar,
  cargando = false,
}) {
  const horas = seleccion.length
  const precioHora = cancha?.precioHora ?? 0
  const total = precioHora * horas

  const ordenados = [...seleccion].sort((a, b) => a - b)
  const primera = ordenados.length > 0 ? slots[ordenados[0]]?.hora : null
  const ultima = ordenados.length > 0 ? horaFin(slots[ordenados[ordenados.length - 1]]?.hora ?? '00:00', 1) : null
  const rango = primera && ultima ? formatRangoHoras(primera, ultima) : null

  return (
    <div className="c-reserva">
      <div className="c-reserva__top">
        <p className="c-reserva__price">
          <span className="c-reserva__amount u-tabular">{formatMoneda(precioHora)}</span>
          <span className="u-muted">/ hora</span>
        </p>
        <span className="c-reserva__instant">
          <Icon name="bolt" size={14} />
          Confirmación inmediata
        </span>
      </div>

      {dias.length > 0 ? (
        <div className="c-reserva__days">
          <div className="c-reserva__dayhead">
            <span className="u-label">Selecciona el día</span>
            <span className="c-reserva__month">{formatMes(dia)}</span>
          </div>

          <div className="c-reserva__daygrid" role="group" aria-label="Elegir día">
            {dias.map((d) => (
              <button
                key={d.iso}
                type="button"
                className={cx('c-day', d.iso === dia && 'c-day--on')}
                onClick={() => onDia?.(d.iso)}
                aria-pressed={d.iso === dia}
                aria-label={`${formatFechaLarga(d.iso)}${d.esHoy ? ' (hoy)' : ''}`}
              >
                <span className="c-day__name">{d.diaCorto}</span>
                <span className="c-day__num u-tabular">{d.numero}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="c-reserva__slots">
        <div className="c-reserva__slothead">
          <span className="u-label">Turnos disponibles</span>
          <SlotLegend />
        </div>

        {cargando ? (
          <div className="c-reserva__skeleton" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} height="var(--slot-height)" radius="var(--slot-radius)" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <p className="c-reserva__sinhorario">
            No hay turnos publicados para este día. Prueba con otra fecha.
          </p>
        ) : (
          <SlotGrid slots={slots} value={seleccion} onChange={onSeleccion} cols={3} />
        )}
      </div>

      <div className="c-reserva__resumen">
        <span className="c-reserva__resumentitle">Detalle del turno</span>

        <p className="c-reserva__row">
          <span className="c-reserva__rowlabel">Fecha</span>
          <span className="c-reserva__rowvalue">{formatFechaLarga(dia)}</span>
        </p>

        <p className="c-reserva__row">
          <span className="c-reserva__rowlabel">Horario</span>
          <span className="c-reserva__rowvalue u-tabular">
            {rango ? `${rango} (${horas} ${horas === 1 ? 'hora' : 'horas'})` : 'Sin turnos elegidos'}
          </span>
        </p>

        <p className="c-reserva__row">
          <span className="c-reserva__rowlabel">Tarifa base</span>
          <span className="c-reserva__rowvalue u-tabular">
            {formatMoneda(precioHora)} × {horas} {horas === 1 ? 'hora' : 'horas'} = {formatMoneda(total)}
          </span>
        </p>

        <p className="c-reserva__row">
          <span className="c-reserva__rowlabel">Servicio de iluminación</span>
          <span className="c-reserva__rowvalue c-reserva__incluido">Incluido</span>
        </p>

        <div className="c-reserva__total">
          <span className="c-reserva__totallabel">Total a pagar</span>
          <p className="c-reserva__totalamount">
            <span className="u-tabular">{formatMoneda(total)}</span>
            <span className="c-reserva__cop">COP</span>
          </p>
        </div>
      </div>

      <Button
        fullWidth
        size="lg"
        iconRight="arrow_forward"
        onClick={onReservar}
        disabled={horas === 0}
      >
        Confirmar y pagar reserva
      </Button>

      <p className="c-reserva__nota">
        <Icon name="verified_user" size={16} />
        Cancelación gratuita hasta 24 horas antes del turno
      </p>
    </div>
  )
}
