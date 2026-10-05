# Prompts para Google Stitch — Sistema Canchas

Guía operativa para generar todos los componentes y pantallas de **Sistema Canchas**
con [Google Stitch](https://stitch.withgoogle.com), manteniendo coherencia visual total.

**Antes de empezar:** ten a la mano
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) (referencia) y
[`stitch-theme.json`](./stitch-theme.json) (valores exactos).

---

## 0. Cómo trabajar con Stitch (flujo recomendado)

Stitch no es un generador de "una pantalla completa en un clic". Es un generador de
**pantallas iterativas con un tema persistente**. El orden importa: si generas pantallas
sueltas sin tema, cada una tendrá su propio estilo y el resultado no parecerá un producto.

```
┌─ PASO 1 ──────────────────────────────────────────────┐
│ Abre stitch.withgoogle.com → New design              │
│ Formato: Web · Desktop · 1440 px                      │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌─ PASO 2 ──────────────────────────────────────────────┐
│ Pega el PROMPT MAESTRO (§1).                         │
│ → Genera el marco + navegación + una pantalla de       │
│   ejemplo. NO es aún la pantalla final.               │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌─ PASO 3 ──────────────────────────────────────────────┐
│ En el panel derecho → Theme / Design tokens:          │
│ transcribe los valores de stitch-theme.json           │
│ (color, fuentes, radio, elevación).                  │
│ Guarda el tema con nombre "Sistema Canchas — Energía".│
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌─ PASO 4 ──────────────────────────────────────────────┐
│ Genera la HOJA DEL SISTEMA con el Prompt 0 (§2).      │
│ → Este frame es tu librería de componentes.           │
│ → Si Stitch tiene "guardar como tema/variante",       │
│   actualiza el tema desde aquí.                       │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌─ PASO 5 ──────────────────────────────────────────────┐
│ Genera las pantallas §3 (P1 … P9), UNA POR MENSAJE.   │
│ Empieza cada prompt con:                              │
│   "Usa el tema 'Sistema Canchas — Energía' y el estilo │
│    exacto de la hoja del sistema. No cambies colores, │
│    tipografías ni radios."                            │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌─ PASO 6 ──────────────────────────────────────────────┐
│ Pide variantes y estados con §4 (responsive, oscuro,  │
│ vacío, carga, error).                                 │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌─ PASO 7 ──────────────────────────────────────────────┐
│ Exporta a Figma (modo Standard) o al código (modo      │
│ no-code). Ajusta los tokens CSS si el export usa       │
│ hex literales.                                        │
└─────────────────────────────────────────────────────────┘
```

### Reglas de redacción de prompts (lo que hace que Stitch acierte)

| Sí | No |
|---|---|
| Describir la **estructura** por zonas ("sidebar 248 px, contenido a la derecha") | "Haz algo bonito" |
| Dar **datos reales** ("Cancha Fútbol 1, $12.000/hora") | "Lorem ipsum", "texto de ejemplo" |
| Nombrar **estados** por pantalla (vacío, carga, error) | Generar solo el estado feliz |
| Fijar **un solo dato controversial** a la vez ("haz la versión de escritorio") | Pedir 6 pantallas en un prompt |
| Indicar **qué NO** debe cambiar ("mantén colores y tipografías") | Re-declarar todo el sistema cada vez |
| Dar **medidas** cuando importen (ancho de tarjeta, alto de botón) | Dejar el layout al azar |

---

## 1. Prompt maestro de estilo

Pégalo en el **primer** mensaje de un Stitch nuevo. No genera una pantalla final: fija
el lenguaje visual sobre el que se construirán todas las demás.

```
Crea la base del sistema de diseño de una aplicación web llamada "Sistema Canchas",
una plataforma para reservar canchas deportivas por hora. Este mensaje define el
estilo; no necesito una pantalla concreta todavía.

DIRECCIÓN VISUAL
Deportivo moderno, limpio y de alto contraste. Estética de herramienta profesional,
no de landing page de marketing. Sensación de cancha sports: ordenada, luminosa, con energía.

PALETA
- Verde energía #00B86B como color de marca y acción principal.
- Botón primario: fondo verde #00B86B con texto carbón #0D1211 (NO texto blanco).
- Carbón #0D1211 para texto principal y superficies inversas.
- Fondo de página #FBFCFB, tarjetas blancas #FFFFFF.
- Texto principal #171D1B, texto secundario #55605D, texto apagado #6E7A77.
- Bordes #E1E6E4 (por defecto) y #EDF0EF (sutiles).
- Semánticos: éxito #027A49 sobre #EAFBF3; error #C93A3F sobre #FDECEC;
  advertencia #B45309 sobre #FEF4E2; información #1D4ED8 sobre #EAF1FE.
- Acento lima #AEDA2E, usado únicamente sobre superficie carbón.
- Colores por deporte: fútbol #00B86B, vóley #2563EB, básquet #F5A524,
  tenis #8B5CF6, pádel #14B8A6.

TIPOGRAFÍA
- Sora para títulos (600, 700, 800), geométrica y moderna.
- Inter para todo el texto de interfaz (400, 500, 600).
- Escala: display 48, títulos 32 / 24 / 20, cuerpo 16, texto pequeño 14,
  caption 13, etiquetas 12, antetítulo 11 mayúscula con tracking amplio.
- Interlineado 1.5 en cuerpo, 1.1 en títulos grandes.
- Los números de hora, precio y contadores alineados con cifras tabulares.

FORMA
- Radios: 8 px en inputs y chips de horario, 12 px en botones,
  16 px en tarjetas y modales, 28 px en elementos muy destacados,
  píldora completa en chips y avatares.
- Sombras suaves con tinte verde, nunca negras: 0 1px 3px rgba(13,18,17,0.08) en
  reposo, 0 12px 28px rgba(13,18,17,0.10) en hover.
- Todo el espaciado es múltiplo de 4 px.

ICONOS
Material Symbols Rounded, un solo set. 20 px dentro de botones y campos,
24 px en navegación. Nada de emoji como iconos de interfaz.

COMPONENTES CLAVE QUE DEBES RESPETAR
- Botones de 44 px de alto, 12 px de radio, un solo botón primario verde por pantalla.
- Campos de 48 px de alto con etiqueta visible encima, nunca solo placeholder.
- Tarjetas con borde 1 px sutil, radio 16 y sombra mínima.
- Badges de estado de 24 px en forma de píldora, siempre con texto.
- Tabla de datos con cabecera de 44 px en gris claro y filas de 56 px.

COMPONENTES QUE NO DEBEN APARECER
- Ningún elemento violeta o morado.
- Ningún botón verde con texto blanco.
- Ningún emoji como icono.
- Ningún degradado decorativo de fondo, salvo overlays oscuros sobre fotografía.
- Ningún borde punteado ni mix de radios.

ENTREGA
Preséntame un frame de 1440 px con la estructura base de la aplicación: barra
superior de 72 px con logotipo a la izquierda y navegación al centro, y debajo
el área de contenido sobre fondo #FBFCFB. Aplica el estilo descrito a los
componentes que aparezcan.
```

