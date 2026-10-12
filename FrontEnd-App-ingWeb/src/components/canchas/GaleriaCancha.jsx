import { useState } from 'react'
import { cx } from '../../lib/cx.js'
import { Icon } from '../ui/Icon.jsx'

/**
 * GaleríaCancha — galería con miniaturas (§4.3 del sistema de diseño).
 *
 * La imagen grande cambia al pulsar una miniatura. Las miniaturas son
 * `<button>`, así que se recorren y activan con teclado sin trabajo extra;
 * la selección se anuncia con `aria-pressed`. Portado de la galería de Stitch,
 * que usaba `<div onclick>`.
 *
 * @param {object} props
 * @param {string[]} props.imagenes
 * @param {string} props.nombre          nombre de la cancha (alt y contexto)
 * @param {string} [props.deporteLabel]  etiqueta sobre la imagen
 * @param {string} [props.dot]           color del punto de deporte (token)
 * @param {string} [props.certificacion] sello opcional en la esquina
 */
export function GaleriaCancha({ imagenes = [], nombre = '', deporteLabel, dot, certificacion }) {
  const [activa, setActiva] = useState(0)

  if (imagenes.length === 0) return null

  const indice = Math.min(activa, imagenes.length - 1)

  return (
    <div className="c-galeria">
      <figure className="c-galeria__main">
        <img
          className="c-galeria__img"
          src={imagenes[indice]}
          alt={`${nombre}${deporteLabel ? `, ${deporteLabel}` : ''} — vista ${indice + 1} de ${imagenes.length}`}
        />

        {deporteLabel || certificacion ? (
          <figcaption className="c-galeria__badges">
            {deporteLabel ? (
              <span className="c-galeria__tag">
                <span className="c-galeria__dot" style={{ '--dot': dot }} aria-hidden="true" />
                {deporteLabel}
              </span>
            ) : null}

            {certificacion ? (
              <span className="c-galeria__cert">
                <Icon name="verified" size={14} />
                {certificacion}
              </span>
            ) : null}
          </figcaption>
        ) : null}
      </figure>

      {imagenes.length > 1 ? (
        <div className="c-galeria__thumbs" role="group" aria-label="Más vistas de la cancha">
          {imagenes.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className={cx('c-galeria__thumb', i === indice && 'c-galeria__thumb--on')}
              onClick={() => setActiva(i)}
              aria-pressed={i === indice}
              aria-label={`Ver vista ${i + 1} de ${imagenes.length}`}
            >
              <img className="c-galeria__thumbimg" src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
