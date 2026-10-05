# Sistema de Diseño — Sistema Canchas

**Versión:** 1.0 · **Estado:** Aprobado como base de generación con Google Stitch
**Implementación:** [`FrontEnd-App-ingWeb/src/styles/tokens.css`](../../FrontEnd-App-ingWeb/src/styles/tokens.css)
**Tema exportable:** [`stitch-theme.json`](./stitch-theme.json)
**Prompts de generación:** [`STITCH_PROMPTS.md`](./STITCH_PROMPTS.md)

---

## 1. Resumen

Sistema Canchas es una plataforma web para **reservar canchas deportivas por hora**. El
usuario busca un espacio disponible, elige un turno y gestiona sus reservas. Un perfil
administrador gestiona clientes y canchas.

El sistema de diseño se llama **"Energía"**: limpio, de alto contraste, con un verde
energético que evoca la cancha pintada y la marcación deportiva. Nada decorativo que no
aporte información.

### Principio rector

> **Una pantalla, una acción principal.**
> Si hay dos botones verdes, hay un problema de jerarquía.

### Atributos de la marca

| Atributo | Valor |
|---|---|
| Personalidad | Ágil, confiable, directo, deportivo |
| Voz | Cercana, en español de Latinoamérica, siempre con tuteo |
| Densidad | Media-alta (es una herramienta de gestión, no un portafolio) |
| Superficie | Clara por defecto, carbón como inverso |
| Accentación | Verde como color de acción, lima como acento en superficies oscuras |

---

## 2. Fundamentos

### 2.1 Color

#### Verde Energía (primario)

| Token | Hex | Uso |
|---|---|---|
| `primary-50` | `#EAFBF3` | Fondo de chips, badges, filas seleccionadas |
| `primary-100` | `#CFF5E2` | Hover de chips, fondo de toast exitoso |
| `primary-200` | `#A3ECC9` | Borde de elemento en foco suave |
| `primary-300` | `#6FDCAC` | Icono sobre superficie oscura |
| **`primary-500`** | **`#00B86B`** | **Botón primario, marca, marcador de Filling** |
| `primary-600` | `#009A5A` | Hover de botón primario |
| `primary-700` | `#027A49` | Texto y links sobre blanco |
| `primary-800` | `#04603A` | Encabezado sobre fondo verde |
| `primary-900` | `#054D31` | Texto sobre verde claro de marca |

> **Regla de oro:** el botón primario es **verde `#00B86B` con texto carbón `#0D1211`**
> (contraste 7.3:1). Nunca blanco sobre `#00B86B` (2.6:1 — no cumple).

#### Lima (acento)

`#AEDA2E` / `#C8EE4B`. **Solo sobre carbón** (`--c-neutral-950` / `900`): logos invertidos,
footer, banners de estado vacío, íconos de marca en modo oscuro. Sobre blanco no se usa:
contraste insuficiente.

#### Neutros — Carbón

Escala con matiz verde para integrarse con la marca sin verse gris muerto.

| Token | Hex | Uso |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Tarjetas, superficies elevadas |
| `neutral-25` | `#FBFCFB` | Lienzo de página |
| `neutral-50` | `#F5F7F6` | Zonas hundidas, hover de botón secundario |
| `neutral-100` | `#EDF0EF` | Borde sutil, hover de botón fantasma |
| `neutral-200` | `#E1E6E4` | Borde por defecto de campos y tarjetas |
| `neutral-300` | `#CBD2D0` | Borde fuerte / input deshabilitado |
| `neutral-400` | `#9BA5A2` | Texto secundario en modo oscuro |
| `neutral-500` | `#6E7A77` | Placeholder, texto terciario (4.5:1) |
| `neutral-600` | `#55605D` | **Texto secundario en claro (6.5:1)** |
| `neutral-700` | `#3B4442` | Texto de subtítulo fuerte |
| `neutral-900` | `#171D1B` | **Texto primario en claro (15.9:1)** |
| `neutral-950` | `#0D1211` | Texto sobre verde, fondo inverso |

#### Semánticos

