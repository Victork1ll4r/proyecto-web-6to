import { Alert } from '../ui/Feedback.jsx'
import { Button } from '../ui/Button.jsx'
import { Modal } from '../ui/Modal.jsx'

/**
 * ConfirmarModal — confirmación de una acción irreversible (FASE 4).
 *
 * Genérico y sin estado: el panel lo usa para borrar una cancha. No ejecuta
 * nada; lo dispara `onConfirmar`.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.title
 * @param {import('react').ReactNode} props.description
 * @param {string} [props.confirmLabel]
 * @param {() => void} props.onConfirmar
 * @param {() => void} props.onCerrar
 * @param {boolean} [props.enviando]
 * @param {string|null} [props.error]
 */
export function ConfirmarModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  onConfirmar,
  onCerrar,
  enviando = false,
  error = null,
}) {
  return (
    <Modal
      open={open}
      onClose={onCerrar}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirmar} loading={enviando}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {error ? (
        <Alert tone="danger" title="No se pudo completar">
          {error}
        </Alert>
      ) : (
        <p className="c-cancelar__texto">{description}</p>
      )}
    </Modal>
  )
}
