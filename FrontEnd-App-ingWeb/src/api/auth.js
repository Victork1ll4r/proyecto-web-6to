import { ApiError, AUTH_BASE, USE_MOCK, demoraMock, request } from './client.js'
import { sinPassword } from './clientes.js'
import { USUARIO_DEMO } from '../lib/mockData.js'

/**
 * Endpoints de autenticación (auth-service, base `VITE_AUTH_BASE`).
 *
 *   POST /api/auth/register  → 201 · Cliente
 *   POST /api/auth/login     → 200 · { message, cliente, token }
 *   POST /api/auth/recover   → propuesto, aún no existe
 *
 * El backend devuelve el cliente dentro de la respuesta del login; aquí se
 * normaliza a una `Sesion` (`{token, usuario, rol}`) y se le quita `password`
 * antes de que salga del módulo (DESIGN_SYSTEM §6).
 */

/** Clave de `localStorage` donde `useAuth` guardará la sesión. */
export const SESION_KEY = 'sc.sesion'

/** El backend no maneja roles: todo el mundo entra como cliente. */
const ROL_POR_DEFECTO = 'cliente'

/**
 * Normaliza la respuesta del backend a nuestra `Sesion`.
 * @param {{cliente?: object, usuario?: object, token?: string, rol?: string}} datos
 * @returns {import('./types.js').Sesion}
 */
export function normalizarSesion(datos = {}) {
  const usuario = sinPassword(datos.usuario ?? datos.cliente ?? {})
  return {
    token: datos.token ?? '',
    usuario,
    rol: datos.rol ?? usuario.rol ?? ROL_POR_DEFECTO,
  }
}

/** Traduce los errores más frecuentes a copy en tuteo (§5). */
function mensajeDeError(error) {
  if (error instanceof ApiError && error.status === 401) {
    return 'El correo o la contraseña no coinciden. Revísalos e inténtalo otra vez.'
  }
  if (error instanceof ApiError && error.status === 400) {
    return 'Ese correo ya está registrado. Prueba iniciar sesión.'
  }
  return error instanceof Error ? error.message : 'No pudimos completar la operación. Inténtalo de nuevo.'
}

/**
 * Inicia sesión.
 * @param {{email: string, password: string}} credenciales
 * @returns {Promise<import('./types.js').Sesion>}
 */
export async function login({ email, password } = {}) {
  if (!email || !password) {
    throw new ApiError('Escribe tu correo y tu contraseña para continuar.', { status: 400 })
  }

  if (USE_MOCK) {
    const sesion = normalizarSesion({
      token: 'mock-token-sistema-canchas',
      usuario: { ...USUARIO_DEMO, email },
      rol: email.startsWith('admin') ? 'admin' : ROL_POR_DEFECTO,
    })
    return demoraMock(sesion)
  }

  try {
    const datos = await request('/api/auth/login', {
      method: 'POST',
      base: AUTH_BASE,
      body: { email, password },
    })
    return normalizarSesion(datos)
  } catch (error) {
    throw new ApiError(mensajeDeError(error), { status: error?.status ?? 0, causa: error })
  }
}

/**
 * Registra una cuenta nueva.
 * @param {{nombre: string, apellido?: string, email: string, telefono?: string, password: string}} datos
 * @returns {Promise<import('./types.js').Sesion>}
 */
export async function register(datos = {}) {
  if (!datos.email || !datos.password) {
    throw new ApiError('Para crear la cuenta necesitamos tu correo y una contraseña.', { status: 400 })
  }

  if (USE_MOCK) {
    const sesion = normalizarSesion({
      token: 'mock-token-sistema-canchas',
      usuario: { ...USUARIO_DEMO, ...sinPassword(datos) },
    })
    return demoraMock(sesion)
  }

  try {
    const cliente = await request('/api/auth/register', {
      method: 'POST',
      base: AUTH_BASE,
      body: datos,
    })
    return normalizarSesion({ usuario: cliente, token: '' })
  } catch (error) {
    throw new ApiError(mensajeDeError(error), { status: error?.status ?? 0, causa: error })
  }
}

/**
 * Envía un correo de recuperación. El endpoint todavía no existe: en modo mock
 * resuelve siempre; contra el backend real responderá 404 hasta que se
 * implemente.
 * @param {{email: string}} datos
 * @returns {Promise<{ok: true}>}
 */
export async function recover({ email } = {}) {
  if (!email) {
    throw new ApiError('Escribe el correo con el que te registraste.', { status: 400 })
  }

  if (USE_MOCK) return demoraMock({ ok: true })

  await request('/api/auth/recover', { method: 'POST', base: AUTH_BASE, body: { email } })
  return { ok: true }
}

/* ── Persistencia de la sesión (segura sin DOM) ─────────────────────────── */

/** Guarda la sesión en `localStorage`. No hace nada fuera del navegador. */
export function guardarSesion(sesion) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESION_KEY, JSON.stringify(sesion))
}

/** Lee la sesión guardada, o `null`. Nunca lanza por JSON corrupto. */
export function leerSesion() {
  if (typeof window === 'undefined') return null
  try {
    const crudo = window.localStorage.getItem(SESION_KEY)
    return crudo ? JSON.parse(crudo) : null
  } catch {
    return null
  }
}

/** Borra la sesión guardada. */
export function borrarSesion() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESION_KEY)
}