---

## 2. Prompt 0 — Hoja del sistema (biblioteca de componentes)

**El frame más importante de todo el proyecto.** Genera una pantalla tipo "style guide"
con los componentes reales. Luego úsala como referencia visual para el resto.

```
Usa el tema que definimos en el mensaje anterior. Crea una "hoja del sistema"
(style guide) de 1440 px con todos los componentes del producto "Sistema Canchas",
dispuestos en secciones sobre fondo #FBFCFB. Esta hoja será la referencia visual
para el resto de pantallas, así que cada variante debe verse exacta.

SECCIÓN 1 — Tipografía
Muestra la escala completa: display 48 bold, display 40, H1 32, H2 24, H3 20, H4 17,
cuerpo 17 y 16, texto pequeño 14, caption 13, etiqueta 12 semibold, antetítulo 11
mayúscula. Usa como texto de muestra frases reales del dominio:
"Reserva tu cancha", "Elige el horario que prefieras", "Canchas disponibles cerca de ti".

SECCIÓN 2 — Colores
Muestra la escala del verde energía del 50 al 900 con su hex debajo, la escala de
carbón, los 4 colores semánticos con su fondo suave y los 5 colores por deporte.

SECCIÓN 3 — Botones
Fila 1: Primario (verde #00B86B, texto carbón), Secundario (blanco, borde gris),
Fantasma (sin fondo), Peligro (#C93A3F, texto blanco), Verde suave (fondo #EAFBF3,
texto #027A49).
Fila 2: los mismos en tamaño grande (52 px).
Fila 3: los mismos deshabilitados, y el primario en estado de carga con spinner.
Fila 4: Botón de icono circular 44 px, y el primario a ancho completo.

SECCIÓN 4 — Campos de formulario
Input de texto con etiqueta visible, input con ícono a la izquierda, input con
prefijo "+57", campo de contraseña con botón de mostrar/ocultar, input en estado
de foco con halo verde, input con error (borde rojo + mensaje debajo con ícono),
textarea, y un select abierto mostrando la lista de opciones con la opción activa
resaltada en #EAFBF3.

SECCIÓN 5 — Badges y chips
Badges de estado: Disponible (verde), Ocupado (rojo), Pendiente (ámbar),
Cancelada (neutro), Activo (verde), Inactivo (neutro).
Chips de filtro en estado apagado y encendido. Chips de deporte con punto de color.

SECCIÓN 6 — Rejilla de horarios
Chips de 44 px de alto en cuadrícula: libre (blanco con borde), seleccionado
(verde #00B86B con texto carbón), ocupado (gris claro, tachado, deshabilitado).
Incluye arriba la leyenda de los tres estados.

SECCIÓN 7 — Tarjeta de cancha
Tarjeta de 360 px de ancho con: imagen de cancha 16:10 con overlay degradado,
badge "Disponible" arriba a la izquierda, chip de deporte "Fútbol" abajo a la
izquierda sobre la imagen, título "Cancha Fútbol 1", ubicación con ícono
"Cra 45 # 12-30, Zona Norte", fila de metadatos (Césped sintético · Techada ·
Iluminada), precio "$12.000 / hora" y botón primario "Reservar" a ancho completo.

SECCIÓN 8 — Tabla de datos
Cabecera de 44 px con fondo gris claro y texto en mayúsculas; cuatro filas de
56 px con avatar, nombre, correo, teléfono, badge de estado y dos iconos de acción
a la derecha. Una fila en hover con fondo resaltado y una fila seleccionada con
fondo verde muy suave.

SECCIÓN 9 — Estados
Estado vacío con ícono en círculo gris, título "No tienes reservas todavía",
mensaje y botón primario. Skeleton de carga de tarjeta. Toast de éxito.

SECCIÓN 10 — Navegación
Barra superior de 72 px con el logotipo y un elemento de navegación activo con
indicador verde de 2 px debajo. Barra inferior móvil de 5 destinos con el activo
resaltado. Sidebar de 248 px con el primer ítem activo en fondo verde suave.
```

---

## 3. Prompts por pantalla

Cada prompt es autónomo. **Genera uno por mensaje.** Si Stitch ofrece selector de
formato, elige `Web · Desktop · 1440` salvo en P2 y P7, donde conviene empezar en móvil.

### P1 — Iniciar sesión

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.
No cambies colores, tipografías ni radios.

Crea la pantalla de INICIAR SESIÓN, formato web desktop 1440 px.

LAYOUT
Dos columnas. Izquierda (55%): fotografía a sangre completa de una cancha de fútbol
con líneas de pintura bien visibles, oscurecida con un overlay lineal al 70% en
carbón #0D1211, con el logotipo de Sistema Canchas arriba a la izquierda y, en la
parte inferior, un titular en Sora 40 px de color blanco con la frase "Encuentra y
reserva tu cancha en segundos" y un texto de apoyo de 17 px en blanco al 80%.
Derecha (45%): fondo #FBFCFB, contenido centrado en una tarjeta de 440 px.

CONTENIDO DE LA TARJETA (de arriba hacia abajo)
1. Título "Hola de nuevo" en Sora 32 px semibold #171D1B.
2. Subtítulo "¿No tienes cuenta? Regístrate" en 14 px #55605D, con la palabra
   "Regístrate" en #027A49 y subrayada como enlace.
3. Campo "Correo electrónico": etiqueta visible 12 px, input de 48 px con ícono de
   sobre a la izquierda, valor escrito "juan.perez@correo.com".
4. Campo "Contraseña": etiqueta visible, input de 48 px con candado a la izquierda y
   botón de ojo a la derecha para mostrar/ocultar, valor con puntos, y debajo a la
   derecha el enlace "¿Olvidaste tu contraseña?" en #027A49 de 14 px.
5. Checkbox marcado "Recordarme" con etiqueta a su derecha.
6. Botón primario a ancho completo "Iniciar sesión", 52 px de alto, fondo verde
   #00B86B con texto carbón #0D1211.
7. Separador "o" con línea a ambos lados.
8. Botón secundario a ancho completo con ícono de Google "Continuar con Google".

PIE DE PÁGINA
Texto centrado de 14 px en #55605D: "¿Problemas para entrar? Escríbenos".

