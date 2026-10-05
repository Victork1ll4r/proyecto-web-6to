/**
 * Filtrado del catálogo de canchas.
 *
 * Se extrae del componente para poder comprobarlo sin navegador. Cuando
 * existan los endpoints de cancha (DESIGN_SYSTEM §6) este criterio se
 * translate tal cual a query params y deja de ejecutarse en el cliente.
 */

/**
 * Los interruptores rápidos no guardan estado propio: activan la presencia de
 * una etiqueta en `cancha.tags`. Las etiquetas se normalizan antes de
 * comparar, así que estas constantes también van normalizadas — si no, "Luz
 * LED" no encontraría nunca a "iluminación".
 */
const ETIQUETA_TECHADA = normalizar('techada')
const ETIQUETA_ILUMINACION = normalizar('iluminación')

/**
 * Opciones del desplegable de superficie.
 *
 * `etiquetas` es lo que de verdad se compara contra `cancha.tags`, y son
 * varias porque el vocabulario de las tarjetas es más rico que el del filtro:
 * "Duela / Parquet" tiene que encontrar a "Parquet profesional", y "Arcilla
 * batida" también a "Arena sílice". Sin esta tabla, la opción Duela no
 * devolvería nunca nada.
 *
 * Vive aquí y no en mockData porque es lógica de filtrado: es el filtro quien
 * necesita saber qué etiquetas equivalen a cada opción.
 */
export const SUPERFICIES = [
  { value: '', label: 'Superficie', etiquetas: [] },
  { value: 'sintetico', label: 'Césped sintético', etiquetas: ['sintetico'] },
  { value: 'duela', label: 'Duela / Parquet', etiquetas: ['parquet', 'duela'] },
  { value: 'arcilla', label: 'Arcilla batida', etiquetas: ['arcilla', 'arena silice'] },
]

/** Etiquetas que activa una opción de superficie. Vacío = todas. */
function etiquetasDeSuperficie(valor) {
  const opcion = SUPERFICIES.find((s) => s.value === valor)
  return opcion ? opcion.etiquetas.map(normalizar) : []
}

/** Lowercase sin acentos, para que "padel" encuentre "Pádel". */
export function normalizar(texto = '') {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function filtrarCanchas(canchas, criterios = {}) {
  const {
    deporte = 'todas',
    zona = '',
    superficie = '',
    techada = false,
    iluminacion = false,
    busqueda = '',
  } = criterios

  const texto = normalizar(busqueda.trim())

  return canchas.filter((cancha) => {
    if (deporte !== 'todas' && cancha.deporte !== deporte) return false

    if (zona && normalizar(cancha.zona).indexOf(normalizar(zona)) === -1) return false

    const tags = normalizar((cancha.tags ?? []).join(' '))
    const busquedaSuperficie = etiquetasDeSuperficie(superficie)
    if (busquedaSuperficie.length > 0 && !busquedaSuperficie.some((e) => tags.includes(e))) {
      return false
    }
    if (techada && !tags.includes(ETIQUETA_TECHADA)) return false
    if (iluminacion && !tags.includes(ETIQUETA_ILUMINACION)) return false

    if (texto) {
      const heno = normalizar(
        [cancha.nombre, cancha.zona, cancha.sede, (cancha.tags ?? []).join(' ')].join(' '),
      )
      if (heno.indexOf(texto) === -1) return false
    }

    return true
  })
}

/** ¿Hay algún criterio activo? Decide si se muestra la barra de resultados. */
export function hayFiltrosActivos(criterios = {}) {
  const { deporte = 'todas', zona = '', superficie = '', techada, iluminacion, busqueda = '' } =
    criterios

  return deporte !== 'todas' || zona !== '' || superficie !== '' || techada || iluminacion || busqueda !== ''
}

/** Estado inicial: todos los filtros apagados. */
export const CRITERIOS_INICIALES = {
  deporte: 'todas',
  zona: '',
  superficie: '',
  techada: false,
  iluminacion: false,
  busqueda: '',
}