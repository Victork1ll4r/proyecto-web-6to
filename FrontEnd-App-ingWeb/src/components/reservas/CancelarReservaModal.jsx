import { formatFecha, formatMoneda, formatRangoHoras } from '../../lib/format.js'
import { Button } from '../ui/Button.jsx'
import { Alert } from '../ui/Feedback.jsx'
import { Modal } from '../ui/Modal.jsx'

/**
 * CancelarReservaModal — confirmación de la cancelación (FASE 3, §3.1).
 *
 * Cancelar no es reversible, así que se confirma aparte y se recuerda la
 * devolución. No cancela: lo dispara `onConfirmar`, que es quien habla con
 * `api/reservas.js`.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {import('../../api/types.js').Reserva|null} props.reserva
 * @param {import('../../api/types.js').Cancha|null} [props.cancha]
 * @param {() => void} props.onConfirmar
 * @param {() => void} props.onCerrar
 * @param {boolean} [props.enviando]
 * @param {string|null} [props.error]
 */
export function CancelarReservaModal({
  open,
  reserva,
  cancha = null,
  onConfirmar,
  onCerrar,
  enviando = false,
  error = null,
}) {
  if (!open || !reserva) return null

  return (
    <Modal
      open={open}
      onClose={onCerrar}
      title="¿Deseas cancelar este turno?"
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar} disabled={enviando}>
            Mantener turno
          </Button>
          <Button variant="danger" icon="delete" loading={enviando} onClick={onConfirmar}>
            Sí, cancelar reserva
          </Button>
        </>
      }
    >
      <p className="c-cancelar__texto">
        Estás por cancelar tu turno en <strong>{cancha?.nombre ?? 'esta cancha'}</strong> para el{' '}
        <strong className="u-tabular">
          {formatFecha(reserva.fecha)} ({formatRangoHoras(reserva.horaInicio, reserva.horaFin)})
        </strong>
        .
      </p>

      {error ? (
        <Alert tone="danger" title="No pudimos cancelar el turno">
          {error}
        </Alert>
      ) : (
        <Alert tone="ok">
          Aplica devolución total del 100% ({formatMoneda(reserva.total)}) a tu cuenta original.
        </Alert>
      )}
    </Modal>
  )
}
