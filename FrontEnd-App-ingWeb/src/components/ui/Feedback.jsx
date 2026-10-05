import { cx } from '../../lib/cx.js'
import { Icon } from './Icon.jsx'

const ALERT_ICONS = {
  ok: 'check_circle',
  warn: 'warning',
  danger: 'error',
  info: 'info',
}

/** Alert — aviso dentro del flujo, con barra lateral de color (§3.9). */
export function Alert({ tone = 'info', title, children, className = '', ...rest }) {
  return (
    <div
      className={cx('c-alert', `c-alert--${tone}`, className)}
      role={tone === 'danger' ? 'alert' : 'status'}
      {...rest}
    >
      <Icon name={ALERT_ICONS[tone] ?? ALERT_ICONS.info} size={20} className="c-alert__icon" />

      <div className="c-alert__body">
        {title ? <span className="c-alert__title">{title}</span> : null}
        {children ? <span>{children}</span> : null}
      </div>
    </div>
  )
}

/** Toast — confirmación efímera. */
export function Toast({ tone = 'ok', title, children, onClose, className = '' }) {
  return (
    <div
      className={cx('c-toast', `c-toast--${tone}`, className)}
      role="status"
      aria-live="polite"
    >
      <Icon name={ALERT_ICONS[tone] ?? ALERT_ICONS.ok} size={22} weight={500} className="c-toast__icon" />

      <div className="c-alert__body">
        {title ? <span className="c-alert__title">{title}</span> : null}
        {children ? <span className="u-muted">{children}</span> : null}
      </div>

      {onClose ? (
        <button type="button" className="c-table__action" onClick={onClose} aria-label="Cerrar aviso">
          <Icon name="close" size={20} />
        </button>
      ) : null}
    </div>
  )
}

/**
 * EmptyState — sin datos. Nunca sin acción siguiente (§3.11).
 * `action` es un <Button> ya construido por quien lo usa.
 */
export function EmptyState({
  icon = 'search_off',
  title,
  description,
  action,
  tone = 'neutral',
  className = '',
}) {
  return (
    <div className={cx('c-empty', tone !== 'neutral' && `c-empty--${tone}`, className)}>
      <span className="c-empty__icon">
        <Icon name={icon} size={40} />
      </span>

      {title ? <h3 className="c-empty__title">{title}</h3> : null}
      {description ? <p className="c-empty__text">{description}</p> : null}
      {action ? <div style={{ marginTop: 'var(--sp-2)' }}>{action}</div> : null}
    </div>
  )
}

/** Skeleton — placeholder de carga que conserva la geometría real (§3.12). */
export function Skeleton({ width, height = 16, radius, className = '', style, ...rest }) {
  return (
    <span
      className={cx('c-skeleton', className)}
      style={{ width, height, '--radius': radius, borderRadius: radius, ...style }}
      aria-hidden="true"
      {...rest}
    />
  )
}

/** Medallón: círculo de icono destacado para confirmaciones y estados. */
export function Medallion({ icon, size = 64, tone = 'brand', className = '' }) {
  return (
    <span
      className={cx('c-medallion', tone !== 'brand' && `c-medallion--${tone}`, className)}
      style={{ '--medallion-size': `${size}px` }}
      aria-hidden="true"
    >
      <Icon name={icon} size={Math.round(size * 0.45)} weight={500} />
    </span>
  )
}
