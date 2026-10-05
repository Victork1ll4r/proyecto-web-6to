import { cx } from '../../lib/cx.js'
import { Icon } from './Icon.jsx'

/**
 * Chip — filtro o etiqueta.
 * `dot` pinta el punto de color de la disciplina; `selected` lo enciende.
 */
export function Chip({ selected = false, dot, icon, count, onClick, className = '', children }) {
  const classNames = cx('c-chip', selected && 'c-chip--on', className)

  const content = (
    <>
      {dot ? <span className="c-chip__dot" style={{ '--dot': dot }} /> : null}
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
      {count != null ? <span className="u-tabular">{count}</span> : null}
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={classNames} onClick={onClick} aria-pressed={selected}>
        {content}
      </button>
    )
  }

  return <span className={classNames}>{content}</span>
}

/** Filas de chips con desplazamiento horizontal en móvil. */
export function ChipRow({ children, className = '' }) {
  return (
    <div className={cx('u-row', className)} style={{ flexWrap: 'wrap' }}>
      {children}
    </div>
  )
}

const TONES = {
  ok: 'ok',
  success: 'ok',
  disponible: 'ok',
  confirmada: 'ok',
  completada: 'ok',
  activo: 'ok',
  pendiente: 'warn',
  warning: 'warn',
  ocupado: 'danger',
  ocupada: 'danger',
  cancelada: 'neutral',
  rechazado: 'danger',
  inactivo: 'neutral',
  info: 'info',
  neutral: 'neutral',
}

/**
 * Badge — estado. Siempre con texto: el estado nunca depende solo del color
 * (§2.1 y §7, punto 4).
 */
export function Badge({ tone = 'neutral', icon, children, className = '' }) {
  const resolved = TONES[tone] ?? 'neutral'

  return (
    <span className={cx('c-badge', `c-badge--${resolved}`, className)}>
      {icon ? <Icon name={icon} size={16} weight={500} /> : null}
      {children}
    </span>
  )
}

/** Avatar circular. Si no hay `src`, muestra iniciales. */
export function Avatar({ name = '', src, size = 40, ring = false, neutral = false, className = '' }) {
  const label = (name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  const style = { '--avatar-size': `${size}px` }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cx('c-avatar', ring && 'c-avatar--ring', className)}
        style={style}
      />
    )
  }

  return (
    <span
      className={cx('c-avatar', ring && 'c-avatar--ring', neutral && 'c-avatar--neutral', className)}
      style={style}
      title={name}
      aria-hidden={name ? undefined : 'true'}
    >
      {label || '?'}
    </span>
  )
}

/** Superficie base. `pad` añade el padding estándar de 20 px. */
export function Card({ pad = true, flat = false, radius, shadow, className = '', children, ...rest }) {
  return (
    <div
      className={cx('c-card', pad && 'c-card--pad', flat && 'c-card--flat', className)}
      style={{ '--card-radius': radius, '--card-shadow': shadow }}
      {...rest}
    >
      {children}
    </div>
  )
}
