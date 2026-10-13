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

/**
 * Ficha ampliada de cada cancha, para el detalle (FASE 2).
 *
 * El catálogo solo necesita la tarjeta —nombre, precio, foto—; el detalle
 * pide además descripción, características, normas y sede. Se mantiene
 * separado de `CANCHAS` para que `GET /canchas` (listado) siga siendo ligero y
 * solo `GET /canchas/:id` cargue la ficha completa, igual que hará el backend.
 */
const NORMAS = [
  'Llega 15 minutos antes para el registro y la entrega del balón en administración.',
  'Prohibido fumar, vapear o consumir bebidas alcohólicas dentro de la zona de juego.',
  'Hay hidratación y bebidas isotónicas en la cafetería de la sede.',
]

/** Ficha por id de cancha. */
export const DETALLES_CANCHA = {
  1: {
    direccion: 'Cra 45 # 12-30',
    capacidad: 14,
    descripcion:
      'Césped sintético de fibra monofilamento de 50 mm sobre base elástica que reduce el impacto en rodilla y tobillo. Techada y ventilada, con luminarias de 600 lux para jugar de noche sin sombras.',
    amenidades: [
      { icon: 'grass', label: 'Césped sintético' },
      { icon: 'roofing', label: 'Techada' },
      { icon: 'lightbulb', label: 'Luz LED' },
      { icon: 'shower', label: 'Vestuarios con duchas' },
      { icon: 'local_parking', label: 'Parqueadero' },
    ],
    normas: NORMAS,
    calzado: {
      titulo: 'Calzado obligatorio: botines de turf',
      texto:
        'Solo se permite suela multitaco de goma suave o zapatillas de sala. Quedan prohibidos los tapones de aluminio y la suela rígida de campo natural.',
    },
    sedeInfo: {
      nombre: 'Complejo Deportivo Los Andes — Sede Norte',
      texto:
        'Acceso vehicular por la Cra 45 con portería vigilada y parqueadero para 40 vehículos sin costo para usuarios con reserva activa.',
    },
    imagenes: [verde, azul, arcilla],
  },
  2: {
    direccion: 'Calle 92 # 15-04',
    capacidad: 4,
    descripcion:
      'Pista de pádel de cristal panorámico que deja pasar la luz de la tarde sin deslumbrar. Muros de 10 mm con relleno amortiguado y césped monofilamento de 12 mm, apto para juego de ataque.',
    amenidades: [
      { icon: 'sports_tennis', label: 'Cristal panorámico' },
      { icon: 'roofing', label: 'Techada' },
      { icon: 'lightbulb', label: 'Luz LED' },
      { icon: 'lock', label: 'Casilleros' },
    ],
    normas: NORMAS,
    calzado: {
      titulo: 'Calzado obligatorio: tenis de pádel',
      texto:
        'Suela de goma no marcante, tipo *herringbone*, para no dañar el césped ni los muros. No se permite calzado de running ni suela negra.',
    },
    sedeInfo: {
      nombre: 'Club Los Pinos — Sede Norte',
      texto:
        'Ingreso a pie por la recepción del club; hay parqueadero compartido con el restaurante a 50 metros.',
    },
    imagenes: [azul, arcilla, verde],
  },
  3: {
    direccion: 'Av. Circunvalar # 8-21',
    capacidad: 10,
    descripcion:
      'Cancha techada con duela de arce y pintura antideslizante de cuatro capas. Aros profesionales con resorte y reglamento FIBA, además de marcación para fútbol de salón.',
    amenidades: [
      { icon: 'sports_basketball', label: 'Parquet profesional' },
      { icon: 'roofing', label: 'Techada' },
      { icon: 'shower', label: 'Vestuarios' },
      { icon: 'groups', label: 'Gradas' },
    ],
    normas: NORMAS,
    calzado: {
      titulo: 'Calzado obligatorio: calzado de sala',
      texto:
        'Suela de goma no marcante que no arrastre suciedad a la duela. Cambia de calzado en la entrada: la arena de la calle raya el piso.',
    },
    sedeInfo: {
      nombre: 'Polideportivo Sur — Centro',
      texto:
        'Entrada por la puerta 3, junto a la piscina. Hay bahía de parqueo para bicicletas con vigilancia.',
    },
    imagenes: [verde, arcilla, azul],
  },
  4: {
    direccion: 'Km 2 vía La Calera',
    capacidad: 4,
    descripcion:
      'Cancha de arcilla batida al aire libre, regada y cepillada antes de cada turno. El drenaje perimetral permite jugar a los pocos minutos de una lluvia ligera.',
    amenidades: [
      { icon: 'grass', label: 'Arcilla batida' },
      { icon: 'lightbulb', label: 'Iluminación' },
      { icon: 'sports_tennis', label: 'Alquiler de raquetas' },
      { icon: 'restaurant', label: 'Cafetería' },
    ],
    normas: NORMAS,
    calzado: {
      titulo: 'Calzado obligatorio: tenis de arcilla',
      texto:
        'Suela de goma con dibujo profundo para arcilla. El calzado de superficie dura compacta la arena y deja surcos en la cancha.',
    },
    sedeInfo: {
      nombre: 'Club Campestre — Sede Sur',
      texto:
        'Portería sobre la vía La Calera; anúnciate como visitante en la caseta y sigue la señalización hacia las canchas 1 a 4.',
    },
    imagenes: [arcilla, verde, azul],
  },
  5: {
    direccion: 'Calle 63 # 24-11',
    capacidad: 4,
    descripcion:
      'Cancha de arena de sílice cribada, drenada y de 40 cm de profundidad para amortiguar la caída. Redes de altura reglamentaria y línea de ataque marcada con cinta tensada.',
    amenidades: [
      { icon: 'sports_volleyball', label: 'Arena de sílice' },
      { icon: 'shower', label: 'Duchas' },
      { icon: 'lightbulb', label: 'Iluminación' },
      { icon: 'local_drink', label: 'Hidratación' },
    ],
    normas: NORMAS,
    sedeInfo: {
      nombre: 'Parque Metropolitano — Centro',
      texto:
        'Las canchas están al fondo del parque, detrás de la pista de atletismo. Acceso a pie por la entrada 2.',
    },
    imagenes: [arcilla, azul, verde],
  },
  6: {
    direccion: 'Av. Las Américas # 51-40',
    capacidad: 10,
    descripcion:
      'Césped premium de 55 mm con relleno de caucho termoplástico y riego antipolvo programado. Gradas para 60 espectadores y marcador electrónico para torneos internos.',
    amenidades: [
      { icon: 'grass', label: 'Césped premium' },
      { icon: 'lightbulb', label: 'Iluminación LED' },
      { icon: 'groups', label: 'Gradas' },
      { icon: 'scoreboard', label: 'Marcador' },
    ],
    normas: NORMAS,
    calzado: {
      titulo: 'Calzado obligatorio: botines de turf',
      texto:
        'Suela multitaco de goma blanda. La suela de tapones metálicos queda prohibida por el desgaste que produce en el relleno.',
    },
    sedeInfo: {
      nombre: 'Arena Gol — Sede Sur',
      texto:
        'Parqueadero propio con capacidad para 25 vehículos y zona de espera cubierta junto a la gradería.',
    },
    imagenes: [verde, arcilla, azul],
  },
}

