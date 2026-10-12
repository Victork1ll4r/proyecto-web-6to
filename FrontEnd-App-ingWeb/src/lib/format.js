import { formatCurrency } from './cx.js'

/**
 * Formato de presentación del dominio (DESIGN_SYSTEM §5).
 *
 * Reglas que se aplican aquí y en ningún otro sitio:
 *   - precios: `$12.000 / hora` (nunca solo el número),
 *   - horas en 24 h con punto, rango `18:00 – 19:00` (guion medio, no "-"),
 *   - fechas en `DD/MM/YYYY`, y una variante larga para los encabezados,
 *   - códigos de reserva `SC-XXXXX`.
 *
 * Todo es puro y sin DOM, así que se puede comprobar en Node.
 */

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

/**
 * Convierte `"2026-10-08"` en `{anio, mes, dia}` sin pasar por `Date`.
 *
 * `new Date('2026-10-08')` interpreta la cadena como UTC, y en zonas con
 * desfase negativo (Bogotá, UTC-5) eso devuelve el día anterior. Por eso la
 * fecha ISO se descompone a mano.
 * @param {string} iso
 * @returns {{anio: number, mes: number, dia: number}|null}
 */
export function descomponerFecha(iso) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? ''))
  if (!coincidencia) return null
  return { anio: Number(coincidencia[1]), mes: Number(coincidencia[2]) - 1, dia: Number(coincidencia[3]) }
}

/** Fecha local en ISO corto `YYYY-MM-DD`, sin desfase de zona horaria. */
export function fechaISO(fecha = new Date()) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

/**
 * Precio en pesos: 12000 → `"$12.000"`.
 * @param {number} valor
 */
export function formatMoneda(valor) {
  return formatCurrency(valor)
}

/**
 * Precio por hora con su unidad: 12000 → `"$12.000 / hora"`.
 * @param {number} valor
 */
export function formatPrecioHora(valor) {
  return `${formatMoneda(valor)} / hora`
}

/**
 * Normaliza una hora a 24 h con dos dígitos: `"8:0"` → `"08:00"`.
 * @param {string} hora
 */
export function formatHora(hora) {
  const coincidencia = /^(\d{1,2}):?(\d{1,2})?$/.exec(String(hora ?? '').trim())
  if (!coincidencia) return String(hora ?? '')
  const hh = String(Number(coincidencia[1])).padStart(2, '0')
  const mm = String(Number(coincidencia[2] ?? 0)).padStart(2, '0')
  return `${hh}:${mm}`
}

/**
 * Rango de una reserva: `("18:00", "19:00")` → `"18:00 – 19:00"`.
 * @param {string} inicio
 * @param {string} fin
 */
export function formatRangoHoras(inicio, fin) {
  return `${formatHora(inicio)} – ${formatHora(fin)}`
}

/**
 * Hora de fin al reservar varias franjas seguidas.
 * `horaFin("18:00", 2)` → `"20:00"`. Cruza la medianoche con módulo 24.
 * @param {string} inicio
 * @param {number} horas
 */
export function horaFin(inicio, horas = 1) {
  const [hh, mm] = formatHora(inicio).split(':')
  const total = (Number(hh) + Number(horas)) % 24
  return `${String(total).padStart(2, '0')}:${mm}`
}

/** Fecha corta `DD/MM/YYYY`: `"2026-10-08"` → `"08/10/2026"`. */
export function formatFecha(iso) {
  const partes = descomponerFecha(iso)
  if (!partes) return String(iso ?? '')
  const dia = String(partes.dia).padStart(2, '0')
  const mes = String(partes.mes + 1).padStart(2, '0')
  return `${dia}/${mes}/${partes.anio}`
}

/**
 * Fecha larga para encabezados: `"2026-10-09"` → `"Sábado 9 de octubre"`.
 * Se calcula el día de la semana con `Date.UTC` para no depender de la zona.
 * @param {string} iso
 */
export function formatFechaLarga(iso) {
  const partes = descomponerFecha(iso)
  if (!partes) return String(iso ?? '')
  const indice = new Date(Date.UTC(partes.anio, partes.mes, partes.dia)).getUTCDay()
  const dia = DIAS[indice]
  return `${dia[0].toUpperCase()}${dia.slice(1)} ${partes.dia} de ${MESES[partes.mes]}`
}

/**
 * ¿La fecha ISO es anterior a hoy? Para separar reservas pasadas.
 * @param {string} iso
 * @param {Date} [hoy]
 */
export function esPasada(iso, hoy = new Date()) {
  return String(iso) < fechaISO(hoy)
}

/**
 * Código de reserva `SC-XXXXX` (5 caracteres alfanuméricos en mayúscula).
 *
 * Sin `0`/`O` ni `1`/`I` para que se pueda dictar por teléfono sin confusión.
 * @returns {string}
 */
export function generarCodigoReserva() {
  const alfabeto = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let sufijo = ''
  for (let i = 0; i < 5; i += 1) {
    sufijo += alfabeto[Math.floor(Math.random() * alfabeto.length)]
  }
  return `SC-${sufijo}`
}
