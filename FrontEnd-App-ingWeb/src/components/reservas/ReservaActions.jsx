import { Button } from '../ui/Button.jsx'
import { Icon } from '../ui/Icon.jsx'

/**
 * ReservaActions — acciones de una reserva (FASE 3, §3.1).
 *
 * Qué se puede hacer depende de la reserva, no de un `if` en la vista:
 *   - cancelar: solo si sigue en pie y faltan más de 24 h,
 *   - calificar: solo si el turno ya pasó; queda como "Calificada" después,
 *   - ver detalles: siempre, lleva a la ficha de la cancha.
 *
 * @param {object} props
 * @param {boolean} [props.cancelable]
 * @param {boolean} [props.calificable]
 * @param {boolean} [props.calificada]
 * @param {() => void} props.onCancelar
 * @param {() => void} props.onCalificar
 * @param {() => void} props.onVerDetalle
 */
export function ReservaActions({
  cancelable = false,
  calificable = false,
  calificada = false,
  onCancelar,
  onCalificar,
  onVerDetalle,
}) {
  return (
    <div className="c-turno__acciones">
      {cancelable ? (
        <Button
          variant="ghost"
          size="sm"
          icon="cancel"
          className="c-turno__cancelar"
          onClick={onCancelar}
        >
          Cancelar turno
        </Button>
      ) : null}

      {calificable ? (
        calificada ? (
          <span className="c-turno__calificada">
            <Icon name="star" size={18} fill />
            Calificada
          </span>
        ) : (
          <Button variant="soft" size="sm" icon="star" onClick={onCalificar}>
            Calificar
          </Button>
        )
      ) : null}

      <Button variant="secondary" size="sm" iconRight="arrow_forward" onClick={onVerDetalle}>
        Ver detalles
      </Button>
    </div>
  )
}
