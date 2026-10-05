/**
 * Deportes del dominio, con su color (token CSS) e icono.
 * El color se referencia como variable para que cambie con el tema oscuro.
 *
 * Nota: Material Symbols no tiene glifo de pádel. Se usa el de tenis y
 * queda pendiente sustituirlo por un icono propio cuando exista.
 */
export const DEPORTES = {
  futbol: { label: 'Fútbol', icon: 'sports_soccer', color: 'var(--c-sport-futbol)' },
  voley: { label: 'Vóley', icon: 'sports_volleyball', color: 'var(--c-sport-voley)' },
  basquet: { label: 'Básquet', icon: 'sports_basketball', color: 'var(--c-sport-basquet)' },
  tenis: { label: 'Tenis', icon: 'sports_tennis', color: 'var(--c-sport-tenis)' },
  padel: { label: 'Padel', icon: 'sports_tennis', color: 'var(--c-sport-padel)' },
}

export function getDeporte(key) {
  return DEPORTES[key] ?? { label: key ?? '—', icon: 'sports', color: 'var(--c-neutral-400)' }
}

/** Estados de reserva y su tono de badge (§6 del sistema de diseño). */
export const ESTADOS_RESERVA = {
  confirmada: { label: 'Confirmada', tone: 'ok' },
  pendiente: { label: 'Pendiente', tone: 'warn' },
  completada: { label: 'Completada', tone: 'ok' },
  cancelada: { label: 'Cancelada', tone: 'neutral' },
  rechazada: { label: 'Rechazada', tone: 'danger' },
}
