import { cx } from '../../lib/cx.js'
import { Icon } from './Icon.jsx'

/**
 * StatCard — tarjeta de métrica del panel admin (§3.13).
 * `delta` admite el prefijo que quieras; `direction` decide color e icono.
 */
export function StatCard({
  label,
  value,
  delta,
  direction = 'up',
  icon,
  className = '',
}) {
  const arrows = {
    up: 'trending_up',
    down: 'trending_down',
    flat: 'trending_flat',
  }

  return (
    <div className={cx('c-stat', className)}>
      <div className="c-stat__head">
        <p className="c-stat__label">{label}</p>
        {icon ? (
          <span className="c-stat__icon" aria-hidden="true">
            <Icon name={icon} size={20} />
          </span>
        ) : null}
      </div>

      <p className="c-stat__value">{value}</p>

      {delta ? (
        <p className={cx('c-stat__delta', `c-stat__delta--${direction}`)}>
          <Icon name={arrows[direction] ?? arrows.flat} size={18} weight={500} />
          {delta}
        </p>
      ) : null}
    </div>
  )
}
