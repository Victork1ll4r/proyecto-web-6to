import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../lib/cx.js'
import { Icon } from './Icon.jsx'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal — diálogo modal (§3.8).
 *
 * Cumple los requisitos de accesibilidad del sistema (§7):
 *   - foco atrapado dentro del diálogo
 *   - Escape cierra
 *   - el foco vuelve al elemento que lo abrió
 *   - el fondo no hace scroll
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  showClose = true,
  children,
  footer,
}) {
  const dialogRef = useRef(null)
  const restoreTo = useRef(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open) return

    restoreTo.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Mueve el foco al primer control utilizable del diálogo.
    const first = dialogRef.current?.querySelector(FOCUSABLE)
    first?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const nodes = dialogRef.current?.querySelectorAll(FOCUSABLE)
      if (!nodes?.length) return

      const list = Array.from(nodes)
      const start = list[0]
      const end = list[list.length - 1]

      if (event.shiftKey && document.activeElement === start) {
        event.preventDefault()
        end.focus()
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault()
        start.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      restoreTo.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="c-modal__overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        ref={dialogRef}
        className={cx('c-modal', size === 'lg' && 'c-modal--lg')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
      >
        {showClose ? (
          <button type="button" className="c-modal__close" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={20} />
          </button>
        ) : null}

        {title ? (
          <div className="c-modal__head">
            <h2 className="c-modal__title" id={titleId}>
              {title}
            </h2>
            {description ? (
              <p className="c-modal__desc" id={descId}>
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        {children}

        {footer ? <div className="c-modal__foot">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
