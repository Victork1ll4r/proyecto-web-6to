import { useState } from 'react'
import { formatFechaLarga, formatMoneda } from '../../lib/format.js'
import { Button } from '../ui/Button.jsx'
import { Alert } from '../ui/Feedback.jsx'
import { Input } from '../ui/Field.jsx'
import { Modal } from '../ui/Modal.jsx'

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Valida los datos de contacto. Devuelve un mapa de errores (vacío = todo bien). */
function validar({ nombre, email, telefono }) {
  const errores = {}

  if (nombre.trim().length < 2) {
    errores.nombre = 'Escribe el nombre de quien reserva.'
  }
  if (!RE_EMAIL.test(email.trim())) {
    errores.email = 'Ese correo no parece válido. Revísalo para enviarte la confirmación.'
  }
  if (telefono.trim() !== '' && telefono.replace(/\D/g, '').length < 7) {
    errores.telefono = 'El teléfono debe tener al menos 7 dígitos.'
  }

  return errores
}

/**
 * ReservaModal — confirmación de la reserva (§3.8).
 *
 * Muestra el resumen del turno y pide los datos de contacto de quien reserva.
 * No crea la reserva: se lo devuelve a la página por `onConfirm`, que es quien
 * habla con `api/reservas.js`. El código `SC-XXXXX` lo asigna el servidor.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.canchaNombre
 * @param {string} props.dia            día ISO
 * @param {string} props.rango          "18:00 – 20:00"
 * @param {number} props.horas
 * @param {number} props.total
 * @param {(datos: {nombre: string, email: string, telefono: string}) => void} props.onConfirm
 * @param {() => void} props.onCancel
 * @param {boolean} [props.enviando]
 * @param {string|null} [props.error]
 */
export function ReservaModal({
  open,
  canchaNombre,
  dia,
  rango,
  horas,
  total,
  onConfirm,
  onCancel,
  enviando = false,
  error = null,
}) {
  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '' })
  const [errores, setErrores] = useState({})

  const cambiar = (campo) => (event) => {
    const valor = event.target.value
    setDatos((prev) => ({ ...prev, [campo]: valor }))
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  function enviar(evento) {
    evento.preventDefault()
    const encontrados = validar(datos)
    setErrores(encontrados)
    if (Object.keys(encontrados).length === 0) onConfirm?.(datos)
  }

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Confirmar reserva"
      description="Revisa el turno y déjanos tus datos. Te enviamos la confirmación al correo."
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={enviando}>
            Volver
          </Button>
          <Button type="submit" form="form-reserva" loading={enviando}>
            Confirmar reserva
          </Button>
        </>
      }
    >
      <dl className="c-resumen">
        <div className="c-resumen__row">
          <dt>Cancha</dt>
          <dd>{canchaNombre}</dd>
        </div>
        <div className="c-resumen__row">
          <dt>Fecha</dt>
          <dd>{formatFechaLarga(dia)}</dd>
        </div>
        <div className="c-resumen__row">
          <dt>Horario</dt>
          <dd className="u-tabular">
            {rango} ({horas} {horas === 1 ? 'hora' : 'horas'})
          </dd>
        </div>
        <div className="c-resumen__row c-resumen__row--total">
          <dt>Total</dt>
          <dd className="u-tabular">{formatMoneda(total)}</dd>
        </div>
      </dl>

      {error ? (
        <Alert tone="danger" title="No pudimos confirmar la reserva">
          {error}
        </Alert>
      ) : null}

      <form id="form-reserva" className="c-resumen__form" onSubmit={enviar} noValidate>
        <Input
          label="Nombre de quien reserva"
          required
          autoComplete="name"
          value={datos.nombre}
          onChange={cambiar('nombre')}
          error={errores.nombre}
        />
        <Input
          label="Correo electrónico"
          type="email"
          required
          autoComplete="email"
          icon="mail"
          value={datos.email}
          onChange={cambiar('email')}
          error={errores.email}
        />
        <Input
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          helper="Opcional. Lo usamos solo si hay un cambio en el turno."
          value={datos.telefono}
          onChange={cambiar('telefono')}
          error={errores.telefono}
        />
      </form>
    </Modal>
  )
}
