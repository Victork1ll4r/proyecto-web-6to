import { useState } from 'react'
import { cx } from '../../lib/cx.js'
import { Button } from '../ui/Button.jsx'
import { Alert } from '../ui/Feedback.jsx'
import { Textarea } from '../ui/Field.jsx'
import { Icon } from '../ui/Icon.jsx'
import { Modal } from '../ui/Modal.jsx'

const PUNTOS = [1, 2, 3, 4, 5]

const ETIQUETA_PUNTOS = {
  1: 'Mala',
  2: 'Regular',
  3: 'Buena',
  4: 'Muy buena',
  5: 'Excelente',
}

/**
 * CalificarReservaModal — calificación de un turno ya jugado (FASE 3, §3.1).
 *
 * El endpoint de reseñas todavía no existe, así que no envía nada: devuelve
 * `{puntos, comentario}` a la página, que hoy lo guarda en memoria (y lo anota
 * como pendiente en el plan). La cancha ya tiene `puntuacion` y `resenas` en el
 * mock, así que el día que exista el endpoint solo cambia `onEnviar`.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {import('../../api/types.js').Reserva|null} props.reserva
 * @param {import('../../api/types.js').Cancha|null} [props.cancha]
 * @param {(datos: {puntos: number, comentario: string}) => void} props.onEnviar
 * @param {() => void} props.onCerrar
 * @param {boolean} [props.enviando]
 * @param {string|null} [props.error]
 */
export function CalificarReservaModal({
  open,
  reserva,
  cancha = null,
  onEnviar,
  onCerrar,
  enviando = false,
  error = null,
}) {
  const [puntos, setPuntos] = useState(0)
  const [comentario, setComentario] = useState('')

  if (!open || !reserva) return null

  return (
    <Modal
      open={open}
      onClose={onCerrar}
      title="Califica tu experiencia"
      description={`¿Cómo estuvo ${cancha?.nombre ?? 'la cancha'}? Tu opinión ayuda a otros jugadores.`}
      footer={
        <>
          <Button variant="ghost" onClick={onCerrar} disabled={enviando}>
            Ahora no
          </Button>
          <Button
            icon="send"
            loading={enviando}
            disabled={puntos === 0}
            onClick={() => onEnviar?.({ puntos, comentario: comentario.trim() })}
          >
            Enviar calificación
          </Button>
        </>
      }
    >
      <div className="c-estrellas" role="group" aria-label="Puntuación de 1 a 5 estrellas">
        {PUNTOS.map((n) => (
          <button
            key={n}
            type="button"
            className={cx('c-estrella', n <= puntos && 'c-estrella--on')}
            onClick={() => setPuntos(n)}
            aria-pressed={n <= puntos}
            aria-label={`${n} de 5`}
          >
            <Icon name="star" size={28} fill={n <= puntos} />
          </button>
        ))}

        <span className="c-estrellas__texto">
          {puntos ? ETIQUETA_PUNTOS[puntos] : 'Toca una estrella'}
        </span>
      </div>

      {error ? (
        <Alert tone="danger" title="No pudimos guardar la calificación">
          {error}
        </Alert>
      ) : null}

      <Textarea
        label="Comentario"
        helper="Opcional. Cuéntanos cómo estuvo el turno."
        rows={3}
        value={comentario}
        onChange={(evento) => setComentario(evento.target.value)}
      />
    </Modal>
  )
}
