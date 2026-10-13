import { useMemo } from 'react'
import { useApi } from './useApi.js'
import { USE_MOCK } from '../api/client.js'
import { getCanchas } from '../api/canchas.js'
import { CANCHAS } from '../lib/mockData.js'

/**
 * useCanchasAdmin — todas las canchas para el panel admin (FASE 4).
 *
 * El filtrado (búsqueda, deporte, estado) lo hace la tabla en el cliente: la
 * lista es corta y así los contadores salen del mismo dato que se pinta. El
 * CRUD vive en `api/canchas.js`; tras crear/editar/borrar, la página llama a
 * `refetch()` y vuelve a pedir el listado (el mock es con estado).
 *
 * @returns {{data: import('../api/types.js').Cancha[]|null, loading: boolean, error: Error|null, refetch: () => void}}
 */
export function useCanchasAdmin() {
  const semilla = useMemo(() => (USE_MOCK ? CANCHAS.map((cancha) => ({ ...cancha })) : undefined), [])

  return useApi(() => getCanchas(), { mockData: semilla, deps: [] })
}
