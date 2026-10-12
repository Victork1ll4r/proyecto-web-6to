import { useApi } from './useApi.js'
import { USE_MOCK } from '../api/client.js'
import { getDisponibilidad } from '../api/canchas.js'
import { HORARIOS } from '../lib/mockData.js'

/**
 * useDisponibilidad — franjas libres y ocupadas de una cancha para una fecha.
 *
 * Separado de `useCanchaDetail` porque cambia con cada día que se elige: así
 * cambiar de fecha no vuelve a pedir la ficha completa de la cancha.
 *
 * @param {number|string} canchaId
 * @param {string} fecha  ISO "2026-10-14"
 */
export function useDisponibilidad(canchaId, fecha) {
  const numero = Number(canchaId)
  const valido = Number.isFinite(numero) && Boolean(fecha)

  return useApi(({ signal }) => getDisponibilidad(numero, { fecha, signal }), {
    mock: USE_MOCK,
    mockData: valido ? { canchaId: numero, fecha, slots: HORARIOS } : undefined,
    deps: [numero, fecha],
    enabled: valido,
  })
}