| Estado | Fondo | Texto / borde | Nota |
|---|---|---|---|
| Éxito / Disponible | `#EAFBF3` | `#027A49` | Reutiliza el verde de marca |
| Advertencia / Pendiente | `#FEF4E2` | `#B45309` | Fondo ámbar, texto marrón (5:1) |
| Error / Ocupado | `#FDECEC` | `#C93A3F` | Relleno de botón: `#C93A3F` (5:1) |
| Información | `#EAF1FE` | `#1D4ED8` | Avisos neutros |

> **Amarillo ámbar siempre con texto carbón.** `#F5A524` es demasiado claro para texto
> blanco (2:1). Badge ámbar = fondo `#F5A524` + texto `#0D1211`.

#### Por deporte

Se usa para chips e iconos, nunca para superficies grandes.

| Deporte | Color |
|---|---|
| Fútbol | `#00B86B` |
| Vóley | `#2563EB` |
| Básquet | `#F5A524` |
| Tenis | `#8B5CF6` |
| Padel | `#14B8A6` |

#### Accesibilidad del color

| Combinación | Ratio | Uso |
|---|---|---|
| `neutral-900` sobre blanco | 15.9:1 | AAA — texto principal |
| `neutral-600` sobre blanco | 6.5:1 | AA — texto secundario |
| `neutral-950` sobre `primary-500` | 7.3:1 | AA — botón primario |
| `accent-500` sobre `neutral-950` | 11.6:1 | AAA — acento en oscuro |
| `danger-700` sobre blanco | 5.0:1 | AA — texto de error |
| `primary-700` sobre blanco | 5.4:1 | AA — links |

**Prohibido:** `primary-500` como texto sobre blanco; `warning-500` con texto blanco;
información de estado comunicada solo por color (siempre añadir icono o texto).

### 2.2 Tipografía

**Títulos:** Sora (600 / 700 / 800) — geométrica, ritmo de marca, muchos cortes.
**Texto e interfaz:** Inter (400 / 500 / 600).
**Códigos e IDs:** JetBrains Mono (400 / 500).

Ambas familias son de Google Fonts, disponibles nativamente en Google Stitch.

#### Escala

| Token | Tamaño / línea | Peso | Tracking | Uso |
|---|---|---|---|---|
| `display-1` | 48 / 52 | 800 | -0.022em | Cifras del panel admin, marketing |
| `display-2` | 40 / 44 | 700 | -0.022em | Título de portada pública |
| `h1` | 32 / 38 | 700 | -0.014em | Título de página |
| `h2` | 24 / 30 | 700 | -0.014em | Sección mayor |
| `h3` | 20 / 26 | 600 | -0.01em | Título de tarjeta |
| `h4` | 17 / 24 | 600 | 0 | Subtítulo, encabezado de tabla |
| `body-lg` | 17 / 28 | 400 | 0 | Texto introductorio |
| `body` | 16 / 24 | 400 | 0 | Cuerpo, etiquetas de campo |
| `body-sm` | 14 / 20 | 400 | 0 | Texto auxiliar, celdas |
| `caption` | 13 / 18 | 400 | 0 | Metadatos, pie de tabla |
| `label` | 12 / 16 | 600 | 0.06em | Etiquetas de campo (no mayúsculas) |
| `overline` | 11 / 14 | 700 | 0.09em | Antetítulos, Mayúsculas |

#### Reglas

- Máximo **68 caracteres** por línea (`--container-prose`).
- Los títulos en Sora **nunca** bajan de peso 600.
- Los números de **horario, precio y contador** usan `font-variant-numeric: tabular-nums`
  para alinearse en columnas y rejillas.
- Los valores de hora usan el formato **24 h** (`18:00 – 19:00`) en toda la app.
- Los pesos tipográficos altos (600+) se reservan para títulos y botones.

### 2.3 Espaciado

Base de **4 px**. Escala completa en `tokens.css` §4.

