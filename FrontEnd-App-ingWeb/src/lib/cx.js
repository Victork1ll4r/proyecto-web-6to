/**
 * cx — concatena clases de forma condicional.
 * Sustituye a las librerías de classnames para no añadir dependencias.
 *
 *   cx('a', cond && 'b', { c: cond })
 *   → "a b c"
 */
export function cx(...parts) {
  const out = []

  for (const part of parts) {
    if (!part) continue

    if (typeof part === 'string' || typeof part === 'number') {
      out.push(String(part))
    } else if (Array.isArray(part)) {
      const nested = cx(...part)
      if (nested) out.push(nested)
    } else if (typeof part === 'object') {
      for (const [key, value] of Object.entries(part)) {
        if (value) out.push(key)
      }
    }
  }

  return out.join(' ')
}

/**
 * initials — extrae las iniciales de un nombre completo.
 * "Juan Pérez Gómez" → "JPG", "Laura Méndez" → "LM"
 */
export function initials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
}

/**
 * formatCurrency — formatea un monto al estiloCOP/es-PE.
 * 12000 → "$12.000"
 */
export function formatCurrency(value, { symbol = '$' } = {}) {
  const n = Number(value) || 0
  const [int, dec] = Math.abs(n).toString().split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${n < 0 ? '-' : ''}${symbol}${grouped}${dec ? `,${dec}` : ''}`
}
