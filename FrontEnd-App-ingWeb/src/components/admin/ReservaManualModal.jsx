import { useState } from 'react'
import { Alert } from '../ui/Feedback.jsx'
import { Button } from '../ui/Button.jsx'
import { Input, Select } from '../ui/Field.jsx'
import { Modal } from '../ui/Modal.jsx'
import { formatMoneda, formatPrecioHora, horasEntre } from '../../lib/format.js'

/**
 * ReservaManualModal — alta de una reserva desde el panel (FASE 4).
 *
 * Es la acción del botón primario "+ Nueva reserva manual" de Stitch: la
 * secretaría apunta un turno tomado por teléfono. El total se calcula solo
 * (precio/hora de la cancha × horas) y se muestra en el resumen inferior.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {import('../../api/types.js').Cliente[]} props.clientes
 * @param {import('../../api/types.js').Cancha[]} props.canchas
 * @param {string} props.hoy               ISO; fecha por defecto y mínimo
 * @param {(datos: import('../../api/types.js').ReservaNueva) => void} props.onCrear
 * @param {() => void} props.onCerrar
 * @param {boolean} [props.enviando]
 * @param {string|null} [props.error]
 */
export function ReservaManualModal({
  open,
  clientes = [],
  canchas = [],
  hoy,
  onCrear,
  onCerrar,
  enviando = false,
  error = null,
}) {
  if (!open) return null

  return (
    <ReservaManualInterno
      clientes={clientes}
      canchas={canchas}
      hoy={hoy}
      onCrear={onCrear}
      onCerrar={onCerrar}
      enviando={enviando}
      error={error}
    />
  )
}

function ReservaManualInterno({ clientes, canchas, hoy, onCrear, onCerrar, enviando, error }) {
  const [campos, setCampos] = useState(() => ({
    clienteId: clientes[0]?.id ?? '',
    canchaId: canchas[0]?.id ?? '',
    fecha: hoy,
    horaInicio: '18:00',
    horaFin: '19:00',
  }))
  const [tocado, setTocado] = useState(false)

  const cancha = canchas.find((c) => c.id === Number(campos.canchaId)) ?? null
  const horas = horasEntre(campos.horaInicio, campos.horaFin)
  const total = cancha ? cancha.precioHora * horas : 0

  const errores = {}
  if (!campos.clienteId) errores.clienteId = 'Elige un cliente.'
  if (!campos.canchaId) errores.canchaId = 'Elige una cancha.'
  if (!campos.fecha) errores.fecha = 'Elige una fecha.'
  if (horas <= 0) errores.horaFin = 'La hora de fin debe ser posterior a la de inicio.'

  const hayErrores = Object.keys(errores).length > 0

  function cambiar(campo, valor) {
    setCampos((prev) => ({ ...prev, [campo]: valor }))
  }

  function enviar(event) {
    event.preventDefault()
    setTocado(true)
    if (hayErrores) return

    onCrear({
      clienteId: Number(campos.clienteId),
      canchaId: Number(campos.canchaId),
      fecha: campos.fecha,
      horaInicio: campos.horaInicio,
      horaFin: campos.horaFin,
      total,
    })
  }

  return (
    <Modal
      open
      onClose={onCerrar}
      title="Nueva reserva manual"
      description="Para turnos tomados por teléfono o en taquilla."
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form="reserva-form" loading={enviando}>
            Crear reserva
          </Button>
        </>
      }
    >
      <form id="reserva-form" className="pa__form" onSubmit={enviar} noValidate>
        {error ? <Alert tone="danger" title="No se pudo crear">{error}</Alert> : null}

        <Select
          label="Cliente"
          required
          value={campos.clienteId}
          onChange={(event) => cambiar('clienteId', event.target.value)}
          error={tocado ? errores.clienteId : null}
        >
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} — {cliente.email}
            </option>
          ))}
        </Select>

        <Select
          label="Cancha"
          required
          value={campos.canchaId}
          onChange={(event) => cambiar('canchaId', event.target.value)}
          error={tocado ? errores.canchaId : null}
          helper={cancha ? `${formatPrecioHora(cancha.precioHora)} /hora` : undefined}
        >
          {canchas.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre} — {opcion.sede}
            </option>
          ))}
        </Select>

        <Input
          label="Fecha"
          required
          type="date"
          min={hoy}
          value={campos.fecha}
          onChange={(event) => cambiar('fecha', event.target.value)}
          error={tocado ? errores.fecha : null}
        />

        <div className="pa__form-fila">
          <Input
            label="Hora de inicio"
            required
            type="time"
            value={campos.horaInicio}
            onChange={(event) => cambiar('horaInicio', event.target.value)}
          />

          <Input
            label="Hora de fin"
            required
            type="time"
            value={campos.horaFin}
            onChange={(event) => cambiar('horaFin', event.target.value)}
            error={tocado ? errores.horaFin : null}
          />
        </div>

        <div className="pa__resumen-total">
          <span className="u-muted">
            {horas > 0 ? `${horas} ${horas === 1 ? 'hora' : 'horas'}` : 'Duración por definir'}
          </span>
          <span className="pa__resumen-valor u-tabular">{formatMoneda(total)}</span>
        </div>
      </form>
    </Modal>
  )
}
