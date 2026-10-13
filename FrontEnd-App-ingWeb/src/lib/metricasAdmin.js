/**
 * Métricas del panel de administración (FASE 4).
 *
 * Todo es puro y sin DOM, así que se puede comprobar en Node. Las cifras no
 * dependen del reloj: el mes de referencia llega en `hoy` (el panel pasa
 * `HOY_DEMO`, el día fijo del mock). Las definiciones son deliberadamente
 * simples para que las pueda servir un endpoint más adelante:
 *
 *   - reservas del mes: reservas con `fecha` en el mes de referencia,
 *   - ingresos del mes: suma de `total` de esas reservas, sin las canceladas.
 */

/** Mes "YYYY-MM" de una fecha ISO. Cadena vacía si la fecha no es válida. */
export function mesDe(iso) {
  const texto = String(iso ?? '')
  return /^\d{4}-\d{2}/.test(texto) ? texto.slice(0, 7) : ''
}

/** Mes anterior a "YYYY-MM". Enero retrocede a diciembre del año previo. */
export function mesAnterior(mes) {
  const [anio, m] = String(mes ?? '')
    .split('-')
    .map(Number)
  if (!Number.isFinite(anio) || !Number.isFinite(m)) return ''
  const total = anio * 12 + (m - 1) - 1
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`
}

/**
 * Variación de una cifra respecto al mes anterior, lista para `StatCard`.
 * @param {number} actual
 * @param {number} anterior
 * @returns {{texto: string, direction: 'up'|'down'|'flat'}}
 */
export function variacion(actual, anterior) {
  if (!anterior) {
    if (!actual) return { texto: 'Sin cambios', direction: 'flat' }
    return { texto: `+${actual}`, direction: 'up' }
  }

  const pct = Math.round(((actual - anterior) / anterior) * 100)
  if (pct === 0) return { texto: 'Sin cambios', direction: 'flat' }

  return {
    texto: `${pct > 0 ? '+' : '−'}${Math.abs(pct)}%`,
    direction: pct > 0 ? 'up' : 'down',
  }
}

/** ¿La reserva cuenta para los ingresos? Se excluyen las canceladas. */
function facturable(reserva) {
  return reserva?.estado !== 'cancelada' && reserva?.estado !== 'rechazada'
}

/**
 * Resumen del panel: clientes, canchas, reservas e ingresos del mes.
 *
 * @param {object} datos
 * @param {import('../api/types.js').Cliente[]} [datos.clientes]
 * @param {import('../api/types.js').Cancha[]} [datos.canchas]
 * @param {import('../api/types.js').Reserva[]} [datos.reservas]
 * @param {string} [datos.hoy]  ISO "2026-10-12"; fija el mes de referencia
 */
export function calcularResumen({ clientes = [], canchas = [], reservas = [], hoy } = {}) {
  const mes = mesDe(hoy)
  const previo = mesAnterior(mes)

  const delMes = reservas.filter((reserva) => mesDe(reserva.fecha) === mes)
  const delPrevio = previo ? reservas.filter((reserva) => mesDe(reserva.fecha) === previo) : []

  const ingresosMes = delMes.filter(facturable).reduce((suma, r) => suma + (r.total ?? 0), 0)
  const ingresosPrevio = delPrevio
    .filter(facturable)
    .reduce((suma, r) => suma + (r.total ?? 0), 0)

  return {
    mes,
    mesPrevio: previo,
    totalClientes: clientes.length,
    clientesActivos: clientes.filter((cliente) => cliente.activo).length,
    totalCanchas: canchas.length,
    canchasDisponibles: canchas.filter((cancha) => cancha.estado === 'disponible').length,
    reservasMes: delMes.length,
    reservasPrevio: delPrevio.length,
    variacionReservas: variacion(delMes.length, delPrevio.length),
    ingresosMes,
    ingresosPrevio,
    variacionIngresos: variacion(ingresosMes, ingresosPrevio),
  }
}

/**
 * Próximos turnos a partir de `hoy` (incluido), del más cercano al más lejano.
 * @param {import('../api/types.js').Reserva[]} reservas
 * @param {string} hoy
 * @param {number} [limite]
 */
export function proximosTurnos(reservas = [], hoy, limite = Infinity) {
  return reservas
    .filter((reserva) => reserva.fecha >= hoy && reserva.estado !== 'cancelada')
    .sort((a, b) => `${a.fecha} ${a.horaInicio}`.localeCompare(`${b.fecha} ${b.horaInicio}`))
    .slice(0, limite === Infinity ? undefined : limite)
}
