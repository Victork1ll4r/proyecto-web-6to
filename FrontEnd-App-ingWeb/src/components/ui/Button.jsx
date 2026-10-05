import { cx } from '../../lib/cx.js'
import { Icon, Spinner } from './Icon.jsx'

/**
 * Button
 *
 * Variantes: primary · secondary · ghost · danger · soft
 * Tamaños:   sm (36) · md (44) · lg (52)
 *
 * El botón primario es verde #00B86B con texto carbón #0D1211 (§2.1).
 * Solo debe existir uno por pantalla (§1, principio rector).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  iconOnly = false,
  loading = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(
        'c-btn',
        `c-btn--${variant}`,
        `c-btn--${size}`,
        iconOnly && 'c-btn--icon',
        fullWidth && 'c-btn--full',
        loading && 'c-btn--loading',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 20 : 18} />
      ) : icon ? (
        <Icon name={icon} size={size === 'sm' ? 18 : 20} />
      ) : null}

      {children ? <span className="c-btn__label">{children}</span> : null}

      {!loading && iconRight ? (
        <Icon name={iconRight} size={size === 'sm' ? 18 : 20} />
      ) : null}
    </button>
  )
}
