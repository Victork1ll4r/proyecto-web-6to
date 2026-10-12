import { USE_MOCK, demoraMock, noEncontrado, request } from './client.js'
import { CLIENTES } from '../lib/mockData.js'

/**
 * Endpoints de cliente (user-service, base `VITE_API_BASE`).
 *
 *   GET /api/clientes            → Cliente[]
 *   GET /api/clientes/:id        → Cliente
 *   GET /api/clientes/email/:email → Cliente
 *
 * Estos endpoints **sí existen** en el backend. Con `VITE_USE_MOCK=true` se
 * responden desde `lib/mockData.js` para no depender del servicio arrancado.
 *
 * Aviso de seguridad (DESIGN_SYSTEM §6): el backend devuelve `password` en
 * claro dentro del objeto cliente. Todo lo que salga de este módulo pasa por
 * `sinPassword()`, de modo que el campo nunca llega a un componente ni se
 * guarda en el estado de la aplicación.
 */

/**
 * Devuelve una copia del cliente sin el campo `password`.
 * @template {object} T
 * @param {T} cliente
 * @returns {T}
 */
export function sinPassword(cliente) {
  if (!cliente || typeof cliente !== 'object') return cliente
  const copia = { ...cliente }
  delete copia.password
  return copia
}

/**
 * Lista de clientes.
 * @returns {Promise<import('./types.js').Cliente[]>}
 */
export async function list() {
  if (USE_MOCK) {
    const datos = await demoraMock(CLIENTES)
    return datos.map(sinPassword)
  }
  const datos = await request('/api/clientes')
  return Array.isArray(datos) ? datos.map(sinPassword) : []
}

/**
 * Un cliente por id.
 * @param {number|string} id
 * @returns {Promise<import('./types.js').Cliente>}
 */
export async function getById(id) {
  if (USE_MOCK) {
    const cliente = CLIENTES.find((c) => c.id === Number(id))
    if (!cliente) throw noEncontrado('cliente')
    return sinPassword(await demoraMock(cliente))
  }
  return sinPassword(await request(`/api/clientes/${encodeURIComponent(id)}`))
}

/**
 * Un cliente por correo. Es la vía para resolver el perfil tras el login.
 * @param {string} email
 * @returns {Promise<import('./types.js').Cliente>}
 */
export async function getByEmail(email) {
  if (USE_MOCK) {
    const buscado = String(email ?? '').trim().toLowerCase()
    const cliente = CLIENTES.find((c) => c.email.toLowerCase() === buscado)
    if (!cliente) throw noEncontrado('cliente')
    return sinPassword(await demoraMock(cliente))
  }
  return sinPassword(await request(`/api/clientes/email/${encodeURIComponent(email)}`))
}
