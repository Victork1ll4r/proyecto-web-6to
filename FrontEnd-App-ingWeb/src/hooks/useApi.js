import { useCallback, useEffect, useRef, useState } from 'react'
import { esAborto } from '../api/client.js'

/**
 * useApi — estado de una petición (data / loading / error) con cancelación.
 *
 * Es el único sitio del frontend que sabe de ciclos de carga. Cada hook de
 * dominio (`useCanchas`, `useReservas`…) es una línea sobre este.
 *
 * Sobre el mock (PORT_STITCH_PLAN §Principios 6):
 *   - `mockData` siembra el dato inicial. Sirve para pintar de inmediato y
 *     para renderizar sin DOM (SSR), donde los efectos no se ejecutan.
 *   - `mock: true` con `mockData` evita la petición por completo: el dato
 *     sembrado es el definitivo. Es el modo "sin backend" (detalle de una
 *     cancha, que no cambia sola).
 *   - `mock: false` (por defecto) siempre llama a `peticion`; será la capa
 *     `src/api/` quien devuelva mock o red según `VITE_USE_MOCK`.
 *   - `mock: false` **con** `mockData` es el modo *semilla*: se pinta el dato
 *     de inmediato y además se pide, de modo que `refetch()` refleja cambios
 *     (p. ej. una reserva cancelada sobre el mock con estado).
 *
 * En modo semilla el `loading` nunca pisa contenido ya visible: solo se
 * enciende si todavía no hay nada que mostrar.
 *
 * El `setState` dentro del efecto va en el encadenado de la promesa, nunca de
 * forma síncrona en el cuerpo: así se evita el render en cascada que señala
 * `react-hooks/set-state-in-effect`.
 *
 * @template T
 * @param {(ctx: {signal: AbortSignal}) => Promise<T>} peticion
 * @param {object} [opciones]
 * @param {boolean} [opciones.mock=false]  true → usa `mockData` sin llamar
 * @param {T} [opciones.mockData]          dato inicial / definitivo en mock
 * @param {unknown[]} [opciones.deps=[]]   dependencias que disparan la recarga
 * @param {boolean} [opciones.enabled=true] false → no pide nada (p. ej. sin id)
 * @returns {{data: T|null, loading: boolean, error: Error|null, refetch: () => void}}
 */
export function useApi(peticion, { mock = false, mockData, deps = [], enabled = true } = {}) {
  const peticionRef = useRef(peticion)
  const mockDataRef = useRef(mockData)
  const [recarga, setRecarga] = useState(0)

  /** Modo estático: la semilla es el dato definitivo y no se pide nada. */
  const estatico = mock && mockData !== undefined
  /** Modo semilla: se pinta de inmediato, pero la petición sigue su curso. */
  const sembrado = mockData !== undefined

  const [estado, setEstado] = useState(() => ({
    data: sembrado ? mockData : null,
    loading: enabled && !sembrado,
    error: null,
  }))

  /* Mantener las referencias al día sin que cambien las dependencias: si
     `peticion` o `mockData` fuesen deps, un arreglo nuevo en cada render
     provocaría un bucle de peticiones. */
  useEffect(() => {
    peticionRef.current = peticion
    mockDataRef.current = mockData
  })

  useEffect(() => {
    if (!enabled) return undefined
    if (mock && mockDataRef.current !== undefined) return undefined

    const controlador = new AbortController()
    let vigente = true

    Promise.resolve()
      .then(() => {
        if (!vigente) return undefined
        /* Solo se muestra el esqueleto si no hay nada que enseñar: con semilla
           el contenido ya está en pantalla y la recarga ocurre por detrás. */
        setEstado((prev) => ({ ...prev, loading: prev.data === null, error: null }))
        return peticionRef.current?.({ signal: controlador.signal })
      })
      .then((data) => {
        if (vigente) setEstado({ data: data ?? null, loading: false, error: null })
      })
      .catch((error) => {
        if (!vigente || esAborto(error)) return
        setEstado((prev) => ({ data: prev.data, loading: false, error }))
      })

    return () => {
      vigente = false
      controlador.abort()
    }
    // Las dependencias reales llegan por `deps`; `peticion` y `mockData` van
    // por referencia para no disparar el efecto en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, mock, recarga, ...deps])

  const refetch = useCallback(() => setRecarga((n) => n + 1), [])

  /* El dato y el loading sembrados se derivan del render, no del efecto, para
     que el primer render (y el SSR, sin efectos) ya los tenga. En modo estático
     el dato vive en las props; en modo semilla, en el estado (que la petición
     actualiza). */
  const data = estatico ? mockData : estado.data
  const loading = !enabled ? false : estatico ? false : estado.loading
  const error = enabled ? estado.error : null

  return { data, loading, error, refetch }
}
