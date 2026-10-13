import { useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { Alert } from '../ui/Feedback.jsx'
import { Input, Select } from '../ui/Field.jsx'
import { Modal } from '../ui/Modal.jsx'
import { DEPORTES, DEPORTES_CLAVES, ESTADOS_CANCHA } from '../../lib/deportes.js'
import { formatPrecioHora } from '../../lib/format.js'

/** Valores de un formulario en blanco (alta). */
const VACIO = {
  nombre: '',
  deporte: 'futbol',
  zona: '',
  sede: '',
  precioHora: '',
  estado: 'disponible',
}

/** Pasa una cancha existente a los campos del formulario. */
function aCampos(cancha) {
  if (!cancha) return { ...VACIO }

  return {
    nombre: cancha.nombre ?? '',
    deporte: cancha.deporte ?? 'futbol',
    zona: cancha.zona ?? '',
    sede: cancha.sede ?? '',
    precioHora: cancha.precioHora != null ? String(cancha.precioHora) : '',
    estado: cancha.estado ?? 'disponible',
  }
}

/** Reglas de validación del formulario. Devuelve un mensaje por campo. */
function validar(campos) {
  const errores = {}

  if (!campos.nombre.trim()) errores.nombre = 'Escribe un nombre para la cancha.'
  if (!campos.zona.trim()) errores.zona = 'Indica la zona.'
  if (!campos.sede.trim()) errores.sede = 'Indica la sede.'

  const precio = Number(campos.precioHora)
  if (campos.precioHora === '' || !Number.isFinite(precio)) {
    errores.precioHora = 'Escribe un precio por hora.'
  } else if (precio <= 0) {
    errores.precioHora = 'El precio debe ser mayor que cero.'
  }

  return errores
}

/**
 * CanchaForm — alta y edición de una cancha en un modal (FASE 4.1).
 *
 * No habla con la API: valida y entrega los datos limpios en `onGuardar`. La
 * puerta (crear o editar) la decide el panel según llegue `cancha` o no.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {import('../../api/types.js').Cancha|null} [props.cancha]  null = alta
 * @param {(datos: import('../../api/types.js').CanchaNueva) => void} props.onGuardar
 * @param {() => void} props.onCerrar
 * @param {boolean} [props.enviando]
 * @param {string|null} [props.error]
 */
export function CanchaForm({ open, cancha = null, onGuardar, onCerrar, enviando = false, error = null }) {
  if (!open) return null

  return (
    <CanchaFormInterno
      cancha={cancha}
      onGuardar={onGuardar}
      onCerrar={onCerrar}
      enviando={enviando}
      error={error}
    />
  )
}

function CanchaFormInterno({ cancha, onGuardar, onCerrar, enviando, error }) {
  const [campos, setCampos] = useState(() => aCampos(cancha))
  const [tocado, setTocado] = useState(false)

  const errores = validar(campos)
  const hayErrores = Object.keys(errores).length > 0

  function cambiar(campo, valor) {
    setCampos((prev) => ({ ...prev, [campo]: valor }))
  }

  function enviar(event) {
    event.preventDefault()
    setTocado(true)
    if (hayErrores) return

    onGuardar({
      nombre: campos.nombre,
      deporte: campos.deporte,
      deporteLabel: DEPORTES[campos.deporte]?.label,
      zona: campos.zona,
      sede: campos.sede,
      precioHora: Number(campos.precioHora),
      estado: campos.estado,
    })
  }

  const editando = Boolean(cancha)

  return (
    <Modal
      open
      onClose={onCerrar}
      title={editando ? 'Editar cancha' : 'Nueva cancha'}
      description={
        editando
          ? cancha.nombre
          : 'Se añadirá al catálogo y quedará disponible para reservar.'
      }
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" form="cancha-form" loading={enviando}>
            {editando ? 'Guardar cambios' : 'Crear cancha'}
          </Button>
        </>
      }
    >
      <form id="cancha-form" className="pa__form" onSubmit={enviar} noValidate>
        {error ? <Alert tone="danger" title="No se pudo guardar">{error}</Alert> : null}

        <Input
          label="Nombre"
          required
          value={campos.nombre}
          onChange={(event) => cambiar('nombre', event.target.value)}
          error={tocado ? errores.nombre : null}
          placeholder="Cancha La Bombonera 2"
        />

        <Select
          label="Deporte"
          required
          value={campos.deporte}
          onChange={(event) => cambiar('deporte', event.target.value)}
        >
          {DEPORTES_CLAVES.map((clave) => (
            <option key={clave} value={clave}>
              {DEPORTES[clave].label}
            </option>
          ))}
        </Select>

        <div className="pa__form-fila">
          <Input
            label="Zona"
            required
            value={campos.zona}
            onChange={(event) => cambiar('zona', event.target.value)}
            error={tocado ? errores.zona : null}
            placeholder="Zona Norte"
          />

          <Input
            label="Sede"
            required
            value={campos.sede}
            onChange={(event) => cambiar('sede', event.target.value)}
            error={tocado ? errores.sede : null}
            placeholder="Sede Central"
          />
        </div>

        <div className="pa__form-fila">
          <Input
            label="Precio por hora"
            required
            type="number"
            min="0"
            step="1000"
            affix="$"
            value={campos.precioHora}
            onChange={(event) => cambiar('precioHora', event.target.value)}
            error={tocado ? errores.precioHora : null}
            helper={
              campos.precioHora && !errores.precioHora
                ? formatPrecioHora(Number(campos.precioHora))
                : undefined
            }
          />

          <Select
            label="Estado"
            value={campos.estado}
            onChange={(event) => cambiar('estado', event.target.value)}
          >
            {Object.entries(ESTADOS_CANCHA).map(([clave, { label }]) => (
              <option key={clave} value={clave}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </form>
    </Modal>
  )
}
