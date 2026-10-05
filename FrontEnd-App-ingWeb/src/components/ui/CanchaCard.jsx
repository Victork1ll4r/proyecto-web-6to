import { formatCurrency } from '../../lib/cx.js'
import { getDeporte } from '../../lib/deportes.js'
import { Badge, Chip } from './Chip.jsx'
import { Icon } from './Icon.jsx'
import { Button } from './Button.jsx'

/**
 * CanchaCard — tarjeta de cancha del catálogo.
 *
 * Anatomía: imagen 16:10 con degradado oscuro → badge de estado → chip de
 * deporte → título y sede → etiquetas de características → valoración →
 * precio → acción.
 *
 * Sobre el CTA: la regla de "una sola acción primaria por pantalla"
 * (DESIGN_SYSTEM §1) admite excepción en un catálogo. Aquí cada tarjeta es
 * un objetivo de decisión distinto, y la acción repetida —Reservar turno—
 * es el propósito de la pantalla, no una competencia con otra CTA. Se mantiene
 * primaria; si el catálogo creciera, conviene abrir detalle en una sola acción
 * secundaria y reservar el verde para el detalle.
 *
 * `deporteLabel` permite variantes ("Fútbol 7", "Fútbol 5") sin ensuciar el
 * catálogo de deportes, que sigue siendo la fuente del color y el icono.
 */
export function CanchaCard({ cancha, onReservar }) {
  const {
    nombre,
    deporte,
    deporteLabel,
    zona,
    sede,
    tags = [],
    precioHora,
    imagenUrl,
    puntuacion,
    resenas,
    estado = 'disponible',
  } = cancha

  const dep = getDeporte(deporte)
  const etiquetaDeporte = deporteLabel ?? dep.label

  return (
    <article className="c-cancha">
      <div className="c-cancha__media">
        {imagenUrl ? (
          <img className="c-cancha__img" src={imagenUrl} alt={`${nombre}, ${etiquetaDeporte}`} loading="lazy" />
        ) : null}

        <div className="c-cancha__overlay" />

        {estado === 'disponible' ? (
          <div className="c-cancha__badge">
            <Badge tone="disponible" icon="check_circle">
              Disponible
            </Badge>
          </div>
        ) : null}

        <div className="c-cancha__sport">
          <Chip dot={dep.color}>{etiquetaDeporte}</Chip>
        </div>
      </div>

      <div className="c-cancha__body">
        <div>
          <h3 className="c-cancha__title">{nombre}</h3>
          <p className="c-cancha__loc">
            <Icon name="location_on" size={18} />
            <span className="u-truncate">{[zona, sede].filter(Boolean).join(' · ')}</span>
          </p>
        </div>

        {tags.length > 0 ? (
          <ul className="c-cancha__tags">
            {tags.map((tag) => (
              <li className="c-cancha__tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {puntuacion ? (
          <p className="c-cancha__ratingrow">
            <Icon name="star" size={18} fill weight={500} className="c-cancha__star" />
            <strong className="u-tabular">{puntuacion}</strong>
            <span className="u-muted u-tabular">({resenas} reseñas)</span>
          </p>
        ) : null}
      </div>

      <div className="c-cancha__footer">
        <div className="c-cancha__pricerow">
          <span className="u-label">Precio por turno</span>
          <p className="c-cancha__price">
            {formatCurrency(precioHora)} <span className="c-cancha__price-unit">/ hora</span>
          </p>
        </div>

        <Button fullWidth iconRight="calendar_today" onClick={() => onReservar?.(cancha)}>
          Reservar turno
        </Button>
      </div>
    </article>
  )
}