| Contexto | Valor |
|---|---|
| Interior de botón | 12 px 20 px (md) |
| Padding de tarjeta | 20 px |
| Padding de tarjeta con imagen | 0 (imagen) + 20 px (cuerpo) |
| Padding de página (móvil) | 16 px |
| Padding de página (≥1024 px) | 32 px |
| Gap entre tarjetas | 24 px |
| Gap entre campos de formulario | 20 px |
| Separación entre secciones | 48–64 px |

**Nunca** usar múltiplos impares de 4, ni valores inventados fuera de la escala.

### 2.4 Layout

- **Móvil primero.** El diseño base es 390 px de ancho (iPhone 14).
- **Grid de 12 columnas** ≥1024 px; 8 columnas ≥768 px; 4 columnas en móvil.
- **Contenedores:** 640 / 880 / 1120 / 1280 px.
- **Relleno (gutter):** 16 px móvil · 24 px tablet · 32 px escritorio.

#### Navegación

| Contexto | Comportamiento |
|---|---|
| Móvil (<768 px) | Barra superior de 64 px + **tab bar inferior** de 5 destinos, 68 px |
| Tablet (768–1023 px) | Barra superior; filtros como panel lateral colapsable |
| Escritorio (≥1024 px) | Barra superior de 72 px + **sidebar** de 248 px en el panel admin |

Destinos del cliente: **Explorar · Horario · Mis reservas · Perfil**
Destinos del admin: **Resumen · Clientes · Canchas · Reservas**

### 2.5 Radios

| Token | Valor | Uso |
|---|---|---|
| `xs` | 6 px | Etiquetas pequeñas, avatar |
| `sm` | 8 px | Inputs, botones small, celdas de horario |
| `md` | 12 px | Botones medianos, dropdowns |
| `lg` | 16 px | **Tarjetas, paneles, modales** |
| `xl` | 20 px | Tarjetas destacadas, banners |
| `2xl` | 28 px | Hojas superpuestas, estados vacíos grandes |
| `full` | 999 px | Chips, avatares, switch, botón de icono |

### 2.6 Sombras

Sombras con tinte verde (`rgb(13 18 17 / …)`), nunca negro puro. Dos niveles por
componente: reposo y elevado.

| Token | Uso |
|---|---|
| `xs` | Badge, chip |
| `sm` | **Tarjeta en reposo**, input en foco |
| `md` | Menú desplegable, popover |
| `lg` | **Tarjeta en hover**, sidebar |
| `xl` | Modal, drawer |

En modo oscuro las sombras duplican su opacidad sobre el carbón.

### 2.7 Iconografía

- **Material Symbols Rounded** (Google) — un solo set en todo el producto.
- Tamaños: **20 px** (dentro de botones y campos), **24 px** (navegación y acciones), **40 px**
  (ícono de estado vacío).
- Peso visual ~400 (línea 1.5 px). Nada de `fill`.
- **Prohibido usar emoji como ícono.** Un ícono decorativo no reemplaza a una etiqueta.
- Íconos con significado negativo siempre acompañados de texto.

### 2.8 Movimiento

| Token | Valor | Uso |
|---|---|---|
| `instant` | 80 ms | Cambio de color en hover |
| `fast` | 140 ms | Chips, switch, check |
| `base` | 200 ms | Botones, tarjetas, hover de fila |
| `slow` | 320 ms | Modales, drawers, expansión |

Curva estándar `ease-out cubic-bezier(0.22, 1, 0.36, 1)`. La confirmación de una reserva
usa `ease-spring` una sola vez. **Nada de animación de entrada en carga de página**;
el contenido aparece ya en su sitio (ver skeletons en §4.12).

---

## 3. Componentes

Todos consumiendo `tokens.css`. Estados obligatorios para todo componente interactivo:
`rest` · `hover` · `active` · `focus-visible` · `disabled` · `loading` · `error`.

### 3.1 Botón

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| **Primario** | `primary-500` | `neutral-950` | — | Una acción por pantalla |
| Secundario | `neutral-0` | `neutral-900` | `border-default` | Acción alternativa |
| Fantasma | transparente | `neutral-700` | — | Acción terciaria, toolbar |
| Peligro | `danger-700` | blanco | — | Eliminar, cancelar reserva |
| Verde suave | `primary-50` | `primary-700` | `primary-200` | Acción contextual en tarjeta |

