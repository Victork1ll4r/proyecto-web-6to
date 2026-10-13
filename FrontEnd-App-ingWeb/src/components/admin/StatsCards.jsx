import { StatCard } from '../ui/StatCard.jsx'
import { formatMoneda } from '../../lib/format.js'
import { calcularResumen } from '../../lib/metricasAdmin.js'

/**
 * StatsCards — las cuatro métricas del panel (§3.13, §4.6).
 *
 * Las etiquetas son las del plan (FASE 4.1): usuarios, canchas, reservas del
 * mes e ingresos del mes. Las cifras salen de `lib/metricasAdmin.js`, una
 * función pura que también usa el propio panel; el día que exista un endpoint
 * de métricas solo cambia de dónde vienen los datos.
 *
 * @param {object} props
 * @param {import('../../api/types.js').Cliente[]} [props.clientes]
 * @param {import('../../api/types.js').Cancha[]} [props.canchas]
 * @param {import('../../api/types.js').Reserva[]} [props.reservas]
 * @param {string} props.hoy   ISO; fija el mes de referencia
 */
export function StatsCards({ clientes = [], canchas = [], reservas = [], hoy }) {
  const r = calcularResumen({ clientes, canchas, reservas, hoy })

  return (
    <div className="pa__stats">
      <StatCard
        label="Clientes"
        value={r.totalClientes}
        delta={`${r.clientesActivos} activos`}
        direction="flat"
        icon="group"
      />

      <StatCard
        label="Canchas"
        value={r.totalCanchas}
        delta={`${r.canchasDisponibles} disponibles`}
        direction="flat"
        icon="stadium"
      />

      <StatCard
        label="Reservas del mes"
        value={r.reservasMes}
        delta={`${r.variacionReservas.texto} vs mes anterior`}
        direction={r.variacionReservas.direction}
        icon="event_available"
      />

      <StatCard
        label="Ingresos del mes"
        value={formatMoneda(r.ingresosMes)}
        delta={`${r.variacionIngresos.texto} vs mes anterior`}
        direction={r.variacionIngresos.direction}
        icon="payments"
      />
    </div>
  )
}