DETALLES
Los dos campos deben verse con estado de foco: borde verde #00B86B y halo verde
al 30%. Los corners son 12 px. Sin sombras fuertes, solo 0 1px 3px con tinte verde.
No uses violetas, ni degradados de fondo, ni emojis como iconos.
```

### P2 — Crear cuenta (2 pasos)

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla de REGISTRO en dos pasos, formato web desktop 1440 px.
Genera el PASO 1 (Datos de la cuenta); después te pediré el paso 2.

LAYOUT
Misma retícula de dos columnas que el inicio de sesión, pero al revés: formulario a
la izquierda (55%) y fotografía de cancha con overlay oscuro a la derecha (45%),
con el titular "Únete a la comunidad deportiva de tu ciudad".

CONTENIDO
1. Indicador de progreso: dos segmentos horizontales de 8 px de alto y radio 999 px.
   El primero en verde #00B86B, el segundo en gris #E1E6E4, separados por 8 px.
   Encima, antetítulo 11 px mayúscula "PASO 1 DE 2" en #55605D.
2. Título "Crea tu cuenta" en Sora 32 px semibold.
3. Subtítulo "Tus datos de acceso" en 14 px #55605D.
4. Campo "Nombre" con valor "Juan".
5. Campo "Apellido" con valor "Pérez".
6. Campo "Correo electrónico" con ícono de sobre y valor "juan.perez@correo.com".
7. Campo "Contraseña" con candado, botón de ojo, 8 puntos de relleno, y debajo un
   texto de ayuda de 13 px en #55605D: "Mínimo 8 caracteres".
8. Campo "Confirmar contraseña" con los mismos puntos de relleno.
9. Checkbox sin marcar "Acepto los términos y condiciones y la política de privacidad"
   con "términos y condiciones" como enlace en #027A49.
10. Botón primario a ancho completo "Continuar", 52 px, fondo #00B86B, texto carbón,
    con ícono de flecha a la derecha.
11. Botón fantasma a ancho completo "Volver a iniciar sesión", 44 px.
12. Separador "o" y botón secundario "Continuar con Google".

DETALLES
Todos los campos con etiqueta visible de 12 px semibold encima y alto de 48 px,
radio 8 px, borde #E1E6E4. Sin placeholders como sustituto de la etiqueta.
Sin emojis. Texto en español de Latinoamérica con tuteo.
```

**Prompt para el Paso 2** (después de generar el 1):

```
Genera ahora el PASO 2 de la misma pantalla de registro, manteniendo idéntica la
estructura, el indicador de progreso y el pie. Cambia solo el contenido:

1. Antetítulo "PASO 2 DE 2"; el segundo segmento del progreso ahora en verde
   #00B86B y el primero en #E1E6E4.
2. Título "Cuéntanos de ti".
3. Subtítulo "Solo un dato para completar tu perfil".
4. Campo "Teléfono" con prefijo fijo "+57" en un recuadro de 44 px a la izquierda
   del input, y placeholder "300 123 4567". Debajo, ayuda de 13 px en #55605D:
   "Opcional. Te avisamos por aquí si cambia una reserva".
5. Campo "Zona preferida": select cerrado con ícono de ubicación, valor
   "Norte (Bogotá)".
6. Checkbox marcado "Quiero recibir recordatorios de mis reservas".
7. Botón primario a ancho completo "Crear cuenta", con ícono de check.
8. Botón fantasma "Volver", sin acción asociada en esta pantalla.
9. Nota de ayuda centrada de 13 px en #55605D con ícono de candado:
   "Tus datos están cifrados y nunca los compartimos".
```

### P3 — Recuperar contraseña

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla OLVIDÉ MI CONTRASEÑA, formato web desktop 1440 px, centrada.

LAYOUT
Tarjeta de 440 px centrada sobre fondo #FBFCFB, sin fotografía a los lados.

CONTENIDO
1. Círculo de 56 px de diámetro con fondo #EAFBF3 e ícono de candado en
   #027A49 de 24 px.
2. Título "Recupera tu contraseña" en Sora 24 px semibold, centrado.
3. Texto "Escribe tu correo y te enviamos un enlace para crear una nueva
   contraseña." de 15 px en #55605D, centrado, ancho máximo de 34 caracteres
   por línea.
4. Campo "Correo electrónico" con ícono de sobre y valor
   "juan.perez@correo.com", con borde verde y halo de foco.
5. Botón primario a ancho completo "Enviar enlace", 52 px, fondo #00B86B,
   texto carbón #0D1211.
6. Separador "o".
7. Botón secundario a ancho completo "Volver a iniciar sesión" con ícono de
   flecha a la izquierda.
8. Alert inline con fondo #EAFBF3, borde izquierdo 3 px #027A49, ícono de
   información: "Si el correo está registrado, recibirás el enlace en menos de
   un minuto".
```

### P4 — Catálogo de canchas

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla de EXPLORAR CANCHAS, formato web desktop 1440 px. Esta es la
pantalla principal del producto.

LAYOUT DE TRES FRANJAS
1. Barra superior de 72 px: logotipo a la izquierda, navegación central con
   "Explorar" activo (texto #171D1B peso 600 e indicador verde de 2 px debajo),
   y a la derecha un ícono de notificaciones con un punto verde de 6 px, un
   avatar de 36 px y el nombre "Juan Pérez".
2. Barra de filtros pegajosa de 88 px, fondo blanco, borde inferior #EDF0EF,
   con estos controles en una fila:
   - Campo de búsqueda de 320 px con ícono de lupa: "Buscar por nombre o zona".
   - Select "Deporte" con valor "Todos los deportes".
   - Select "Zona" con valor "Toda la ciudad".
   - Select "Fecha" con ícono de calendario y valor "Hoy, 8 oct".
   - Select "Hora" con valor "Cualquier hora".
   - Botón secundario con ícono de filtro y contador "2": "Filtros".
3. Zona de resultados con fondo #FBFCFB: a la izquierda un bloque de texto, a la
   derecha un select "Ordenar por" con valor "Más cercanas".
   Texto principal: "42 canchas disponibles" en Sora 24 px semibold.
   Texto secundario: "Mostrando 9 de 42" en 14 px #55605D.
   Debajo, una fila de chips: "Todas" (encendido, verde), "Fútbol", "Vóley",
   "Básquet", "Tenis", "Padel", "Techadas" (con ícono de techo).

REJILLA DE TARJETAS
Tres columnas de ancho igual, separadas por 24 px. Nueve tarjetas con esta
estructura exacta:
- Imagen 16:10 de cancha con overlay degradado oscuro al 55% en la parte inferior.
- Badge "Disponible" en la esquina superior izquierda, píldora de 24 px, fondo
  #EAFBF3, texto #027A49, 12 px semibold.
- Chip de deporte con punto de color en la esquina inferior izquierda sobre la
  imagen: "Fútbol" verde, "Vóley" azul, "Básquet" ámbar, "Tenis" violeta,
  "Padel" teal.
- Título en Sora 20 px semibold: "Cancha Fútbol 1", "Cancha Vóley Norte",
  "Complejo El Olivar", etc.
- Ubicación con ícono de pin de 20 px: "Cra 45 # 12-30 · Zona Norte".
- Metadatos en 14 px #55605D con íconos: "Césped sintético", "Techada",
  "Iluminada", "10 personas".
- Fila inferior con precio: "$12.000" en Sora 20 px semibold y "/ hora" en
  14 px #55605D, y a la derecha la puntuación con estrella "4.6" más "(18)".
- Botón secundario a ancho completo "Ver horarios".

PIE
Paginación centrada con flechas y páginas 1 a 5, la 1 activa en fondo #EAFBF3
con borde verde.

DETALLES
Las tarjetas tienen radio 16 px, borde 1 px #EDF0EF, sombra
0 1px 3px rgba(13,18,17,0.08). Al pasar el cursor suben 2 px y la sombra pasa a
0 12px 28px rgba(13,18,17,0.10), con transición de 200 ms.
Solo un botón verde: el de la página activa. Ninguna tarjeta lleva botón verde.
Fotos reales de canchas. Sin emojis y sin violetas.
```