| Tamaño | Alto | Padding X | Tamaño fuente |
|---|---|---|---|
| Small | 36 px | 12 px | 14 px |
| **Medium** | **44 px** | **20 px** | **15 px** |
| Large | 52 px | 24 px | 16 px |

- **Mínimo 44 px de alto** en cualquier dispositivo táctil.
- Radio `md` (12 px). El botón de icono es circular (`full`) de 44 px.
- Ancho completo (`width: 100%`) solo en formularios móviles y CTA de portada.
- Botón con icono: ícono a la izquierda a 20 px de separación; si el texto es ambiguo,
  ícono a la derecha.
- Estado de carga: el texto se sustituye por spinner y el ancho **no cambia**
  (se reserva el ancho del label).

### 3.2 Campo de formulario

- Alto 48 px. Radio `sm` (8 px). Borde `border-default` 1 px. Fondo `neutral-0`.
- Foco: borde `primary-500` + `--focus-ring` (3 px de halo al 30 %).
- **Etiqueta siempre visible** encima, 12 px peso 600, `neutral-700`.
  Nunca se reemplaza por placeholder.
- Texto de ayuda bajo el campo, 13 px, `neutral-600`.
- Error: borde `danger-500` + halo rojo + mensaje bajo el campo, 13 px, `danger-700`,
  con ícono de alerta. El mensaje aparece sin saltar el layout.
- Prefijo/sufijo permitidos: prefijo de texto (`+`), sufijo de botón (mostrar/ocultar
  contraseña), sufijo de unidad.
- Icono dentro del campo: 20 px a la izquierda, `neutral-500`.
- Checkbox y radio: 20 px, radio `xs`, 10 px de separación con la etiqueta.
- Switch: 44 × 26 px, `full`, off `neutral-300`, on `primary-500`, knob blanco 22 px.

#### Rejilla de formularios

- Una columna en móvil, 2 columnas ≥768 px, 2–3 columnas ≥1024 px.
- Los campos de ancho completo (email, dirección, mensaje) ocupan toda la fila.
- Alinéate por la parte superior, nunca por el centro.

### 3.3 Chip (filtro / etiqueta)

- Alto 36 px, radio `full`, padding 0 16 px, fuente 14 px peso 500.
- Off: fondo `neutral-0`, borde `border-default`, texto `neutral-700`.
- On: fondo `primary-50`, borde `primary-500`, texto `primary-700`, ícono check 16 px.
- Con punto de color (disciplina): el punto va antes del texto, 8 px.

### 3.4 Tarjeta de cancha

Anatomía: **imagen 16:10 con overlay degradado → badge de estado sobre el borde
superior izquierdo → chip de deporte sobre la imagen, esquina inferior izquierda →
título `h3` → ubicación con ícono → fila de metadatos (duración, tipo de piso, LUZ) →
precio `h3` + "/ hora" → botón primario a ancho completo**.

- Radio `lg`, borde `border-subtle`, sombra `sm` → `lg` en hover con
  `translateY(-2px)`.
- **Hover:** 200 ms `ease-out`, combina elevación de sombra y desplazamiento de 2 px.
- El precio es el elemento de mayor peso tipográfico después del título.
- Overlay en la imagen para que el texto de la esquina sea legible sobre cualquier foto.
- En móvil la imagen es 4:3 para aprovechar el ancho.

### 3.5 Rejilla de horarios

- Cuadrícula de 3–4 columnas (móvil) / 5–6 (escritorio), gap 8 px, altura 44 px.
- **Libre**: fondo `neutral-0`, borde `border-default`, texto `neutral-800`.
- **Seleccionado**: fondo `primary-500`, texto `neutral-950`, sin borde.
- **Ocupado**: fondo `neutral-100`, texto `neutral-400`, tachado sutil, `cursor: not-allowed`.
- **Pasado / deshabilitado**: mismo estilo que ocupado pero sin tachado.
- Rangos contiguos seleccionables: se comportan como un solo bloque pulsable.
- La leyenda de estados va siempre encima de la rejilla.

