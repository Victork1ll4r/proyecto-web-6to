import { cx } from '../../lib/cx.js'

/**
 * Icon — icono de Material Symbols Rounded.
 * Los nombres son ligaduras del set: 'sports_soccer', 'search', 'calendar_month'.
 * Catálogo: https://fonts.google.com/icons
 */
export function Icon({
  name,
  size = 20,
  weight = 400,
  fill = false,
  title,
  className = '',
  style,
}) {
  return (
    <span
      className={cx('c-icon', className)}
      style={
        {
          '--icon-size': `${size}px`,
          '--icon-weight': weight,
          '--icon-fill': fill ? 1 : 0,
          ...style,
        }
      }
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      {name}
    </span>
  )
}

/** Spinner — indicador de carga de tamaño arbitrario. */
export function Spinner({ size = 18, label = 'Cargando' }) {
  return (
    <span
      className="c-spinner"
      style={{ '--spinner-size': `${size}px` }}
      role="status"
      aria-label={label}
    />
  )
}