### P5 — Detalle de cancha y selector de horario

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla de DETALLE DE CANCHA con RESERVA, formato web desktop 1440 px.
Dos columnas: contenido a la izquierda (65%) y tarjeta de reserva fija (35%).

COLUMNA IZQUIERDA
1. Migas de pan de 13 px en #55605D: "Explorar / Canchas / Cancha Fútbol 1",
   con separadores de flecha.
2. Galería: una imagen grande 21:9 de la cancha con overlay, y debajo una fila de
   cuatro miniaturas de 96 x 64 px con radio 8 px, la primera con borde verde
   de 2 px.
3. Encabezado: chip de deporte "Fútbol" con punto verde, título "Cancha Fútbol 1"
   en Sora 32 px semibold, y a la derecha un botón secundario con estrella
   "Favorito".
4. Fila de datos en una caja con fondo #F5F7F6 y radio 12 px, cuatro celdas
   separadas por líneas: "Superficie: Césped sintético", "Dimensiones:
   105 x 68 m", "Capacidad: 10 personas", "Iluminación: LED".
5. Sección "Sobre la cancha" con título H2 de 24 px y dos párrafos de 16 px
   real: "Cancha de fútbol 11 con césped sintético de última generación,
   techada y con iluminación LED. Ubicada en el norte de la ciudad, con
   acceso vehicular y parqueadero para 20 vehículos." y un segundo párrafo
   sobre el acceso y los vestuarios.
6. Sección "Qué incluye" con cinco ítems en dos columnas, cada uno con un ícono
   de 20 px y título 14 px semibold más descripción 13 px: Vestuarios con duchas,
   Casillero de 20 puestos, Baños públicos, Estacionamiento, Kiosco de agua.
7. Sección "Ubicación": tarjeta con mapa estático simulado de 120 px de alto,
   radio 12 px, con un pin verde #00B86B en el centro, y debajo la dirección
   "Cra 45 # 12-30, Zona Norte" con un botón secundario "Cómo llegar".
8. Sección "Opiniones": título H2, resumen "4.6" grande junto a 5 estrellas
   verdes y "18 reseñas", y dos tarjetas de reseña de 13 px con avatar de 40 px,
   nombre, fecha y texto.

COLUMNA DERECHA — TARJETA DE RESERVA (fija al hacer scroll)
Tarjeta blanca, radio 16, borde #EDF0EF, sombra media, padding de 24 px.
1. Precio "$12.000" en Sora 24 px semibold con "/ hora" en 14 px #55605D.
2. Antetítulo "ELIGE EL DÍA" de 11 px mayúscula #55605D.
3. Fila horizontal de 7 días: cada uno es un botón de 56 x 68 px con radio 12,
   borde #E1E6E4, y dentro el día de la semana en 12 px, el número en 17 px
   semibold y un punto verde de 4 px si hay disponibilidad. El día seleccionado
   tiene fondo #00B86B y texto carbón. Etiquetas: "Hoy 8", "Sáb 9", "Dom 10",
   "Lun 11", "Mar 12", "Mié 13", "Jue 14".
4. Antetítulo "HORARIOS DISPONIBLES" de 11 px mayúscula #55605D, con contador
   "12 de 20 libres" en 13 px a la derecha.
5. Leyenda de tres estados: punto verde "Libre", punto gris "Ocupado",
   punto verde relleno "Seleccionado".
6. Rejilla de 4 columnas de chips de 44 px de alto y radio 8, con estos horarios:
   06:00, 07:00, 08:00 ocupado, 09:00 ocupado, 10:00, 11:00, 12:00, 13:00,
   14:00, 15:00, 16:00 ocupado, 17:00, 18:00, 19:00, 20:00, 21:00.
   El estado seleccionado es fondo #00B86B con texto #0D1211; el ocupado es
   fondo #F5F7F6 con texto #9BA5A2 tachado y no interactivo.
   En esta variante "18:00" y "19:00" están seleccionados.
7. Resumen en una caja con fondo #F5F7F6 y radio 12, tres filas de 14 px:
   "Sábado 9 de octubre", "18:00 – 20:00 (2 horas)", "Total $24.000" con esta
   última en 16 px semibold #171D1B.
8. Botón primario a ancho completo "Confirmar reserva", 52 px, fondo #00B86B,
   texto carbón #0D1211.
9. Nota de 13 px centrada en #55605D con ícono de candado: "No te cobramos nada
   hasta confirmar".
10. Botón fantasma a ancho completo "Reportar un problema" con ícono de bandera.

PIE DE PÁGENA
Fondo #0D1211 a sangre completa con el color lima de acento. Contiene, a la
izquierda, el logotipo del producto y la frase "Juega cerca de casa"; a la
derecha, tres columnas de enlaces: "Producto", "Empresa", "Ayuda", más una nota
de copyright de 13 px en blanco al 50%.