### 3.6 Badge de estado

- Alto 24 px, radio `full`, padding 0 10 px, fuente 12 px peso 600.
- Variantes: `disponible` (verde) · `ocupado` (rojo) · `pendiente` (ámbar) ·
  `cancelada` (neutro) · `completada` (verde suave) · `activo` (verde) ·
  `inactivo` (neutro).
- **Nunca** un badge de estado sin ícono o sin texto.

### 3.7 Tabla (panel admin)

- Cabecera: fondo `neutral-50`, texto 12 px mayúsculas peso 700 tracking `overline`,
  alto 44 px.
- Filas: alto 56 px, borde inferior `border-subtle`, hover `neutral-25`.
- Texto: 14 px. Cifras en `tabular-nums`.
- Celdas de acción alineadas a la derecha, íconos de 20 px con tooltip.
- Ordenamiento: ícono de flecha junto al encabezado de columna, 16 px.
- Selección múltiple: checkbox de 20 px a la izquierda de cada fila.
- En <1024 px la tabla pasa a **tarjetas apiladas** con etiqueta y valor por campo.

### 3.8 Modal y drawer

- Modal: ancho 480 px (640 para formularios largos), radio `lg`, sombra `xl`.
- Overlay `--bg-overlay`. Cierre con X, Escape o clic fuera.
- Drawer (filtros en móvil): ancho 100 %, entra desde abajo, radio `2xl` arriba.
- Encabezado: título `h3` + subtítulo `body-sm`; cuerpo con padding 24 px;
  pie con acciones alineadas a la derecha y borde superior `border-subtle`.

### 3.9 Feedback

- **Toast**: arriba a la derecha (escritorio), abajo (móvil), ancho 360 px,
  radio `md`, ícono + título `h4` + mensaje `body-sm`, autocierre 5 s.
- **Alert inline**: dentro del flujo, radio `md`, borde izquierdo 3 px del color semántico.
- **Confirmación de reserva**: modal de éxito con check grande en `primary-500`,
  animación `ease-spring` única, y resumen de la reserva.

### 3.10 Navegación

- Barra superior: logo a la izquierda, enlaces al centro, avatar + carrito a la derecha.
- Altura 72 px en escritorio, con `backdrop-blur` y borde inferior `border-subtle`.
- Elemento activo: texto `neutral-900` peso 600 + indicador verde de 2 px debajo.
- Avatar: 36 px, radio `full`, borde 2 px `primary-500` en la sesión activa.
- Tab bar móvil: 5 destinos, ícono 24 px + label 11 px, activo en `primary-700`,
  con indicador superior de 3 px redondeado.

### 3.11 Estado vacío

- Contenedor centrado, ancho 400 px, padding 64 px 24 px.
- Ícono 40 px en `neutral-300` dentro de un círculo `neutral-100` de 72 px.
- Título `h3`, mensaje `body-sm` en `neutral-600`, acción primaria debajo.
- **Nunca** un estado vacío sin acción siguiente.

### 3.12 Carga

- **Skeleton** con `linear-gradient` animado en `neutral-100/200`, radio igual al
  componente real, 1.4 s en bucle. Mantiene la geometría para evitar saltos.
- Botones: spinner (ícono `progress_activity` en bucle) + texto atenuado.
- Nunca un spinner a pantalla completa si hay estructura conocida.

### 3.13 Tarjeta de estadística (admin)

- Rejilla de 4 columnas ≥1024 px, 2 en móvil.
- Etiqueta `overline` `neutral-600`, valor `display-1` tabular, delta con ícono
  de tendencia en verde o rojo.

---

## 4. Patrones de pantalla

### 4.1 Autenticación (login / registro)

- Ancho de tarjeta **440 px**, centrada, sobre lienzo `neutral-25`.
- Panel izquierdo (≥1024 px) con imagen de cancha oscurecida y eslogan; el formulario
  vive en la mitad derecha. Por debajo de 1024 px solo el formulario.
