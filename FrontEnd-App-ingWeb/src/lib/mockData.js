import verde from '../assets/cancha-verde.svg'
import azul from '../assets/cancha-azul.svg'
import arcilla from '../assets/cancha-arcilla.svg'

/**
 * Datos de ejemplo para el style guide.
 * Vocabulario tomado de §5 del sistema de diseño: nada de "Lorem ipsum".
 *
 * El contrato de Cancha y Reserva está propuesto en DESIGN_SYSTEM.md §6;
 * el backend todavía no expone esos endpoints.
 */

export const CANCHAS = [
  {
    id: 1,
    nombre: 'Cancha La Bombonera 1',
    deporte: 'futbol',
    deporteLabel: 'Fútbol 7',
    zona: 'Zona Norte',
    sede: 'Sede Central',
    tags: ['Césped sintético', 'Luz LED', 'Techada'],
    precioHora: 14000,
    puntuacion: 4.9,
    resenas: 48,
    estado: 'disponible',
    imagenUrl: verde,
  },
  {
    id: 2,
    nombre: 'Court Central Pádel A',
    deporte: 'padel',
    zona: 'Zona Norte',
    sede: 'Club Los Pinos',
    tags: ['Cristal panorámico', 'Techada', 'Luz LED'],
    precioHora: 10000,
    puntuacion: 4.8,
    resenas: 42,
    estado: 'disponible',
    imagenUrl: azul,
  },
  {
    id: 3,
    nombre: 'Estadio Techado Básquet',
    deporte: 'basquet',
    zona: 'Zona Centro',
    sede: 'Polideportivo Sur',
    tags: ['Parquet profesional', 'Techada', 'Vestuarios'],
    precioHora: 12000,
    puntuacion: 4.7,
    resenas: 31,
    estado: 'disponible',
    imagenUrl: verde,
  },
  {
    id: 4,
    nombre: 'Cancha Tenis Arcilla 2',
    deporte: 'tenis',
    zona: 'Zona Sur',
    sede: 'Club Campestre',
    tags: ['Arcilla batida', 'Al aire libre', 'Iluminación'],
    precioHora: 11000,
    puntuacion: 4.9,
    resenas: 54,
    estado: 'disponible',
    imagenUrl: arcilla,
  },
  {
    id: 5,
    nombre: 'Cancha Vóley Playa Arena',
    deporte: 'voley',
    zona: 'Zona Centro',
    sede: 'Parque Metropolitano',
    tags: ['Arena sílice', 'Al aire libre', 'Duchas'],
    precioHora: 9000,
    puntuacion: 4.6,
    resenas: 19,
    estado: 'disponible',
    imagenUrl: arcilla,
  },
  {
    id: 6,
    nombre: 'Cancha Fútbol 5 Pro',
    deporte: 'futbol',
    deporteLabel: 'Fútbol 5',
    zona: 'Zona Sur',
    sede: 'Arena Gol',
    tags: ['Iluminación LED', 'Césped premium', 'Gradas'],
    precioHora: 12000,
    puntuacion: 4.8,
    resenas: 63,
    estado: 'disponible',
    imagenUrl: verde,
  },
]

/** Zonas del filtro desplegable. */
export const ZONAS = [
  { value: '', label: 'Zona (Todas)' },
  { value: 'norte', label: 'Zona Norte' },
  { value: 'centro', label: 'Zona Centro' },
  { value: 'sur', label: 'Zona Sur' },
]

export const CLIENTES = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan.perez@correo.com', telefono: '300 123 4567', registro: '12/04/2026', reservas: 18, activo: true },
  { id: 2, nombre: 'Laura Méndez', email: 'laura.mendez@correo.com', telefono: '311 222 3344', registro: '03/02/2026', reservas: 27, activo: true },
  { id: 3, nombre: 'Carlos Rivas', email: 'carlos.rivas@correo.com', telefono: '320 555 6677', registro: '22/07/2025', reservas: 4, activo: false },
  { id: 4, nombre: 'Ana Sofía Gómez', email: 'ana.gomez@correo.com', telefono: '300 888 1122', registro: '15/11/2025', reservas: 31, activo: true },
  { id: 5, nombre: 'Diego Torres', email: 'diego.torres@correo.com', telefono: '315 444 9900', registro: '09/09/2025', reservas: 11, activo: true },
  { id: 6, nombre: 'Valentina Cruz', email: 'vale.cruz@correo.com', telefono: '301 777 4433', registro: '28/01/2026', reservas: 9, activo: true },
]

