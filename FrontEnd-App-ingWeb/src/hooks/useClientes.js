import { useMemo } from 'react'
import { useApi } from './useApi.js'
import { USE_MOCK } from '../api/client.js'
import { list } from '../api/clientes.js'
import { CLIENTES } from '../lib/mockData.js'

/**
 * useClientes — clientes para el panel admin (FASE 4).
 *
 * Modo **semilla** de `useApi`: en mock se pinta la lista de desarrollo desde
 * el primer render (y en SSR) y además se pide a `api/clientes.list`, de modo
 * que `refetch()` trae el estado actualizado. En modo real no hay semilla y la
 * vista enseña su esqueleto.
 *
 * @returns {{data: import('../api/types.js').Cliente[]|null, loading: boolean, error: Error|null, refetch: () => void}}
 */
export function useClientes() {
  const semilla = useMemo(() => (USE_MOCK ? CLIENTES.map((cliente) => ({ ...cliente })) : undefined), [])

  return useApi(() => list(), { mockData: semilla, deps: [] })
}