- Logo arriba, enlace de "¿No tienes cuenta?" al pie de la tarjeta.
- Registro en **2 pasos** (datos de cuenta → datos personales) con indicador de
  progreso segmentado y barra verde.

### 4.2 Catálogo de canchas

- Orden: barra de búsqueda + chips de filtro → resultados → paginación.
- **Barra de filtros sticky** bajo el header (64 px) en escritorio.
- Móvil: botón `Filtros` que abre drawer; filtros activos como chips removibles.
- Rejilla: 3 columnas ≥1280 px, 2 ≥768 px, 1 en móvil.
- Estado vacío: "No encontramos canchas" + botón para limpiar filtros.

### 4.3 Detalle de cancha

- Dos columnas ≥1024 px: **izquierda** galería + descripción + amenidades;
  **derecha (sticky)** tarjeta de reserva con selector de fecha, selector de hora
  y resumen de precio.
- El selector de fecha es una fila horizontal de 7 días, no un calendario completo.
- En móvil el orden se invierte: imagen → resumen de precio → fecha → hora → CTA fijo.

### 4.4 Mis reservas

- Tabs `Próximas` / `Pasadas` / `Canceladas`.
- Lista de tarjetas horizontales: fecha en bloque, cancha, horario, estado, acciones.
- Acción destructiva (`Cancelar`) siempre con modal de confirmación.

### 4.5 Perfil

- Formulario en tarjeta de 640 px, dos columnas ≥768 px.
- Zona de carga de avatar a la izquierda (96 px) con botón `Cambiar`.
- Bloque `Cambiar contraseña` separado por divider, con los 3 campos.

### 4.6 Panel admin

- Sidebar 248 px + contenido.
- Cabecera: título `h1` + descripción `body-sm` + acción primaria a la derecha.
- Fila de métricas, luego toolbar (búsqueda + filtros + acciones masivas), luego tabla.
- Acciones masivas aparecen en una barra contextual sobre la tabla al seleccionar filas.

---

## 5. Voz y copy

- **Tuteo** siempre. Nunca "usted" ni "estimado usuario".
- Sentencias cortas, verbo en primera persona del usuario: *"Reserva tu cancha"*, no *"Se
  realizó la reserva"*.
- Errores en segunda persona y con siguiente paso: **"Ese correo ya está registrado.
  Prueba iniciar sesión."**
- Números y horarios siempre con cifras: *"2 reservedor de 8 canchas"* → *"7 de 8 canchas
  reservadas"*.
- Formato de hora **24 h con punto**: `18:00`. Rango: `18:00 – 19:00`.
- Precios: `$12.000 / hora` (es-CO / es-PE según mercado), nunca solo el número.
- Etiquetas de estado en **femenino** si el sustantivo lo es (cancha ocupada, reserva
  cancelada).

---

## 6. Mapeo con el backend

Campos de `Cliente` (`user-service`) y su tratamiento visual:

| Campo JSON | Etiqueta | Tipo de campo | Requerido | Validación |
|---|---|---|---|---|
| `nombre` | Nombre | Texto | Sí | 2–100 |
| `apellido` | Apellido | Texto | Sí | 2–100 |
| `email` | Correo electrónico | Texto + ícono | Sí | Regex, único |
| `telefono` | Teléfono | Texto, prefijo `+` | No | Máx. 20, solo dígitos |
| `password` | Contraseña | Contraseña con toggle | Sí (registro) | Mín. 8 |
| `fechaRegistro` | Miembro desde | Solo lectura | Auto | `dd/mm/aaaa` |
| `activo` | Cuenta activa | Switch (admin) | — | — |

> El backend devuelve `password` en claro dentro del objeto cliente en
> `/api/clientes/email/{email}` y en `/api/clientes`. **Nunca deserializar ese campo en
> un componente visible**; el frontend debe eliminarlo antes de almacenarlo.

Endpoints disponibles (auth `8081`, user `8080`) — mantener la nomenclatura al diseñar
estados de carga y error:

- `POST /api/auth/register` → 201 · `POST /api/auth/login` → 200
- `POST /api/clientes/registro` · `GET /api/clientes` · `GET /api/clientes/{id}` ·
  `GET /api/clientes/email/{email}`