DETALLES
Solo dos botones verdes en toda la pantalla y ambos están en la tarjeta de
reserva. El resto son secundarios o fantasma. Ningún emoji, ninguna violeta,
ningún botón verde con texto blanco.
```

### P6 — Confirmación de reserva (modal)

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.
Genera el MODAL DE CONFIRMACIÓN DE RESERVA superpuesto sobre la pantalla de detalle
de cancha, en formato web desktop 1440 px. El fondo de la página debe verse
atenuado por un overlay negro al 56%.

MODAL
Ancho 480 px, centrado vertical y horizontalmente, radio 16, sombra
0 24px 48px rgba(13,18,17,0.12), fondo blanco, padding de 32 px.

CONTENIDO
1. Botón de cerrar "X" de 40 px en la esquina superior derecha, sin fondo, con
   ícono de 20 px #55605D.
2. Círculo de 64 px centrado con fondo #EAFBF3 e ícono de check de 32 px en
   #027A49.
3. Título "¡Reserva confirmada!" en Sora 24 px semibold, centrado.
4. Texto "Te enviamos la confirmación a juan.perez@correo.com" de 15 px #55605D,
   centrado.
5. Tarjeta interna con fondo #F5F7F6 y radio 12, con cuatro filas de 14 px
   separadas por líneas divisorias de 8 px:
   "Código" con "SC-4A7F2" en JetBrains Mono 14 px #171D1B,
   "Cancha" con "Cancha Fútbol 1",
   "Fecha y hora" con "Sábado 9 de octubre, 18:00 – 20:00",
   "Total pagado" con "$24.000" en 16 px semibold.
6. Botón primario a ancho completo "Ver mis reservas", 48 px, fondo #00B86B,
   texto carbón #0D1211.
7. Botón fantasma a ancho completo "Seguir explorando", 44 px, sin borde.
8. Alert inline de 13 px con fondo #FEF4E2, borde izquierdo 3 px ámbar #F5A524,
   ícono de reloj: "Puedes cancelar sin costo hasta 2 horas antes".

DETALLES
Este es el único elemento verde de la pantalla. El modal debe leerse con nitidez
sobre el fondo atenuado. Sin emojis, sin violetas.
```

### P7 — Mis reservas (móvil primero)

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla MIS RESERVAS en formato web mobile 390 px de ancho. Diseña primero
la versión móvil y con estos mismos elementos la adaptaré a escritorio.

LAYOUT
1. Barra superior de 64 px con flecha de retroceso, título "Mis reservas" en
   Sora 20 px semibold y a la derecha un ícono de filtro de 24 px.
