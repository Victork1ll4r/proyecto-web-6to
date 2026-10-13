import { Avatar, Badge } from '../ui/Chip.jsx'
import { Button } from '../ui/Button.jsx'
import { Modal } from '../ui/Modal.jsx'

/**
 * ClienteDetalleModal — ficha de un cliente (FASE 4).
 *
 * Solo lectura: el panel no edita clientes (el user-service no lo permite
 * todavía). Repite los datos de la fila con calma y ofrece el salto a sus
 * reservas, que es lo único accionable desde aquí.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {import('../../api/types.js').Cliente|null} props.cliente
 * @param {() => void} props.onCerrar
 * @param {(cliente: import('../../api/types.js').Cliente) => void} [props.onVerReservas]
 */
export function ClienteDetalleModal({ open, cliente, onCerrar, onVerReservas }) {
  if (!open || !cliente) return null

  return (
    <Modal
      open={open}
      onClose={onCerrar}
      title="Ficha del cliente"
      description={cliente.codigo}
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar}>
            Cerrar
          </Button>
          {onVerReservas ? (
            <Button icon="event_note" onClick={() => onVerReservas(cliente)}>
              Ver sus reservas
            </Button>
          ) : null}
        </>
      }
    >
      <div className="pa__ficha">
        <div className="pa__ficha-cabecera">
          <Avatar name={cliente.nombre} size={56} />
          <div>
            <p className="pa__ficha-nombre">{cliente.nombre}</p>
            <Badge tone={cliente.activo ? 'activo' : 'inactivo'}>
              {cliente.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>

        <dl className="pa__ficha-datos">
          <div>
            <dt>Código</dt>
            <dd className="u-tabular">{cliente.codigo}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>{cliente.email}</dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd className="u-tabular">{cliente.telefono}</dd>
          </div>
          <div>
            <dt>Registro</dt>
            <dd className="u-tabular">{cliente.registro}</dd>
          </div>
          <div>
            <dt>Reservas</dt>
            <dd className="u-tabular">{cliente.reservas ?? 0}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  )
}