/** Zonas del filtro desplegable. */
export const ZONAS = [
  { value: '', label: 'Zona (Todas)' },
  { value: 'norte', label: 'Zona Norte' },
  { value: 'centro', label: 'Zona Centro' },
  { value: 'sur', label: 'Zona Sur' },
]

export const CLIENTES = [
  { id: 1, codigo: 'CL-0001', nombre: 'Juan Pérez', email: 'juan.perez@correo.com', telefono: '300 123 4567', registro: '12/04/2026', reservas: 18, activo: true },
  { id: 2, codigo: 'CL-0002', nombre: 'Laura Méndez', email: 'laura.mendez@correo.com', telefono: '311 222 3344', registro: '03/02/2026', reservas: 27, activo: true },
  { id: 3, codigo: 'CL-0003', nombre: 'Carlos Rivas', email: 'carlos.rivas@correo.com', telefono: '320 555 6677', registro: '22/07/2025', reservas: 4, activo: false },
  { id: 4, codigo: 'CL-0004', nombre: 'Ana Sofía Gómez', email: 'ana.gomez@correo.com', telefono: '300 888 1122', registro: '15/11/2025', reservas: 31, activo: true },
  { id: 5, codigo: 'CL-0005', nombre: 'Diego Torres', email: 'diego.torres@correo.com', telefono: '315 444 9900', registro: '09/09/2025', reservas: 11, activo: true },
  { id: 6, codigo: 'CL-0006', nombre: 'Valentina Cruz', email: 'vale.cruz@correo.com', telefono: '301 777 4433', registro: '28/01/2026', reservas: 9, activo: true },
]