2. Barra de pestañas de 44 px con tres pestañas: "Próximas" (activa, texto
   #171D1B peso 600 con indicador verde de 2 px), "Pasadas" y "Canceladas"
   (texto #55605D). La fila completa con borde inferior #EDF0EF.
3. Resumen de la pestaña activa: "2 reservas próximas" en 14 px #55605D.

LISTA DE TARJETAS
Dos tarjetas, y al final un botón de texto "Ver reservas pasadas" en 14 px
#027A49. Cada tarjeta es una tarjeta blanca con radio 16, borde #EDF0EF,
padding de 16 px, con esta estructura:
- Franja izquierda de 4 px de ancho y radio 999, de color verde #00B86B.
- Fila superior: bloque de fecha con fondo #EAFBF3, radio 12, 64 x 64 px,
  que muestra "SÁB" en 11 px mayúscula #027A49 y "09" en 24 px semibold
  #171D1B. A su lado, el nombre de la cancha en 17 px semibold
  "Cancha Fútbol 1" y debajo la ubicación en 13 px #55605D
  "Cra 45 # 12-30 · Zona Norte".
- A la derecha de esa fila, badge "Confirmada" en píldora de 24 px con fondo
  #EAFBF3 y texto #027A49.
- Línea de horario con ícono de reloj de 20 px: "18:00 – 20:00" en 14 px
  semibold #171D1B, y "2 horas" en 13 px #55605D.
- Línea inferior con dos datos separados: "Total $24.000" en 16 px semibold y
  "Código SC-4A7F2" en 13 px JetBrains Mono #6E7A77.
- Fila de acciones: un botón secundario "Ver detalle" y un botón fantasma con
  ícono de papelera y texto en #C93A3F "Cancelar".

LA SEGUNDA TARJETA
Idéntica pero con badge "Pendiente" (fondo #FEF4E2, texto #B45309), la franja
izquierda en ámbar, y el botón "Cancelar" reemplazado por "Confirmar pago".

4. Barra inferior fija de 68 px con 5 destinos: Explorar (búsqueda), Horario
   (calendario), Mis reservas (lista, activa con indicador superior verde),
   Perfil (persona) y Salir (puerta). Fondo blanco, borde superior #EDF0EF.

ESTADO VACÍO ADICIONAL
Debajo de la lista, muestra en gris al 45% de opacidad una variante del estado
vacío: círculo de 72 px con ícono de 40 px, título "No tienes reservas todavía",
mensaje "Cuando reserves una cancha, aparecerá aquí con todos los detalles" y
botón secundario "Explorar canchas".

DETALLES
Espaciado múltiplo de 4. Radios 16 en tarjetas, 12 en chips, 999 en badges y
franjas. Sin emojis, sin violetas, sin placeholders sustituyendo etiquetas.
```

### P8 — Perfil del cliente

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla MI PERFIL en formato web desktop 1440 px.

LAYOUT
Barra superior de 72 px igual al resto del producto, con "Perfil" activo en la
navegación. Contenido centrado en un contenedor de 880 px sobre fondo #FBFCFB.
Título de página "Mi perfil" en Sora 32 px semibold, con subtítulo de 15 px
#55605D "Actualiza tus datos y tus preferencias de reserva". A la derecha de esa
fila, un badge verde "Miembro desde marzo 2024".

TARJETA 1 — INFORMACIÓN PERSONAL (padding 24, radio 16)
- Fila superior: avatar de 96 px con radio 999 y borde de 3 px #00B86B, con un
  ícono de cámara en un círculo blanco de 32 px en la esquina inferior derecha.
  Junto al avatar, nombre "Juan Pérez" en 20 px semibold, correo
  "juan.perez@correo.com" en 14 px #55605D, y un botón secundario de 14 px
  "Cambiar foto".
- Divisor horizontal de 1 px #EDF0EF.
- Formulario en dos columnas:
  Columna izquierda: campo "Nombre" con valor "Juan"; campo "Apellido" con
  valor "Pérez"; campo "Correo electrónico" con ícono de sobre y valor
  "juan.perez@correo.com".
  Columna derecha: campo "Teléfono" con prefijo fijo "+57" y valor
  "300 123 4567", con ayuda de 13 px #55605D "Opcional. Te avisamos por aquí
  si cambia una reserva"; campo "Fecha de nacimiento" con ícono de calendario
  y valor "12/04/1996".
- Pie de la tarjeta alineado a la derecha: botón secundario "Cancelar" y botón
  primario "Guardar cambios".

TARJETA 2 — PREFERENCIAS DE RESERVA
Título H3 "Preferencias de reserva" y subtítulo 14 px "Usamos esto para
sugerirte canchas disponibles."
Fila de tres switches alineados a la derecha, cada uno con título 15 px y
descripción 13 px #55605D:
- "Recordatorios por correo" — activado (pista verde #00B86B, knob blanco).
- "Recordatorios por SMS" — desactivado (pista gris #CBD2D0).
- "Avisarme si se libera un horario" — activado.
Abajo, un select "Deporte favorito" con valor "Fútbol" y un select "Zona
preferida" con valor "Norte (Bogotá)".

TARJETA 3 — CAMBIAR CONTRASEÑA
Título H3 "Cambiar contraseña". Tres campos: "Contraseña actual",
"Nueva contraseña" con botón de ojo y texto de ayuda de 13 px "Mínimo 8
caracteres", y "Confirmar nueva contraseña". Al pie, botón primario
"Actualizar contraseña" de 14 px, no a ancho completo.

DETALLES
Solo hay tres botones verdes en toda la pantalla y los tres están al final de su
tarjeta. Todo el formulario es de 48 px de alto, radio 8, con etiqueta visible
de 12 px semibold encima. Sin emojis y sin violetas.
```

### P9 — Panel admin: clientes

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla ADMINISTRACIÓN DE CLIENTES en formato web desktop 1440 px.

LAYOUT
Barra superior de 72 px con el logotipo y, a la derecha, un selector de rol en
píldora con texto "Admin" sobre fondo #EAFBF3 y borde #A3ECC9.
Debajo, sidebar de 248 px a la izquierda con fondo blanco y borde derecho
#EDF0EF. Contiene un antetítulo "GESTIÓN" de 11 px mayúsculas #6E7A77 y cuatro
ítems con ícono de 20 px: "Resumen", "Clientes" (activo: fondo #EAFBF3, texto
#027A49, peso 600), "Canchas", "Reservas". Debajo, separado por un divisor, un
bloque "Perfil" con avatar de 36 px, "Laura Méndez" en 14 px semibold,
"Administradora" en 12 px #55605D, y un botón de cerrar sesión con ícono.
La barra inferior del sidebar muestra la versión del sistema "v1.0.0" en 12 px
#6E7A77.

ÁREA DE CONTENIDO (padding de 32 px, fondo #FBFCFB)
1. Cabecera en fila: a la izquierda el título "Clientes" en Sora 32 px semibold
   con el subtítulo "248 clientes registrados en total" de 15 px #55605D; a la
   derecha el botón primario con ícono de persona y "Nuevo cliente".
2. Fila de cuatro tarjetas de métrica, ancho igual, separación de 24 px:
   - "Total de clientes", "248", con delta verde "+12 este mes".
   - "Clientes activos", "231", con delta verde "+8 este mes".
   - "Cuentas inactivas", "17", con delta rojo "−2 este mes".
   - "Reservas este mes", "1.402", con delta verde "+18% vs. septiembre".
   Cada tarjeta: etiqueta de 11 px mayúscula #55605D, valor de 48 px en Inter
   con cifras tabulares en #171D1B, y delta de 14 px con
   ícono de flecha, verde #027A49 o rojo #C93A3F.
3. Barra de herramientas en una fila, fondo blanco, radio 12, borde #EDF0EF,
   padding de 12 px: campo de búsqueda de 280 px con ícono de lupa
   "Buscar por nombre o correo"; select "Estado" con valor "Todos"; select
   "Ordenar por" con valor "Más recientes"; un separador vertical; y un botón
   secundario con ícono de descarga "Exportar CSV". A la derecha, el texto
   "Mostrando 1–10 de 248" en 13 px #55605D.
4. Tabla de datos, fondo blanco, radio 12, borde #EDF0EF:
   - Cabecera de 44 px con fondo #F5F7F6 y texto de 12 px mayúsculas peso 700
     con tracking amplio en #55605D: columna de selección con checkbox, NOMBRE,
     CORREO, TELÉFONO, REGISTRO, RESERVAS, ESTADO, y una columna de acciones
     vacía a la derecha. El encabezado RESERVAS lleva un ícono de flecha de
     ordenación.
   - Diez filas de 56 px, separadas por líneas #EDF0EF, con:
     * Checkbox de 20 px; la primera marcado.
     * Avatar de 32 px con iniciales en fondo #EAFBF3 y texto #027A49, nombre
       en 14 px semibold y correo en 13 px #55605D bajo el nombre.
     * Teléfono en 14 px con cifras tabulares, formato "+57 300 123 4567".
     * Fecha de registro en 13 px #55605D, formato "12/04/2026".
     * Número de reservas en 14 px con cifras tabulares, alineado a la derecha.
     * Badge de estado: "Activo" (fondo #EAFBF3, texto #027A49) o "Inactivo"
       (fondo #F5F7F6, texto #55605D).
     * Dos iconos de acción de 20 px alineados a la derecha: un ícono de
       lápiz #55605D y un ícono de más o menos para activar o desactivar,
       en #C93A3F.
   - La segunda fila tiene fondo #F5F7F6 por estar seleccionada, y la barra
     superior de la tabla muestra, sobre fondo #EAFBF3, el texto
     "1 cliente seleccionado" en 14 px #027A49 con dos botones de texto:
     "Desactivar" y "Eliminar".
5. Paginación al pie, centrada: "Anterior", páginas 1 a 25 con la 1 activa en
   fondo #EAFBF3 y borde verde, y "Siguiente".

DETALLES
El único botón verde de la pantalla es "Nuevo cliente". La tabla es densa y
alineada: todas las cifras tabulares y todas las columnas de números alineadas
a la derecha. El ícono de la columna de acciones es de 20 px, gris por defecto
y rojo para acciones destructivas, siempre con tooltip. Sin emojis y sin violetas.
```

### P10 — Panel admin: resumen

```
Usa el tema "Sistema Canchas — Energía" y el estilo exacto de la hoja del sistema.

Crea la pantalla ADMINISTRACIÓN → RESUMEN en formato web desktop 1440 px.
Misma barra superior y mismo sidebar que la pantalla de clientes, con "Resumen"
activo en lugar de "Clientes".

ÁREA DE CONTENIDO
1. Cabecera: título "Resumen" en Sora 32 px semibold, subtítulo
   "Actividad de los últimos 30 días" de 15 px #55605D, y a la derecha un
   selector de período en píldora con el valor "Últimos 30 días" e ícono de
   calendario.
2. Fila de cuatro tarjetas de métrica idénticas en estructura a las de la
   pantalla de clientes, con estos datos: "Reservas totales" "1.402" con delta
   verde "+18%"; "Ocupación promedio" "68%" con delta verde "+4 pts";
   "Ingresos del mes" "$18.460.000" con delta verde "+12%";
   "Canchas activas" "24" con delta neutro "sin cambios".
3. Tarjeta ancha de gráfico (2/3 del ancho): título "Reservas por día" de 20 px
   semibold y subtítulo de 14 px #55605D "Últimos 30 días". Debajo, un gráfico
   de barras con ejes visibles: eje X con fechas "8 sep", "15 sep", "22 sep",
   "29 sep", "6 oct"; eje Y con 0, 50, 100, 150 y líneas de guía horizontales
   de 1 px #EDF0EF. Las barras en verde #00B86B, con los días de mayor demanda
   en un verde más oscuro #027A49, y un tooltip de ejemplo sobre la barra más
   alta con "52 reservas · 6 oct".
4. Tarjeta estrecha a la derecha (1/3 del ancho): título "Deportes más
   reservados". Lista de cinco filas con un punto de color de 8 px, el nombre
   del deporte, una barra de progreso horizontal que ocupa el ancho restante y
   el porcentaje al final: "Fútbol" 42% en #00B86B, "Vóley" 24% en #2563EB,
   "Básquet" 16% en #F5A524, "Tenis" 11% en #8B5CF6, "Padel" 7% en #14B8A6.
   Las barras tienen 6 px de alto y radio 999 px sobre una pista de fondo
   #EDF0EF.
5. Fila inferior de dos tarjetas: a la izquierda "Próximas reservas" con una
   lista de cinco filas de 64 px con avatar, nombre del cliente, cancha, fecha y
   badge de estado; a la derecha "Actividad reciente" con cinco filas de marca
   de tiempo relativa: "hace 4 min", "hace 22 min", "hace 1 h", "hace 3 h",
   "ayer", con un ícono de 20 px por tipo de acción y un texto de 14 px como
   "Laura Méndez desactivó la cuenta de Carlos Rivas".

DETALLES
Los gráficos son planos, sin degradados ni sombras, con ejes y guías sutiles.
Ningún botón verde en la pantalla. Sin emojis y sin violetas.
```

---

## 4. Prompts de iteración, variantes y estados

Añádelos como mensajes de seguimiento **en la misma conversación** donde generaste la
pantalla, para que Stitch mantenga el contexto.

### 4.1 Fijar el estilo y corregir desvíos

Si Stitch se desvía del sistema, este es el mensaje de corrección más efficace:

```
Detén la generación. Revisa lo que generaste y corrige SOLO estas desviaciones,
sin cambiar el layout ni el contenido:

1. El botón principal debe tener fondo verde #00B86B con texto carbón #0D1211.
   Si tiene texto blanco, ese es un error de contraste: 2.6:1.
2. Ningún elemento violeta o morado. Si aparece, reemplázalo por el verde del
   sistema.
3. Los radios deben ser: 8 px en inputs y chips de horario, 12 px en botones,
   16 px en tarjetas y modales, 999 px en badges y píldoras.
4. Las sombras deben tener tinte verde rgba(13,18,17,...) y ser suaves. Nada de
   sombras negras fuertes ni de difuminado grande.
5. Los iconos deben ser del set Material Symbols Rounded, trazo de 1.5 px.
   Si hay emojis, reemplázalos por iconos.
6. Las etiquetas de los campos de formulario deben estar siempre visibles encima
   del campo. Si solo hay texto de ejemplo dentro, añádela.
7. Reemplaza cualquier dato de relleno por datos reales del dominio: canchas,
   deportes (Fútbol, Vóley, Básquet, Tenis, Padel), zonas y horas en formato
   24 h.
8. No inventes degradados de fondo ni formas decorativas curvas de gran tamaño.
```

### 4.2 Versión móvil

```
Genera la versión móvil de esta pantalla en 390 px de ancho. Mantén exactamente los
mismos colores, tipografías, radios y componentes; solo cambia la disposición:

- Muestra solo lo esencial: el contenido principal y una sola acción primaria.
- Los filtros, acciones secundarias y menús se mueven a una barra inferior fija
  de 68 px con iconos de 24 px y etiquetas de 11 px, o a un botón que abre un
  drawer desde abajo con esquinas superiores de 28 px.
- Las tablas pasan a tarjetas apiladas: etiqueta de 12 px mayúscula en gris y
  valor de 15 px debajo.
- Las rejillas de 3 o 4 columnas pasan a 1 o 2 columnas.
- Los botones de acción se vuelven de ancho completo.
- Mantén el margen lateral de 16 px y targets táctiles de 44 px mínimo.
```

### 4.3 Versión escritorio → responsive

```
Mantén el diseño actual y muéstrame el mismo frame en tres anchos: 390 px, 768 px
y 1440 px, en columnas lado a lado. En 768 px el sidebar colapsa en un ícono de
menú y la tabla pasa a dos columnas de tarjetas. Conserva colores, tipografías,
radios y sombras idénticos en los tres anchos.
```

### 4.4 Modo oscuro

```
Genera la variante en modo oscuro de esta pantalla. No inventes una paleta nueva:
es una inversión controlada.

- Fondo de página #0D1211, tarjetas #171D1B, elementos elevados #262D2B.
- Texto principal #F5F7F6, secundario #9BA5A2, apagado #6E7A77.
- Bordes #262D2B y #3B4442.
- El botón primario pasa a fondo #3FC98C con texto #0D1211.
- Verde de marca para texto y enlaces: #6FDCAC.
- El acento lima #C8EE4B se mantiene y ahora puede usarse también sobre el verde.
- Doble la opacidad de las sombras respecto al modo claro.
- El logotipo no se invierte: se mantiene igual en claro y en oscuro.

Los badges de estado usan fondo #262D2B con texto de su color claro: éxito
#6FDCAC, error #FF8A8E, advertencia #FFC44D, información #8AB4FF.
```

### 4.5 Estados de pantalla

```
Genera tres variantes de esta misma pantalla, en el mismo estilo:

A) ESTADO VACÍO — sustituye el contenido principal por un estado vacío
   centrado con un ícono de 40 px #CBD2D0 dentro de un círculo de 72 px con
   fondo #EDF0EF, título en Sora 20 px semibold, mensaje de 15 px #55605D y un
   botón secundario con la acción que corresponde. La navegación, la barra de
   búsqueda y los filtros se mantienen visibles.

B) CARGANDO — sustituye el contenido por esqueletos de carga que respeten
   exactamente la geometría de los componentes reales: un rectángulo gris
   #EDF0EF por cada bloque, con un degradado animado al 50% en #E1E6E4, y las
   mismas esquinas redondeadas. Nada de spinners a pantalla completa.

C) ERROR — sustituye el contenido por un estado de error: un círculo de 72 px
   con fondo #FDECEC e ícono de alerta en #C93A3F, título "No pudimos cargar
   la información" en Sora 20 px semibold, el mensaje de error concreto del
   servidor en una caja con fondo #F5F7F6 y fuente mono 13 px, y dos acciones:
   un botón primario "Reintentar" y un enlace de texto "Reportar el problema".
```

### 4.6 Microinteracción y estados de control

```
Genera la misma tarjeta de cancha en cuatro estados de interacción, en fila, con
las etiquetas debajo: REPOSO, HOVER, FOCUS Y CARGANDO.

- Reposo: sombra 0 1px 3px rgba(13,18,17,0.08).
- Hover: elevada 2 px y sombra 0 12px 28px rgba(13,18,17,0.10), el botón
  secundario pasa a fondo #F5F7F6.
- Foco: un halo verde de 3 px al 30% alrededor de la tarjeta.
- Cargando: el botón "Ver horarios" muestra un spinner de 20 px y el texto
  atenuado al 50%, manteniendo exactamente el mismo ancho que el botón en
  reposo para que la tarjeta no salte.

Muestra también el campo de texto en cuatro estados: reposo, foco con halo
verde, error con borde #E5484D, halo rojo y mensaje debajo, y deshabilitado con
fondo #F5F7F6.
```

### 4.7 Recuperar una pantalla mala

```
Esta pantalla no cumple. Vuelve a generarla desde cero aplicando todo lo siguiente:

1. Reutiliza el tema "Sistema Canchas — Energía": verde #00B86B, carbón #0D1211,
   tipografías Sora + Inter, radios de la escala del sistema y sombras con tinte
   verde. No interpretes el tema de otra manera.
2. Estructura de tres zonas explícita, de arriba hacia abajo, con alturas
   concretas: barra superior de 72 px, franja de filtros de 88 px, contenido.
3. Rejilla de 3 columnas iguales con 24 px de separación, alineadas arriba y con
   alturas iguales.
4. Un único botón verde por pantalla; todo lo demás secundario o fantasma.
5. Escribe textos reales y en español: nada de "Lorem ipsum", nada de
   "Texto de ejemplo", nada de "Título aquí".
6. Incluye el estado vacío, el de carga y el de error al final, en fila, con la
   etiqueta de cuál es cuál.
7. Iconos del set Material Symbols Rounded, sin emojis.
```

---

## 5. Datos de relleno para que Stitch no invente

Pega este bloque en cualquier prompt que necesite contenido, para fijarle el
vocabulario del dominio:

```
DATOS REALES DEL DOMINIO — usa estos, no inventes otros:

Canchas: "Cancha Fútbol 1", "Cancha Fútbol 2", "Cancha Vóley Norte",
"Complejo El Olivar", "Polideportivo La 74", "Cancha Tenis Club 3",
"Complejo Riverside", "Cancha Básquet Sur".

Zonas: "Zona Norte", "Zona Sur", "Zona Este", "Zona Oeste", "Centro".

Direcciones: "Cra 45 # 12-30", "Calle 100 # 8-45", "Av. 6 # 72-18",
"Diag 18 # 5-20".

Deportes: Fútbol, Vóley, Básquet, Tenis, Padel.
Superficies: "Césped sintético", "Pista de bastantes", "Arcilla", "Concreto pulido".

Clientes: "Juan Pérez", "Laura Méndez", "Carlos Rivas", "Ana Sofía Gómez",
"Diego Torres", "Valentina Cruz".

Estados de reserva: Confirmada, Pendiente, Completada, Cancelada, Rechazada.

Horarios en formato 24 h con guion largo: "06:00", "18:00 – 20:00".
Precios: "$12.000 / hora", "$18.500 / hora", "$24.000 / hora".
Códigos de reserva en formato SC-XXXXX: "SC-4A7F2", "SC-9B31D".

Colores por deporte: Fútbol #00B86B, Vóley #2563EB, Básquet #F5A524,
Tenis #8B5CF6, Padel #14B8A6.
```

---

## 6. Prompts negativos (cola)

Añade al final de cualquier prompt si Stitch insiste en un error:

```
NO INCLUYAS, bajo ninguna circunstancia:
- Violeta, morado, fucsia ni degradados de esos tonos.
- Botones verdes con texto blanco.
- Emoji como iconos de interfaz.
- Texto de ejemplo tipo "Lorem ipsum", "Texto aquí" o "Título de la sección".
- Más de un botón primario verde por pantalla.
- Campos de formulario que solo tengan texto de ejemplo y sin etiqueta visible.
- Sombras negras puras, difuminadas o muy fuertes.
- Bordes punteados, esquinas mezcladas o esquinas muy redondeadas en todo.
- Iconos de distintos estilos mezclados, o iconos dibujados a mano.
- Ilustraciones 3D genéricas, gráficos con degradados o gauges tipo velocímetro.
- Tablas con contenido que no quepa, texto cortado o columnas desalineadas.
- Texto sobre fotografía sin una capa oscura que lo vuelva legible.
```

---

## 7. Orden de ejecución y entregables

| # | Prompt | Frame resultante | Prioridad |
|---|---|---|---|
| 1 | §1 Prompt maestro | Base de estilo | Crítico |
| 2 | §2 Hoja del sistema | Biblioteca de componentes | Crítico |
| 3 | P1 Iniciar sesión | Autenticación | Alta |
| 4 | P2 Registro (2 pasos) | Autenticación | Alta |
| 5 | P3 Recuperar contraseña | Autenticación | Media |
| 6 | P4 Catálogo de canchas | Producto | Crítico |
| 7 | P5 Detalle y horario | Producto | Crítico |
| 8 | P6 Confirmación | Producto | Alta |
| 9 | P7 Mis reservas (móvil) | Producto | Alta |
| 10 | P8 Perfil | Producto | Media |
| 11 | P9 Admin clientes | Admin | Alta |
| 12 | P10 Admin resumen | Admin | Media |
| 13 | §4.5 Estados | States pack | Media |
| 14 | §4.4 Modo oscuro | Variante | Baja |

### Entregables a preservar

- **Modo Standard** → exporta a Figma. Nombrar cada frame con su código:
  `SC-P1-Login`, `SC-P4-Catalogo`, etc.
- **Modo no-code** → obtén el código, y sustituye cualquier hex literal por el token
  correspondiente de [`tokens.css`](../../FrontEnd-App-ingWeb/src/styles/tokens.css).
- Guarda capturas de la **hoja del sistema** como referencia para futuras sesiones de
  Stitch: es la forma más barata de mantener la coherencia.

---

## 8. Verificación posterior

Antes de dar por buena una pantalla, contrástala contra
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) §9 (checklist) y corrige con §4.1.

Los cinco errores que más se repiten en Stitch, en orden de frecuencia:

1. **Botón verde con texto blanco** → corregir a `#00B86B` / `#0D1211`.
2. **Aparece violeta o morado** → es el residuo del template de Vite; sustituir por
   verde o neutro.
3. **Emojis como iconos** → sustituir por Material Symbols Rounded.
4. **Radios aleatorios** → forzar la escala 8 / 12 / 16 / 28 / 999.
5. **Campos sin etiqueta** → añadir etiqueta de 12 px semibold encima.
