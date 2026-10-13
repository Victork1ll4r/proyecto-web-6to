import { useEffect, useState } from 'react'

/**
 * Enrutado mínimo por hash.
 *
 * El proyecto sigue sin enrutador, así que se resuelve con el hash. Este
 * módulo queda separado de App.jsx porque un archivo que exporta un hook y un
 * componente a la vez rompe el fast refresh de Vite.
 *
 *   #/                 catálogo de canchas
 *   #/estilo           catálogo de componentes (validador del diseño)
 *   #/cancha/:id       detalle y reserva de una cancha
 *   #/mis-reservas     historial y gestión de turnos del usuario
 *   #/admin            panel de control (administración)
 *
 * Los patrones admiten un segmento con `:nombre`, que se recoge en `params`.
 * Cuando llegue el enrutador real, solo se sustituye este archivo.
 */

export const RUTAS = {
  '/': { titulo: 'Explorar canchas' },
  '/estilo': { titulo: 'Style guide' },
  '/cancha/:id': { titulo: 'Detalle de cancha' },
  '/mis-reservas': { titulo: 'Mis reservas' },
  '/admin': { titulo: 'Panel de administración' },
}

/** Ruta de respaldo cuando el hash no coincide con ningún patrón. */
export const RUTA_INICIO = '/'

/** ¿Estamos en el navegador? Lo permite prerenderizar y testear sin DOM. */
const enNavegador = () => typeof window !== 'undefined'

/** "/cancha/3" → ["cancha", "3"]; "/" → []. */
const segmentos = (ruta) => ruta.split('/').filter(Boolean)

/**
 * Empareja una ruta contra los patrones declarados.
 * @param {string} hash  ruta sin el `#` inicial
 * @returns {{ruta: string, params: Record<string,string>}|null}
 */
export function emparejar(hash) {
  const partes = segmentos(hash)

  for (const patron of Object.keys(RUTAS)) {
    const referencia = segmentos(patron)
    if (referencia.length !== partes.length) continue

    const params = {}
    let coincide = true

    for (let i = 0; i < referencia.length; i += 1) {
      const trozo = referencia[i]
      if (trozo.startsWith(':')) {
        params[trozo.slice(1)] = decodeURIComponent(partes[i])
      } else if (trozo !== partes[i]) {
        coincide = false
        break
      }
    }

    if (coincide) return { ruta: patron, params }
  }

  return null
}

/** Ruta activa + sus parámetros. Nunca lanza; cae en la ruta de inicio. */
export function rutaActual() {
  if (!enNavegador()) return { ruta: RUTA_INICIO, params: {} }
  const hash = window.location.hash.replace(/^#/, '') || RUTA_INICIO
  return emparejar(hash) ?? { ruta: RUTA_INICIO, params: {} }
}

/** Ruta del detalle de una cancha. Centraliza el formato del enlace. */
export function rutaDeCancha(id) {
  return `/cancha/${encodeURIComponent(id)}`
}

/** Ruta del historial de reservas del usuario. */
export function rutaDeMisReservas() {
  return '/mis-reservas'
}

/** Ruta del panel de administración. */
export function rutaDeAdmin() {
  return '/admin'
}

/** Cambia el hash y deja que `hashchange` actualice la vista. Sin DOM, no-op. */
export function navegar(ruta) {
  if (!enNavegador()) return
  window.location.hash = ruta
}

/** Devuelve `{ruta, params}` y lo mantiene sincronizado con el hash. */
export function useRuta() {
  const [actual, setActual] = useState(rutaActual)

  useEffect(() => {
    if (!enNavegador()) return undefined

    const alCambiar = () => setActual(rutaActual())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  useEffect(() => {
    if (!enNavegador()) return
    const info = RUTAS[actual.ruta]
    document.title = `${info?.titulo ?? 'Sistema Canchas'} · Sistema Canchas`
  }, [actual.ruta])

  return actual
}
