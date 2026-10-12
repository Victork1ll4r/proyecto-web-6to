/**
 * Cliente HTTP del frontend.
 *
 * Envoltorio mínimo sobre `fetch` (sin axios) que centraliza:
 *   - las bases de cada servicio (user-service y auth-service),
 *   - la serialización JSON y el manejo de errores con copy en español,
 *   - el interruptor mock ↔ API real.
 *
 * Las páginas nunca llaman a `fetch` directamente: usan los módulos de
 * `src/api/` (canchas, reservas, clientes, auth) y estos deciden según
 * `USE_MOCK`. Así, el día que el backend exponga canchas y reservas, basta
 * con poner `VITE_USE_MOCK=false` sin tocar ningún componente.
 */

const normalizarBase = (valor, porDefecto) =>
  (valor ?? porDefecto).toString().replace(/\/+$/, '')

/** Base de user-service (clientes). */
export const API_BASE = normalizarBase(import.meta.env.VITE_API_BASE, 'http://localhost:8080')

/** Base de auth-service (login / registro). */
export const AUTH_BASE = normalizarBase(import.meta.env.VITE_AUTH_BASE, 'http://localhost:8081')

/**
 * Interruptor global. Por defecto `true`: si nadie define la variable, la app
 * arranca con mocks en lugar de intentar contra un backend que quizá no está.
 */
export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK ?? 'true').toString().toLowerCase() !== 'false'

/** Milisegundos que fingen la latencia de red en los mocks. */
export const DEMORA_MOCK = 220

/**
 * Error de API con `status` y mensaje ya listo para mostrar (tuteo, con
 * siguiente paso — DESIGN_SYSTEM §5).
 */
export class ApiError extends Error {
  /**
   * @param {string} mensaje
   * @param {{status?: number, causa?: unknown}} [detalles]
   */
  constructor(mensaje, { status = 0, causa } = {}) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.causa = causa
  }
}

/** ¿Se canceló la petición? Un abort no es un error para la vista. */
export function esAborto(error) {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * Petición JSON genérica.
 * @param {string} ruta    p. ej. "/api/canchas" o "/api/canchas/1"
 * @param {object} [opciones]
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [opciones.method]
 * @param {unknown} [opciones.body]   se serializa a JSON
 * @param {string} [opciones.base]    API_BASE por defecto
 * @param {AbortSignal} [opciones.signal]
 * @param {Record<string,string>} [opciones.headers]
 * @returns {Promise<any>}
 */
export async function request(ruta, { method = 'GET', body, base = API_BASE, signal, headers } = {}) {
  let respuesta

  try {
    respuesta = await fetch(`${base}${ruta}`, {
      method,
      signal,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (esAborto(error)) throw error
    throw new ApiError(
      'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
      { causa: error },
    )
  }

  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const mensaje =
      (datos && (datos.message || datos.error)) ||
      `El servidor respondió ${respuesta.status}. Inténtalo de nuevo en unos segundos.`
    throw new ApiError(mensaje, { status: respuesta.status })
  }

  return datos
}

/**
 * Construye una query string ignorando valores vacíos.
 * @param {Record<string, string|number|boolean|null|undefined>} params
 * @returns {string} "" o "?clave=valor"
 */
export function query(params = {}) {
  const pares = Object.entries(params).filter(
    ([, valor]) => valor !== undefined && valor !== null && valor !== '',
  )
  if (pares.length === 0) return ''
  const usp = new URLSearchParams(pares.map(([clave, valor]) => [clave, String(valor)]))
  return `?${usp.toString()}`
}

/**
 * Respuesta simulada de los mocks: copia el dato, espera y lo devuelve.
 *
 * La copia evita que la vista mute el arreglo de `mockData.js` por referencia.
 * @template T
 * @param {T} dato
 * @param {number} [ms]
 * @returns {Promise<T>}
 */
export function demoraMock(dato, ms = DEMORA_MOCK) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(dato)), ms)
  })
}

/** Aborta pidiendo un recurso inexistente, con el mismo formato que la API. */
export function noEncontrado(recurso = 'recurso') {
  return new ApiError(`No encontramos ese ${recurso}. Puede que ya no exista.`, { status: 404 })
}
