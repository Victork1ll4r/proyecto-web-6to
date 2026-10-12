import { useMemo } from 'react'
import { useApi } from './useApi.js'
import { USE_MOCK } from '../api/client.js'
import { list } from '../api/reservas.js'
import { RESERVAS } from '../lib/mockData.js'

/**
 * useReservas — reservas de un cliente (FASE 3, §3.3).
 *
 * La vista solo ve `{data, loading, error, refetch}`. Se usa el modo **semilla**
 * de `useApi`: en mock se pinta la lista de desarrollo desde el primer render
 * (y en SSR) y, además, se consulta `api/reservas.list`, de modo que
 * `refetch()` —tras cancelar— trae el estado actualizado del mock. En modo real
 * no hay semilla y la vista enseña su esqueleto.
 *
 * @param {object} [opciones]
 * @param {number|string} [opciones.clienteId]  sin él no se pide nada
 * @param {string} [opciones.estado]            'confirmada'… o 'todas'
 */
export function useReservas({ clienteId, estado } = {}) {
  const definido = clienteId !== undefined && clienteId !== null && clienteId !== ''

  const semilla = useMemo(() => {
    if (!USE_MOCK || !definido) return undefined
    return RESERVAS.filter(
      (reserva) =>
        reserva.clienteId === Number(clienteId) &&
        (!estado || estado === 'todas' || reserva.estado === estado),
    ).map((reserva) => ({ ...reserva }))
  }, [clienteId, estado, definido])

  return useApi(() => list({ clienteId, estado }), {
    // Sin `mock: true`: la petición sigue viva para que cancelar se refleje.
    mockData: semilla,
    deps: [clienteId, estado],
    enabled: definido,
  })
}