/**
 * Día de referencia del panel de administración.
 *
 * El mock tiene fechas fijas, así que el panel no puede depender del reloj del
 * sistema: las métricas ("reservas del mes", "próximos turnos") se calculan
 * contra este día. Coincide con la fecha del entorno y con la de las capturas.
 */
export const HOY_DEMO = '2026-10-12'

/**
 * Reservas de desarrollo (contrato `Reserva` — DESIGN_SYSTEM §6).
 *
 * Es la lista **global**: la vista del cliente filtra por `clienteId` y el panel
 * admin la muestra entera. Las cinco primeras son del cliente de la sesión
 * (`USUARIO_DEMO`, id 4) y sostienen "Mis reservas": tres próximas, una pasada
 * y una cancelada. Las siguientes reparten el resto de clientes entre
 * septiembre y octubre de 2026 para que el panel tenga volumen y comparación
 * mes a mes. `total` = `precioHora` de la cancha × horas.
 */
export const RESERVAS = [
  {
    id: 1,
    canchaId: 1,
    clienteId: 4,
    fecha: '2026-10-14',
    horaInicio: '18:00',
    horaFin: '20:00',
    estado: 'confirmada',
    total: 28000,
    codigo: 'SC-4A7F2',
    creadaEn: '2026-10-05T14:20:00',
  },
  {
    id: 2,
    canchaId: 2,
    clienteId: 4,
    fecha: '2026-10-16',
    horaInicio: '07:00',
    horaFin: '08:00',
    estado: 'confirmada',
    total: 10000,
    codigo: 'SC-9K3MB',
    creadaEn: '2026-10-06T09:05:00',
  },
  {
    id: 3,
    canchaId: 6,
    clienteId: 4,
    fecha: '2026-10-18',
    horaInicio: '20:00',
    horaFin: '22:00',
    estado: 'pendiente',
    total: 24000,
    codigo: 'SC-2QP7D',
    creadaEn: '2026-10-11T17:42:00',
  },
  {
    id: 4,
    canchaId: 4,
    clienteId: 4,
    fecha: '2026-09-27',
    horaInicio: '10:00',
    horaFin: '11:00',
    estado: 'completada',
    total: 11000,
    codigo: 'SC-7TR4H',
    creadaEn: '2026-09-20T08:15:00',
  },
  {
    id: 5,
    canchaId: 5,
    clienteId: 4,
    fecha: '2026-10-09',
    horaInicio: '16:00',
    horaFin: '17:00',
    estado: 'cancelada',
    total: 9000,
    codigo: 'SC-5XW8N',
    creadaEn: '2026-10-02T11:30:00',
  },

  /* --- Otros clientes: septiembre y octubre de 2026 (panel admin) ---------- */

  // Septiembre 2026 — mes anterior, para comparar.
  {
    id: 6,
    canchaId: 2,
    clienteId: 1,
    fecha: '2026-09-05',
    horaInicio: '09:00',
    horaFin: '10:00',
    estado: 'completada',
    total: 10000,
    codigo: 'SC-P2M4A',
    creadaEn: '2026-08-30T10:12:00',
  },
  {
    id: 7,
    canchaId: 3,
    clienteId: 2,
    fecha: '2026-09-12',
    horaInicio: '20:00',
    horaFin: '22:00',
    estado: 'completada',
    total: 24000,
    codigo: 'SC-R7K1B',
    creadaEn: '2026-09-04T16:40:00',
  },
  {
    id: 8,
    canchaId: 1,
    clienteId: 5,
    fecha: '2026-09-18',
    horaInicio: '18:00',
    horaFin: '19:00',
    estado: 'completada',
    total: 14000,
    codigo: 'SC-T5N8C',
    creadaEn: '2026-09-11T08:25:00',
  },
  {
    id: 9,
    canchaId: 6,
    clienteId: 3,
    fecha: '2026-09-24',
    horaInicio: '21:00',
    horaFin: '22:00',
    estado: 'cancelada',
    total: 12000,
    codigo: 'SC-W3J6D',
    creadaEn: '2026-09-19T19:02:00',
  },
  {
    id: 10,
    canchaId: 4,
    clienteId: 6,
    fecha: '2026-09-29',
    horaInicio: '10:00',
    horaFin: '11:00',
    estado: 'completada',
    total: 11000,
    codigo: 'SC-Y9F2E',
    creadaEn: '2026-09-22T07:48:00',
  },

  // Octubre 2026 — mes en curso, con turnos de hoy y próximos.
  {
    id: 11,
    canchaId: 1,
    clienteId: 2,
    fecha: '2026-10-02',
    horaInicio: '19:00',
    horaFin: '20:00',
    estado: 'completada',
    total: 14000,
    codigo: 'SC-A4H7F',
    creadaEn: '2026-09-28T12:10:00',
  },
  {
    id: 12,
    canchaId: 2,
    clienteId: 6,
    fecha: '2026-10-05',
    horaInicio: '08:00',
    horaFin: '09:00',
    estado: 'completada',
    total: 10000,
    codigo: 'SC-B8L3G',
    creadaEn: '2026-10-01T09:33:00',
  },
  {
    id: 13,
    canchaId: 3,
    clienteId: 1,
    fecha: '2026-10-07',
    horaInicio: '20:00',
    horaFin: '21:00',
    estado: 'completada',
    total: 12000,
    codigo: 'SC-C2P9H',
    creadaEn: '2026-10-03T15:05:00',
  },
  {
    id: 14,
    canchaId: 6,
    clienteId: 5,
    fecha: '2026-10-10',
    horaInicio: '21:00',
    horaFin: '23:00',
    estado: 'completada',
    total: 24000,
    codigo: 'SC-D6Q4J',
    creadaEn: '2026-10-06T18:20:00',
  },
  {
    id: 15,
    canchaId: 2,
    clienteId: 3,
    fecha: '2026-10-11',
    horaInicio: '18:00',
    horaFin: '19:00',
    estado: 'cancelada',
    total: 10000,
    codigo: 'SC-E1R8K',
    creadaEn: '2026-10-04T11:15:00',
  },
  {
    id: 16,
    canchaId: 4,
    clienteId: 1,
    fecha: '2026-10-12',
    horaInicio: '16:00',
    horaFin: '17:00',
    estado: 'confirmada',
    total: 11000,
    codigo: 'SC-F5S2L',
    creadaEn: '2026-10-08T13:40:00',
  },
  {
    id: 17,
    canchaId: 5,
    clienteId: 2,
    fecha: '2026-10-12',
    horaInicio: '18:00',
    horaFin: '19:00',
    estado: 'pendiente',
    total: 9000,
    codigo: 'SC-G9T6M',
    creadaEn: '2026-10-11T20:05:00',
  },
  {
    id: 18,
    canchaId: 1,
    clienteId: 6,
    fecha: '2026-10-13',
    horaInicio: '19:00',
    horaFin: '21:00',
    estado: 'confirmada',
    total: 28000,
    codigo: 'SC-H3U1N',
    creadaEn: '2026-10-09T10:30:00',
  },
  {
    id: 19,
    canchaId: 3,
    clienteId: 5,
    fecha: '2026-10-15',
    horaInicio: '17:00',
    horaFin: '18:00',
    estado: 'confirmada',
    total: 12000,
    codigo: 'SC-J7V5P',
    creadaEn: '2026-10-10T14:55:00',
  },
  {
    id: 20,
    canchaId: 6,
    clienteId: 3,
    fecha: '2026-10-20',
    horaInicio: '20:00',
    horaFin: '22:00',
    estado: 'confirmada',
    total: 24000,
    codigo: 'SC-K1W9Q',
    creadaEn: '2026-10-12T08:10:00',
  },
]

/** Cliente de desarrollo con el que se simula una sesión en `api/auth.js`. */
export const USUARIO_DEMO = {
  id: 4,
  nombre: 'Ana Sofía Gómez',
  email: 'ana.gomez@correo.com',
  telefono: '300 888 1122',
  fechaRegistro: '2025-11-15',
  activo: true,
}

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
