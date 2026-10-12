import { cx } from '../../lib/cx.js'
import { ESTADOS_RESERVA } from '../../lib/deportes.js'
import {
  formatDiaNumero,
  formatDiaSemana,
  formatMesCorto,
  formatMoneda,
  formatRangoHoras,
  horasEntre,
} from '../../lib/format.js'
import { Badge } from '../ui/Chip.jsx'
import { Icon } from '../ui/Icon.jsx'
import { ReservaActions } from './ReservaActions.jsx'

/** Icono de Material Symbols para cada estado. El color lo pone el `Badge`. */
const ICONO_ESTADO = {
  confirmada: 'check_circle',
  pendiente: 'schedule',
  completada: 'task_alt',
  cancelada: 'cancel',
  rechazada: 'block',
}

/**
 * Icono de la primera etiqueta que encaje. Las canchas de `mockData` describen
 * sus características en texto libre (`tags`), así que se deduce del nombre.
 */
const ICONO_TAG = [
  [/c[ée]sped|sint[ée]tic|premium|arcilla|arena|parquet|duela|s[íi]lice/i, 'grass'],
  [/luz|iluminaci[óo]n|led/i, 'lightbulb'],
  [/techada|cubierta|panor[áa]mic|roofing/i, 'roofing'],
  [/vestuario|ducha/i, 'shower'],
  [/parqueadero|parking/i, 'local_parking'],
  [/grada/i, 'groups'],
  [/cristal|raqueta|marcador/i, 'sports_tennis'],
  [/casillero/i, 'lock'],
  [/cafeter[íi]a|hidrataci[óo]n|bebida/i, 'local_drink'],
]

function iconoDeTag(tag) {
  const encontrado = ICONO_TAG.find(([patron]) => patron.test(tag))
  return encontrado ? encontrado[1] : 'check_circle'
}

/** Cuántas características se listan en la tarjeta antes de cansar. */
const TAGS_VISIBLES = 2

/**
 * ReservaCard — una reserva del historial (FASE 3, §3.1).
 *
 * Estructura de la pantalla de Stitch: bloque de fecha a la izquierda (día de
 * la semana, número, mes y una etiqueta de cercanía) y, a la derecha, estado,
 * código `SC-XXXXX`, cancha, sede, horario, características, total abonado y
 * acciones. Es un componente de pintado: no sabe de fechas relativas ni de
 * plazos, eso se lo pasa quien lo usa (`grupo`, `cancelable`, `calificable`).
 *
 * @param {object} props
 * @param {import('../../api/types.js').Reserva} props.reserva
 * @param {import('../../api/types.js').Cancha|null} [props.cancha]
 * @param {string} [props.grupo]        'proximas' | 'pasadas' | 'canceladas'
 * @param {string} [props.relativa]     "En 2 días", "Fin de semana"…
 * @param {boolean} [props.cancelable]
 * @param {boolean} [props.calificable]
 * @param {boolean} [props.calificada]
 * @param {() => void} [props.onVerDetalle]
 * @param {() => void} [props.onCancelar]
 * @param {() => void} [props.onCalificar]
 */
export function ReservaCard({
  reserva,
  cancha = null,
  grupo,
  relativa = '',
  cancelable = false,
  calificable = false,
  calificada = false,
  onVerDetalle,
  onCancelar,
  onCalificar,
}) {
  const estado = ESTADOS_RESERVA[reserva.estado] ?? { label: reserva.estado, tone: 'neutral' }
  const horas = horasEntre(reserva.horaInicio, reserva.horaFin)
  /* Se compone en una sola cadena para que viaje como un único nodo de texto. */
  const duracion = `(${horas} ${horas === 1 ? 'hora' : 'horas'})`
  const lugar = [cancha?.zona, cancha?.direccion ?? cancha?.sede].filter(Boolean).join(' — ')
  const tags = (cancha?.tags ?? []).slice(0, TAGS_VISIBLES)

  return (
    <article className={cx('c-turno', grupo && `c-turno--${grupo}`)}>
      <div className="c-turno__fecha">
        <span className="c-turno__fechadia">{formatDiaSemana(reserva.fecha)}</span>
        <span className="c-turno__fechanum u-tabular">{formatDiaNumero(reserva.fecha)}</span>
        <span className="c-turno__fechames">{formatMesCorto(reserva.fecha)}</span>
        {relativa ? <span className="c-turno__fecharel">{relativa}</span> : null}
      </div>

      <div className="c-turno__body">
        <div className="c-turno__head">
          <Badge tone={estado.tone} icon={ICONO_ESTADO[reserva.estado]}>
            {estado.label}
          </Badge>

          <span className="c-turno__id">
            ID: <b className="u-mono">{reserva.codigo}</b>
          </span>
        </div>

        <h2 className="c-turno__title">{cancha?.nombre ?? 'Cancha no disponible'}</h2>

        {lugar ? (
          <p className="c-turno__lugar">
            <Icon name="location_on" size={18} />
            {lugar}
          </p>
        ) : null}

        <div className="c-turno__meta">
          <span className="c-turno__dato">
            <Icon name="schedule" size={18} />
            <span className="u-tabular">{formatRangoHoras(reserva.horaInicio, reserva.horaFin)}</span>
            <span className="u-muted">{duracion}</span>
          </span>

          {tags.map((tag) => (
            <span className="c-turno__dato" key={tag}>
              <Icon name={iconoDeTag(tag)} size={18} />
              {tag}
            </span>
          ))}
        </div>

        <div className="c-turno__foot">
          <p className="c-turno__total">
            <span className="u-muted">Total abonado:</span>{' '}
            <strong className="u-tabular">{formatMoneda(reserva.total)}</strong>
          </p>

          <ReservaActions
            cancelable={cancelable}
            calificable={calificable}
            calificada={calificada}
            onCancelar={onCancelar}
            onCalificar={onCalificar}
            onVerDetalle={onVerDetalle}
          />
        </div>
      </div>
    </article>
  )
}
