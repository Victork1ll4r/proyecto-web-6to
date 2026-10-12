import { clasificar, puedeCalificar, puedeCancelar } from '../../lib/filtroReservas.js'
import { etiquetaRelativa } from '../../lib/format.js'
import { ReservaCard } from './ReservaCard.jsx'

/**
 * ReservaList — la lista de reservas (FASE 3, §3.1).
 *
 * Recibe las reservas ya cruzadas con su cancha (`enriquecer`) y decide, por
 * cada una, en qué grupo cae, si se puede cancelar o calificar y qué etiqueta
 * de cercanía lleva. La tarjeta solo pinta.
 *
 * @param {object} props
 * @param {Array<import('../../api/types.js').Reserva & {cancha: import('../../api/types.js').Cancha|null}>} props.reservas
 * @param {Date} [props.ahora]                  se inyecta para poder fijarlo en pruebas
 * @param {Set<number>} [props.calificadas]     ids ya calificados en la sesión
 * @param {(reserva: object) => void} [props.onVerDetalle]
 * @param {(reserva: object) => void} [props.onCancelar]
 * @param {(reserva: object) => void} [props.onCalificar]
 */
export function ReservaList({
  reservas = [],
  ahora = new Date(),
  calificadas,
  onVerDetalle,
  onCancelar,
  onCalificar,
}) {
  return (
    <ul className="mr__lista">
      {reservas.map((reserva) => (
        <li key={reserva.id} className="mr__item">
          <ReservaCard
            reserva={reserva}
            cancha={reserva.cancha}
            grupo={clasificar(reserva, ahora)}
            relativa={etiquetaRelativa(reserva.fecha, ahora)}
            cancelable={puedeCancelar(reserva, ahora)}
            calificable={puedeCalificar(reserva, ahora)}
            calificada={calificadas?.has(reserva.id) ?? false}
            onVerDetalle={() => onVerDetalle?.(reserva)}
            onCancelar={() => onCancelar?.(reserva)}
            onCalificar={() => onCalificar?.(reserva)}
          />
        </li>
      ))}
    </ul>
  )
}
