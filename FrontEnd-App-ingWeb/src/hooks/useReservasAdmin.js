import { useMemo } from 'react'
import { useApi } from './useApi.js'
import { USE_MOCK } from '../api/client.js'
import { list } from '../api/reservas.js'
import { RESERVAS } from '../lib/mockData.js'

/**
 * useReservasAdmin — todas las reservas para el panel admin (FASE 4).
 *
 * `api/reservas.list()` sin filtros devuelve la lista global (todos los
 * clientes). El enriquecido con cancha y cliente lo hace la tabla; así el hook
 * se queda en "una petición, un dato". Tras confirmar/cancelar en bloque, la
 * página llama a `refetch()`.
 *
 * @returns {{data: import('../api/types.js').Reserva[]|null, loading: boolean, error: Error|null, refetch: () => void}}
 */
export function useReservasAdmin() {
  const semilla = useMemo(() => (USE_MOCK ? RESERVAS.map((reserva) => ({ ...reserva })) : undefined), [])

  return useApi(() => list(), { mockData: semilla, deps: [] })
}
