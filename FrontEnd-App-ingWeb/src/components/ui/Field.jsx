import { useId, useState } from 'react'
import { cx } from '../../lib/cx.js'
import { Icon } from './Icon.jsx'

/**
 * a11y — conecta el mensaje de ayuda o de error con el control.
 * Devuelve undefined cuando no hay ninguno, para no emitir atributos vacíos.
 */
function a11y(id, { error, helper }) {
  const id_ = error ? `${id}-error` : helper ? `${id}-helper` : undefined
  return id_ ? { 'aria-describedby': id_ } : {}
}

/** Campo: etiqueta + mensaje. Nunca se reemplaza por placeholder (§3.2). */
export function Field({ id, label, helper, error, required, className = '', children }) {
  return (
    <div className={cx('c-field', error && 'c-field--invalid', className)}>
      {label ? (
        <label className="c-field__label" htmlFor={id}>
          {label}
          {required ? (
            <span className="c-field__req" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <p className="c-field__msg c-field__msg--error" id={`${id}-error`} role="alert">
          <Icon name="error" size={16} />
          {error}
        </p>
      ) : helper ? (
        <p className="c-field__msg" id={`${id}-helper`}>
          {helper}
        </p>
      ) : null}
    </div>
  )
}

/** Input de texto. */
export function Input({
  label,
  helper,
  error,
  required,
  icon,
  affix,
  suffix,
  className = '',
  inputClassName = '',
  ...rest
}) {
  const autoId = useId()
  const id = rest.id ?? autoId

  return (
    <Field
      id={id}
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={className}
    >
      <div className={cx('c-input', error && 'c-input--invalid', rest.disabled && 'c-input--disabled')}>
        {affix ? <span className="c-input__affix">{affix}</span> : null}
        {icon ? <Icon name={icon} size={20} /> : null}

        <input
          id={id}
          className={cx('c-input__el', inputClassName)}
          aria-invalid={error ? true : undefined}
          {...a11y(id, { error, helper })}
          {...rest}
        />

        {suffix}
      </div>
    </Field>
  )
}

/** Campo de contraseña con botón de mostrar/ocultar. */
export function PasswordInput({ label = 'Contraseña', helper, error, ...rest }) {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      type={visible ? 'text' : 'password'}
      label={label}
      helper={helper}
      error={error}
      icon="lock"
      {...rest}
      suffix={
        <button
          type="button"
          className="c-input__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={-1}
        >
          <Icon name={visible ? 'visibility_off' : 'visibility'} size={20} />
        </button>
      }
    />
  )
}

/** Select nativo, estilizado con chevron propio. */
export function Select({
  label,
  helper,
  error,
  required,
  icon,
  children,
  className = '',
  selectClassName = '',
  ...rest
}) {
  const autoId = useId()
  const id = rest.id ?? autoId

  return (
    <Field
      id={id}
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={cx(
          'c-input c-select-wrap',
          error && 'c-input--invalid',
          rest.disabled && 'c-input--disabled',
        )}
      >
        {icon ? <Icon name={icon} size={20} /> : null}

        <select
          id={id}
          className={cx('c-input__el c-select', selectClassName)}
          aria-invalid={error ? true : undefined}
          {...a11y(id, { error, helper })}
          {...rest}
        >
          {children}
        </select>

        <Icon name="expand_more" size={20} className="c-input__chevron" />
      </div>
    </Field>
  )
}

/** Área de texto multilínea. */
export function Textarea({ label, helper, error, required, className = '', ...rest }) {
  const autoId = useId()
  const id = rest.id ?? autoId

  return (
    <Field
      id={id}
      label={label}
      helper={helper}
      error={error}
      required={required}
      className={className}
    >
      <textarea
        id={id}
        className="c-textarea"
        aria-invalid={error ? true : undefined}
        {...a11y(id, { error, helper })}
        {...rest}
      />
    </Field>
  )
}

/** Casilla de verificación. */
export function Checkbox({ label, className = '', inputClassName = '', ...rest }) {
  const autoId = useId()
  const id = rest.id ?? autoId

  return (
    <label className={cx('c-check', className)} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={cx('c-check__input', inputClassName)}
        {...rest}
      />
      <span>{label}</span>
    </label>
  )
}

/** Botón de opción. */
export function Radio({ label, name, className = '', ...rest }) {
  const autoId = useId()
  const id = rest.id ?? autoId

  return (
    <label className={cx('c-check', className)} htmlFor={id}>
      <input id={id} type="radio" name={name} className="c-check__input" {...rest} />
      <span>{label}</span>
    </label>
  )
}

/** Interruptor con etiqueta y descripción. */
export function Switch({
  label,
  description,
  checked = false,
  disabled,
  className = '',
  ...rest
}) {
  const autoId = useId()
  const id = rest.id ?? autoId

  return (
    <div className={cx('c-switch', className)}>
      <label className="c-switch__text" htmlFor={id}>
        <span className="c-switch__title">{label}</span>
        {description ? <span className="c-switch__desc">{description}</span> : null}
      </label>

      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="c-switch__track"
        disabled={disabled}
        onClick={() => rest.onChange?.(!checked)}
        {...rest}
      >
        <span className="c-switch__knob" />
      </button>
    </div>
  )
}