export const HORARIOS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
].map((hora) => ({
  hora,
  estado: ['08:00', '09:00', '16:00'].includes(hora) ? 'ocupado' : 'libre',
}))

export const HORARIOS_TODOS_LIBRES = HORARIOS.map((s) => ({ ...s, estado: 'libre' }))

export const DIAS = [
  { dia: 'Hoy', numero: '08', disponible: true },
  { dia: 'Sáb', numero: '09', disponible: true },
  { dia: 'Dom', numero: '10', disponible: false },
  { dia: 'Lun', numero: '11', disponible: true },
  { dia: 'Mar', numero: '12', disponible: true },
  { dia: 'Mié', numero: '13', disponible: true },
  { dia: 'Jue', numero: '14', disponible: true },
]

export const ICONOS = [
  'sports_soccer', 'sports_volleyball', 'sports_basketball', 'sports_tennis',
  'search', 'location_on', 'calendar_month', 'schedule',
  'group', 'star', 'lock', 'payments', 'add', 'edit', 'delete',
  'check', 'close', 'warning', 'info', 'error', 'check_circle',
  'download', 'filter_list', 'notifications', 'menu', 'arrow_forward',
  'visibility', 'visibility_off', 'lightbulb', 'roofing', 'grass',
]

export const PALETA = [
  { group: 'Verde energía', tokens: [
    ['primary-50', '#EAFBF3'], ['primary-100', '#CFF5E2'], ['primary-200', '#A3ECC9'],
    ['primary-300', '#6FDCAC'], ['primary-500', '#00B86B'], ['primary-600', '#009A5A'],
    ['primary-700', '#027A49'], ['primary-800', '#04603A'], ['primary-900', '#054D31'],
  ]},
  { group: 'Carbón', tokens: [
    ['neutral-0', '#FFFFFF'], ['neutral-25', '#FBFCFB'], ['neutral-50', '#F5F7F6'],
    ['neutral-100', '#EDF0EF'], ['neutral-200', '#E1E6E4'], ['neutral-300', '#CBD2D0'],
    ['neutral-500', '#6E7A77'], ['neutral-600', '#55605D'], ['neutral-700', '#3B4442'],
    ['neutral-900', '#171D1B'], ['neutral-950', '#0D1211'],
  ]},
  { group: 'Semánticos', tokens: [
    ['success', '#027A49'], ['warning', '#B45309'], ['danger', '#C93A3F'], ['info', '#1D4ED8'],
  ]},
  { group: 'Deportes', tokens: [
    ['futbol', '#00B86B'], ['voley', '#2563EB'], ['basquet', '#F5A524'],
    ['tenis', '#8B5CF6'], ['padel', '#14B8A6'],
  ]},
]

export const ESCALA_TIPO = [
  ['display-1', 'var(--fs-display-1)', 800, 'Canchas 42'],
  ['display-2', 'var(--fs-display-2)', 700, 'Canchas 42'],
  ['h1', 'var(--fs-h1)', 700, 'Encuentra tu cancha'],
  ['h2', 'var(--fs-h2)', 700, 'Explorar canchas'],
  ['h3', 'var(--fs-h3)', 600, 'Cancha Fútbol 1'],
  ['h4', 'var(--fs-h4)', 600, 'Sábado 9 de octubre'],
  ['body-lg', 'var(--fs-body-lg)', 400, 'Elige el horario que prefieras y reserva en segundos.'],
  ['body', 'var(--fs-body)', 400, 'Canchas disponibles en la Zona Norte de la ciudad.'],
  ['body-sm', 'var(--fs-body-sm)', 400, 'Césped sintético · Techada · Iluminada'],
  ['caption', 'var(--fs-caption)', 400, 'Te enviamos la confirmación a tu correo'],
  ['label', 'var(--fs-label)', 600, 'Correo electrónico'],
  ['overline', 'var(--fs-overline)', 700, 'PASO 1 DE 2'],
]