- **No hay endpoints de reservas, canchas ni perfil todavía.** Esas pantallas se diseñan
  contra un contrato propuesto (`Cancha`, `Reserva`) documentado abajo.

### Contrato propuesto para las pantallas que aún no tienen API

```jsonc
// Cancha
{
  "id": 1, "nombre": "Cancha Futbol 1", "deporte": "futbol",
  "direccion": "Cra 45 # 12-30", "zona": "Norte", "superficie": "césped sintético",
  "techado": true, "iluminacion": true, "precioHora": 12000,
  "capacidad": 10, "imagenUrl": "...", "puntuacion": 4.6
}

// Reserva
{
  "id": 1, "canchaId": 1, "clienteId": 4,
  "fecha": "2026-10-08", "horaInicio": "18:00", "horaFin": "19:00",
  "estado": "confirmada", "total": 12000,
  "codigo": "SC-4A7F2", "creadaEn": "2026-10-05T14:20:00"
}
```

Estados de reserva a soportar en badge: `confirmada` · `pendiente` · `completada` ·
`cancelada` · `rechazada`.

---

## 7. Reglas de accesibilidad

1. Contraste mínimo **4.5:1** en texto, **3:1** en bordes e íconos significativos.
2. Foco visible en todo elemento interactivo (`focus-visible`, nunca `outline: none`).
3. Objetivo táctil mínimo **44 × 44 px**.
4. El estado nunca depende solo del color: badge + texto, o ícono + color.
5. Etiqueta asociada a cada campo (`<label for>`), no solo placeholder.
6. `aria-live="polite"` en toasts y mensajes de validación.
7. Los skeletons llevan `aria-busy="true"`; los spinners, texto alternativo.
8. Modales con foco atrapado, `Escape` para cerrar y retorno del foco al disparador.
9. Soportar zoom al 200 % sin desbordes horizontales.
10. Respetar `prefers-reduced-motion: reduce` (desactivar `slow` y `spring`).

---

## 8. Anti-patrones

Evitar en toda generación, incluida la hecha con Stitch:

- ❌ Botón verde con texto blanco
- ❌ Degradados morados o violeta (herencia del template de Vite, fuera de marca)
- ❌ Emoji como íconos de interfaz
- ❌ Sombras negras puras o demasiado difusas
- ❌ Texto de placeholder en vez de etiqueta
- ❌ Más de un botón primario por pantalla
- ❌ Cards con altura forzada por `align-items: stretch` producing huecos
- ❌ Texto sobre foto sin overlay
- ❌ Bordes punteados o mezcla de radios (solo la escala de §2.5)
- ❌ Iconografía de distintos sets
- ❌ Inventar datos: usar siempre nombres de dominio de §6, no "Lorem ipsum"

---

## 9. Activar los tokens en la app

El archivo [`tokens.css`](../../FrontEnd-App-ingWeb/src/styles/tokens.css) ya existe pero
todavía no se importa. Para activarlo, en `src/main.jsx` (después de `index.css`, para que
los tokens ganen por cascada):

```jsx
import './index.css'
import './styles/tokens.css'
```

Y las tipografías, en `index.html` dentro de `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

Modo oscuro, desde JS:

```js
document.documentElement.dataset.theme = 'dark' // o 'light'
```

## 10. Checklist de revisión

Antes de aprobar cualquier pantalla:

- [ ] Consume solo tokens de `tokens.css`, sin hex sueltos
- [ ] Un único botón primario, con la jerarquía correcta
- [ ] Estados `hover` / `focus-visible` / `disabled` / `loading` / `error` completos
- [ ] Contraste verificado (≥ 4.5:1 texto, ≥ 3:1 bordes)
- [ ] Objetivos táctiles ≥ 44 px
- [ ] Responsive 390 / 768 / 1024 / 1280 sin desbordes
- [ ] Estados vacío, carga y error diseñados
- [ ] Textos en español, tuteo, sin emojis
- [ ] Copy de error incluye siguiente paso
- [ ] Iconos del set Material Symbols Rounded
