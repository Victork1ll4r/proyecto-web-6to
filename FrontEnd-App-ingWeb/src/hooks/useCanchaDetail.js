import { useApi } from './useApi.js'
import { USE_MOCK } from '../api/client.js'
import { getCancha } from '../api/canchas.js'
import { CANCHAS, DETALLES_CANCHA } from '../lib/mockData.js'

/**
 * useCanchaDetail — detalle de una cancha (FASE 2, §2.3).
 *
 * La vista solo ve `{data, loading, error, refetch}`. El mock se siembra para
 * que el primer render (y el SSR) ya tenga contenido, y `mock: USE_MOCK` hace
 * que en modo mock no se dispare ninguna petición.
 *
 * @param {number|string} id
 */
export function useCanchaDetail(id) {
  const numero = id === undefined || id === null || id === '' ? null : Number(id)
  const base = numero === null ? null : CANCHAS.find((c) => c.id === numero)
  const semilla =
    base && Number.isFinite(numero) ? { ...base, ...DETALLES_CANCHA[base.id] } : undefined

  return useApi(() => getCancha(numero), {
    mock: USE_MOCK,
    mockData: semilla,
    deps: [numero],
    enabled: numero !== null && Number.isFinite(numero),
  })
}
