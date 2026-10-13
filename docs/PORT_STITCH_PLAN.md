# Plan de Integración — Páginas Stitch → Frontend + Backend

**Versión:** 1.4  
**Fecha:** 2026-10-13  
**Estado:** FASES 0–4 completadas — FASE 5 en cola

---

## Contexto actual

| Pantalla Stitch | Estado | Backend necesario |
|---|---|---|
| `explorar_canchas` | ✅ Portada (React + tokens) | `GET /api/canchas` (propuesto) |
| `detalle_y_reserva_de_cancha` | ✅ Portada (React + tokens, FASE 2) | `GET /api/canchas/:id`, `POST /api/reservas` (propuestos) |
| `mis_reservas` | ✅ Portada (React + tokens, FASE 3) | `GET /api/reservas?cliente=:id` (propuesto) |
| `panel_de_control_admin` | ✅ Portada (React + tokens, FASE 4) | `GET /api/clientes` (real), `GET /api/canchas`, `GET /api/reservas` |
| `login` / `registro` / `recuperar` / `perfil` / `admin-resumen` | ❌ No generadas | Auth + Cliente (real) |

**Backend real hoy:** solo `GET /api/clientes` (y Auth expone password en claro — ver `docs/design/DESIGN_SYSTEM.md §6`).  
**Contratos propuestos:** `Cancha`, `Reserva`, `Disponibilidad` en `DESIGN_SYSTEM.md §6`.

---

## Principios de integración

1. **Un componente = una responsabilidad.** Nada de lógica de negocio en la vista.
2. **Tokens primero.** Nada de hex en componentes ni páginas; todo pasa por `src/styles/tokens.css`.
3. **Iconos = Material Symbols Rounded.** Stitch usó Outlined; se corrige al portar.
4. **Contraste verificado.** Botón primario `#00B86B` + texto `#0D1211` (7.3:1). Nunca blanco sobre verde.
5. **Datos tipados.** Contratos TypeScript/JSDoc que coincidan con `DESIGN_SYSTEM.md §6`.
6. **Mock → API sin cambiar la vista.** La página consume un hook (`useCanchas`, `useReservas`); el hook decide si llama a mock o a fetch real.
7. **Estado del proyecto actualizado** al final de cada fase (checklist + build + lint + tests SSR).

---

## Estructura de carpetas (respetada y extendida)

```
FrontEnd-App-ingWeb/
├── src/
│   ├── api/                    # Cliente HTTP + endpoints tipados
│   │   ├── client.js           # fetch wrapper con baseURL, interceptores
│   │   ├── canchas.js          # GET /canchas, GET /canchas/:id, GET /canchas/:id/disponibilidad
│   │   ├── reservas.js         # GET /reservas, POST /reservas, DELETE /reservas/:id
│   │   ├── clientes.js         # GET /clientes (ya existe en backend)
│   │   └── auth.js             # POST /login, POST /register, POST /recover
│   ├── components/
│   │   ├── ui/                 # Primitivas (Button, Input, Card, Modal, etc.) — YA EXISTEN
│   │   ├── canchas/            # Componentes de dominio cancha (FASE 2)
│   │   │   ├── GaleriaCancha.jsx
│   │   │   ├── CanchaDetail.jsx
│   │   │   ├── TarjetaReserva.jsx
│   │   │   ├── ReservaModal.jsx
│   │   │   └── index.js
│   │   │   # CanchaCard y SlotGrid viven en components/ui/ (FASE 1)
│   │   ├── reservas/           # Componentes de dominio reserva (FASE 3)
│   │   │   ├── ReservaList.jsx
│   │   │   ├── ReservaCard.jsx
│   │   │   ├── ReservaActions.jsx
│   │   │   ├── CancelarReservaModal.jsx
│   │   │   ├── CalificarReservaModal.jsx
│   │   │   └── index.js
│   │   ├── admin/              # Componentes de dominio admin (FASE 4)
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── ClienteTable.jsx
│   │   │   ├── ClienteDetalleModal.jsx
│   │   │   ├── CanchaAdminTable.jsx
│   │   │   ├── CanchaForm.jsx
│   │   │   ├── ReservaAdminTable.jsx
│   │   │   ├── ReservaManualModal.jsx
│   │   │   ├── ConfirmarModal.jsx
│   │   │   └── index.js
│   │   └── layout/             # Header, Footer, Sidebar, PageShell
│   ├── hooks/
│   │   ├── useApi.js
│   │   ├── useCanchaDetail.js
│   │   ├── useDisponibilidad.js
│   │   ├── useCanchas.js             # pendiente: migrar ExplorarCanchas
│   │   ├── useReservas.js            # ✅ FASE 3
│   │   ├── useClientes.js            # ✅ FASE 4
│   │   ├── useCanchasAdmin.js        # ✅ FASE 4
│   │   ├── useReservasAdmin.js       # ✅ FASE 4
│   │   ├── useAuth.js                # 🔄 FASE 5
│   │   └── useDebounce.js
│   ├── lib/
│   │   ├── mockData.js         # Datos de desarrollo (actualizados con Stitch)
│   │   ├── filtroCanchas.js    # Lógica pura de filtrado (ya existe)
│   │   ├── cx.js               # Utilidades (ya existe)
│   │   ├── deportes.js         # Catálogo de deportes (ya existe)
│   │   ├── format.js           # Moneda, fecha, hora (nuevo)
│   │   ├── filtroReservas.js   # Lógica pura de grupos/filtros de reservas (FASE 3)
│   │   ├── comprobante.js      # Exportación a CSV de comprobantes (FASE 3)
│   │   ├── metricasAdmin.js    # Métricas puras del panel admin (FASE 4)
│   │   ├── orden.js            # Comparación para ordenar tablas (FASE 4)
│   │   ├── exportar.js         # CSV genérico + descarga (FASE 4)
│   │   ├── exportarTablas.js   # CSV de clientes y reservas del panel (FASE 4)
│   │   ├── rutas.js            # Hash routing (ya existe)
│   │   └── validators.js       # Validaciones de formulario
│   ├── pages/
│   │   ├── ExplorarCanchas.jsx       # ✅ YA PORTADA
│   │   ├── ExplorarCanchas.css
│   │   ├── DetalleCancha.jsx         # ✅ FASE 2
│   │   ├── DetalleCancha.css
│   │   ├── MisReservas.jsx           # ✅ FASE 3
│   │   ├── MisReservas.css
│   │   ├── PanelAdmin.jsx            # ✅ FASE 4
│   │   ├── PanelAdmin.css
│   │   ├── Login.jsx                 # 🔄 FASE 5
│   │   ├── Registro.jsx
│   │   ├── RecuperarClave.jsx
│   │   ├── Perfil.jsx
│   │   ├── AdminResumen.jsx
│   │   ├── StyleGuide.jsx            # Validador visual
│   │   └── StyleGuide.css
│   ├── styles/
│   │   ├── tokens.css          # Fuente de verdad (201 tokens)
│   │   ├── base.css
│   │   ├── components.css      # Clases .c-* de todos los componentes
│   │   └── pages/              # CSS por página (ExplorarCanchas.css, etc.)
│   ├── store/                  # Estado global (cuando haga falta)
│   ├── App.jsx                 # Enrutado por hash
│   ├── main.jsx
│   └── index.css
├── docs/
│   ├── design/
│   │   ├── DESIGN_SYSTEM.md
│   │   ├── STITCH_PROMPTS.md
│   │   └── stitch-theme.json
│   └── PORT_STITCH_PLAN.md     # Este archivo
└── stitch_design_system_generator/
    └── (exports originales — solo lectura)
```

---

## Fases

### FASE 0 — Cimentación (1 día)

**Objetivo:** Infraestructura para que las siguientes fases no se tropiecen.

| Tarea | Archivos | Done |
|---|---|---|
| Cliente HTTP tipado (`api/client.js`) | `src/api/client.js` | ✅ |
| Endpoints Cancha (mock + types) | `src/api/canchas.js` | ✅ |
| Endpoints Reserva (mock + types) | `src/api/reservas.js` | ✅ |
| Endpoints Cliente (real, con `password` depurado) | `src/api/clientes.js` | ✅ |
| Endpoints Auth (mock + types) | `src/api/auth.js` | ✅ |
| Contratos JSDoc `Cancha`, `Reserva`, `Disponibilidad`, `Cliente` | `src/api/types.js` | ✅ |
| Hook genérico `useApi` (loading/error/data + mock toggle) | `src/hooks/useApi.js` | ✅ |
| Utilidades de formato (COP, hora 24h, código `SC-XXXXX`) | `src/lib/format.js` | ✅ |
| Variables de entorno `.env` (`VITE_API_BASE`, `VITE_AUTH_BASE`, `VITE_USE_MOCK`) | `.env`, `.env.example` | ✅ |
| **Verificación:** build + lint + test SSR de hooks puros | `.check/verificar.mjs` | ✅ (57 checks) |

**Criterio de salida:** `npm run build` ✅, `eslint` ✅, hooks testeables sin DOM.

---

### FASE 1 — Catálogo de Canchas (YA HECHO — validar y congelar)

**Objetivo:** Confirmar que `ExplorarCanchas` es la base sólida.

| Tarea | Estado |
|---|---|
| Página + CSS portados desde Stitch | ✅ |
| Filtros puros (`filtrarCanchas`, `normalizar`) con tests | ✅ |
| `CanchaCard` con anatomía Stitch (tags, rating, CTA primario) | ✅ |
| Datos `CANCHAS` con 6 entradas reales de Stitch | ✅ |
| Enrutado `#/` → catálogo | ✅ |
| **Verificación completa** (41 checks SSR) | ✅ |

**Pendiente menor:** Revisar en navegador el "muro de 6 botones verdes" y decidir si se pasa a secundario.

---

### FASE 2 — Detalle de Cancha + Reserva (3–4 días) — ✅ COMPLETADA

**Pantallas Stitch:** `detalle_y_reserva_de_cancha/code.html` + `screen.png`

#### 2.1 Componentes de dominio `canchas/`

| Componente | Responsabilidad | Props clave |
|---|---|---|
| `CanchaDetail` | Columna de ficha: galería, título, valoración, dirección, características, descripción, sede | `cancha` |
| `GaleriaCancha` | Galería con miniaturas (`<button>`, `aria-pressed`), teclado accesible | `imagenes[]`, `nombre`, `deporteLabel`, `dot` |
| `TarjetaReserva` | Columna de reserva: precio, selector de 7 días, `SlotGrid`, desglose, CTA | `cancha`, `dias`, `dia`, `onDia`, `slots`, `seleccion`, `onSeleccion`, `onReservar` |
| `ReservaModal` | Confirmación: resumen, precio total, formulario de contacto | `open`, `canchaNombre`, `dia`, `rango`, `horas`, `total`, `onConfirm`, `onCancel` |
| `SlotGrid` / `SlotLegend` | Ya existen en `components/ui/` — rangos contiguos, selección múltiple | `slots`, `value`, `onChange`, `cols` |

> **Desviación respecto al boceto:** el detalle se partió en `CanchaDetail` (ficha) + `TarjetaReserva` (reserva) en vez de un único `CanchaDetail` con la acción dentro — una responsabilidad por componente (§Principio 1). `CanchaCard` y `SlotGrid` se quedaron en `components/ui/` tal como los dejó la FASE 1; moverlos habría tocado trabajo ya validado. Los nuevos viven en `components/canchas/`.

#### 2.2 Página `DetalleCancha`

- URL: `#/cancha/:id` (parámetro resuelto en `lib/rutas.js`, que ahora empareja patrones con `:nombre`)
- Usa `useCanchaDetail(id)` + `useDisponibilidad(id, fecha)` → `api/canchas.js` (mock hoy, real mañana)
- Estados: loading (Skeleton), error (`EmptyState` + reintentar), éxito (reserva confirmada con código `SC-XXXXX`)
- Integra `GaleriaCancha`, `CanchaDetail`, `TarjetaReserva` y `ReservaModal`
- El catálogo (`ExplorarCanchas`) abre el detalle desde su CTA `onReservar`; no se tocó su interior

#### 2.3 Hooks

```js
export function useCanchaDetail(id) {
  return useApi(() => getCancha(id), { mock: USE_MOCK, mockData: semilla, deps: [id] })
}

export function useDisponibilidad(canchaId, fecha) {
  return useApi(() => getDisponibilidad(canchaId, { fecha }), { mock: USE_MOCK, mockData: seed, deps: [canchaId, fecha] })
}
```

`useDisponibilidad` se separó de `useCanchaDetail` para que cambiar de día no vuelva a pedir la ficha completa.

#### 2.4 CSS

- `DetalleCancha.css` (layout `.dc__*`) + bloque nuevo en `styles/components.css` (`.c-galeria`, `.c-detalle`, `.c-reserva`, `.c-day`, `.c-resumen`). Nada de hex.

#### Verificación fase 2

- [x] SSR render sin `undefined`/`NaN` (93 checks en total, 36 nuevos)
- [x] `SlotGrid` selecciona rangos contiguos (heredado de FASE 1)
- [x] `ReservaModal` reutiliza `Modal` (foco atrapado, Escape, retorno ya cubiertos)
- [x] Precio total = `precioHora * slots.length` formateado COP
- [x] Contratos `Cancha` + `CanchaDetalle` + `Disponibilidad` respetados
- [x] Build + lint + 0 hex fuera de tokens


---

### FASE 3 — Mis Reservas (2–3 días)

**Pantalla Stitch:** `mis_reservas/code.html` + `screen.png`

#### 3.1 Componentes `reservas/`

| Componente | Responsabilidad |
|---|---|
| `ReservaList` | Lista responsive con estados (próxima, pasada, cancelada) |
| `ReservaCard` | Tarjeta individual: fecha en bloque, cancha, hora, estado, total y acciones |
| `ReservaActions` | Botones: ver detalle, cancelar (si >24h), calificar (si pasada) |
| `CancelarReservaModal` | Confirmación con devolución estimada y resumen del turno |
| `CalificarReservaModal` | Estrellas (1–5) + comentario opcional |

#### 3.2 Página `MisReservas`

- URL: `#/mis-reservas` (requiere auth — fase 5)
- Hook `useReservas({ clienteId, estado })`
- Pestañas: **Próximas · Pasadas · Canceladas · Todas** (arranca en Próximas) con contador
- Filtro por deporte (chips)
- Paginación (se oculta si hay una sola página)
- `EmptyState` por pestaña; distinto si el vacío es por el filtro de deporte
- Exportación de comprobantes a CSV (`lib/comprobante.js`)
- `clienteId` sale de `USUARIO_DEMO` hasta que exista `useAuth` (fase 5)

#### 3.3 Hook `useReservas`

```js
export function useReservas({ clienteId, estado } = {}) {
  const definido = clienteId !== undefined && clienteId !== null
  // Semilla en modo mock: pinta de inmediato y sigue pidiendo, para que
  // `refetch()` refleje cambios (por ejemplo, tras cancelar).
  const semilla = useMemo(() => (USE_MOCK && definido ? RESERVAS.filter(...) : undefined), [...])
  return useApi(() => api.reservas.list({ clienteId, estado }), {
    enabled: definido,
    mockData: semilla,
  })
}
```

> **Desviaciones del diseño de Stitch, conscientes:** la política de cancelación
> es de **24 h** (como el detalle de cancha y `puedeCancelar`), no de 6 h; no se
> portan "Invitar amigos" (necesita compartir) ni "Escribir por WhatsApp"
> (canal de soporte inexistente). El resto del aside (política, atención, CTA)
> sí se conserva.

#### Verificación fase 3

- [x] SSR render de lista vacía y con 3+ reservas
- [x] Filtro por estado y por deporte funciona
- [x] Acción "cancelar" abre modal de confirmación (con devolución)
- [x] Formato fecha `DD/MM/YYYY`, hora `HH:MM – HH:MM`, precio COP
- [x] Código reserva `SC-XXXXX` visible
- [x] Build + lint + 0 hex + CSS válido (165 checks en total, 72 nuevos)

---

### FASE 4 — Panel de Control Admin (3–4 días) — ✅ COMPLETADA

**Pantalla Stitch:** `panel_de_control_admin/code.html` + `screen.png`

#### 4.1 Componentes `admin/`

| Componente | Responsabilidad |
|---|---|
| `AdminSidebar` | Navegación: Resumen / Clientes / Canchas / Reservas + cuenta por sección |
| `StatsCards` | 4 tarjetas: clientes, canchas, reservas del mes, ingresos del mes (con delta mes a mes) |
| `ClienteTable` | `DataTable` + columnas: código, cliente (avatar + correo), teléfono, registro, estado, acciones; búsqueda, filtro por estado, paginación, selección + CSV, ficha |
| `ClienteDetalleModal` | Ficha de solo lectura + salto a las reservas del cliente |
| `CanchaAdminTable` | CRUD de canchas: ver en catálogo, editar y borrar; búsqueda + filtros por deporte y estado |
| `CanchaForm` | Modal de alta/edición con validación (nombre, deporte, zona, sede, precio, estado) |
| `ReservaAdminTable` | Vista global de reservas: filtros, paginación, selección + confirmar/cancelar en bloque, CSV |
| `ReservaManualModal` | Alta manual de un turno (cliente, cancha, fecha, horario; total calculado) |
| `ConfirmarModal` | Confirmación genérica de acciones irreversibles (borrado de cancha) |

#### 4.2 Página `PanelAdmin`

- URL: `#/admin` (requiere rol admin — fase 5)
- Layout: sidebar fija (248 px, banda horizontal <1024 px) + topbar (72 px) + contenido
- Secciones: **Resumen · Clientes · Canchas · Reservas** (estado local, sin recargar)

#### 4.3 Hooks `useClientes`, `useCanchasAdmin`, `useReservasAdmin`

Todos sobre `api/clientes.js`, `api/canchas.js`, `api/reservas.js`, con semilla de
mock para SSR. `api/canchas.js` pasa a ser **con estado** (crear/editar/borrar
mueven una copia en memoria); `api/reservas.js` gana `actualizarEstado(id, estado)`.

#### 4.4 Primitivas nuevas en `ui/`

- `DataTable` gana ordenación real (`col.sortable`, `col.sorter`), paginación
  (`pageSize`) y modo apilado (`stack`, `data-label` <1024 px).
- `Paginador` — navegación de páginas de tabla, controlada.

#### Verificación fase 4

- [x] ClienteTable: paginación, ordenación, selección múltiple y barra masiva
- [x] StatsCards consumen datos (mock) con delta mes vs mes y formato COP
- [x] CanchaAdminTable: modal crear/editar con validación + borrado confirmado
- [x] ReservaAdminTable: filtros, paginación, confirmar/cancelar en bloque y CSV
- [x] Sin colores violeta, iconos Rounded, 0 hex fuera de `tokens.css`
- [x] Build + lint + CSS válido (lightningcss) + 251 checks SSR/en vivo

---

### FASE 5 — Autenticación y Perfil (3–4 días)

**Pantallas Stitch:** *No generadas — crear desde cero siguiendo el sistema*

#### 5.1 Páginas

| Página | URL | Componentes clave |
|---|---|---|
| `Login` | `#/login` | `LoginForm`, `AuthLayout` |
| `Registro` | `#/registro` | `RegistroForm` (campos Cliente reales) |
| `RecuperarClave` | `#/recuperar` | `RecuperarForm` |
| `Perfil` | `#/perfil` | `PerfilForm` (editable), `MisReservas` embebido |

#### 5.2 Auth real

- `api/auth.js` → endpoints reales cuando existan
- `useAuth()` hook: `user`, `login()`, `logout()`, `register()`, `recover()`
- Guard en `App.jsx`: rutas protegidas redirigen a `#/login`
- Rol `admin` → acceso a `#/admin`

#### 5.3 Formularios con `Field` + validación

- Email, teléfono colombiano, contraseña (min 8, 1 mayús, 1 número)
- Validación en blur + submit
- Mensajes de error con `Alert` tono `error`

#### Verificación fase 5

- [ ] Login/Registro/Recuperar renderizan sin error SSR
- [ ] Validación muestra errores inline
- [ ] Flujo login → redirige a `#/` o `#/admin` según rol
- [ ] Perfil edita nombre/teléfono, guarda (mock o real)
- [ ] Build + lint

---

### FASE 6 — Admin Resumen + Pulido (2 días)

**Pantalla Stitch:** *No generada*

#### 6.1 `AdminResumen`

- Dashboard con métricas: ocupación por cancha, ingresos semanales, top clientes
- Gráficos simples (SVG o CSS — sin dependencias pesadas)
- Exportación CSV de reservas

#### 6.2 Limpieza transversal

- [ ] Revisar todas las páginas: 0 hex fuera de `tokens.css`
- [ ] Revisar contraste en todos los botones/texto
- [ ] Iconos 100% Rounded
- [ ] Radios en escala 8/12/16/28/999
- [ ] Campos con etiqueta visible (nunca solo placeholder)
- [ ] Formato hora 24h, precios COP, códigos `SC-XXXXX`
- [ ] Mobile-first verificado en breakpoints (4/8/12 cols)

#### 6.3 Documentación final

- `README.md` con scripts, variables, arquitectura
- `CHANGELOG.md` generado desde commits

---

## Entregables por fase (actualización de estado)

Al cerrar cada fase, **actualizo este archivo** marcando ☐ → ✅ y añado:

```markdown
## Estado tras Fase N — YYYY-MM-DD

### Completado
- [lista de tareas con ✅]

### Bloqueantes / Decisiones
- [qué se decidió, qué quedó pendiente]

### Métricas
- Build: X kB CSS / Y kB JS (gzip: A / B)
- Lint: 0 errores
- Tests SSR: N/N OK
- Hex fuera de tokens: 0
- Violeta detectado: 0
```

---

## Estado tras Fase 0 — 2026-10-12

### Completado
- ✅ `src/api/client.js` — wrapper de `fetch` con bases por servicio, `ApiError` con copy en tuteo y `USE_MOCK` por entorno.
- ✅ `src/api/canchas.js` — `getCanchas` / `getCancha` / `getDisponibilidad`, con mock y `criteriosAQuery` listo para el endpoint real.
- ✅ `src/api/reservas.js` — `list` / `getReserva` / `crear` / `cancelar`; el mock es **con estado** (crear y cancelar se reflejan en el siguiente `list`).
- ✅ `src/api/clientes.js` — endpoints reales de user-service; `sinPassword()` depura el campo antes de que salga del módulo.
- ✅ `src/api/auth.js` — `login` / `register` / `recover` + persistencia de sesión segura sin DOM (`SESION_KEY`).
- ✅ `src/api/types.js` — contratos JSDoc (`Cancha`, `Slot`, `Disponibilidad`, `Reserva`, `Cliente`, `Sesion`) y guardas `esCancha` / `esReserva` / `esEstadoReserva`.
- ✅ `src/hooks/useApi.js` — `data` / `loading` / `error` / `refetch`, cancelación con `AbortController` y siembra de mock para SSR.
- ✅ `src/lib/format.js` — moneda COP, hora 24 h, rango `18:00 – 19:00`, `horaFin`, fecha `DD/MM/YYYY` y larga, código `SC-XXXXX`.
- ✅ `src/lib/mockData.js` — 5 `RESERVAS` (confirmada / pendiente / completada / cancelada) y `USUARIO_DEMO`.
- ✅ `.env` + `.env.example` — `VITE_API_BASE`, `VITE_AUTH_BASE`, `VITE_USE_MOCK`.

### Bloqueantes / Decisiones
- El cliente HTTP va sobre `fetch` (plan §FASE 0), así que `src/api/axios.js` queda sin uso por ahora. Se conserva a la espera de decidir si se elimina.
- Los hooks de dominio (`useCanchas`, `useCanchaDetail`, `useReservas`) **no** se crean en FASE 0: pertenecen a FASE 2/3, donde ya tienen consumidor. `useApi` es la única pieza de la fase.
- `ExplorarCanchas` (FASE 1) no se toca: sigue leyendo `CANCHAS` en local. Se migrará a `useCanchas` al abrir FASE 2.
- `recover()` no tiene endpoint: contra el backend real responderá 404 hasta que se implemente.

### Métricas
- Build: 43.29 kB CSS / 272.04 kB JS (gzip: 8.15 / 83.14), sin cambios de tamaño (código aún sin consumir).
- Lint: 0 errores.
- Tests SSR + contratos: 57/57 OK (`node .check/verificar.mjs`).
- Hex fuera de tokens: 0 · Violeta detectado: 0.

---

## Estado tras Fase 2 — 2026-10-12

### Completado
- ✅ `src/lib/rutas.js` — el enrutado por hash ahora empareja **patrones con parámetros** (`#/cancha/:id`); `emparejar` devuelve `{ruta, params}`, `navegar` centraliza el cambio, `rutaDeCancha(id)` el formato del enlace.
- ✅ `src/App.jsx` — resuelve la vista y le pasa parámetros; el catálogo abre el detalle vía `onReservar` → `navegar(rutaDeCancha(id))`, sin tocar `ExplorarCanchas`.
- ✅ `src/components/canchas/GaleriaCancha.jsx` — galería con miniaturas (`<button>` + `aria-pressed`, teclado nativo).
- ✅ `src/components/canchas/CanchaDetail.jsx` — ficha: título, valoración, dirección, características, descripción con nota de calzado, normas y sede.
- ✅ `src/components/canchas/TarjetaReserva.jsx` — precio, selector de 7 días, `SlotGrid` + leyenda, desglose y la única CTA primaria.
- ✅ `src/components/canchas/ReservaModal.jsx` — confirmación con resumen + formulario de contacto validado; reutiliza `Modal` (foco atrapado, Escape, retorno).
- ✅ `src/components/canchas/index.js` — barril del dominio.
- ✅ `src/hooks/useCanchaDetail.js` + `src/hooks/useDisponibilidad.js` — sobre `useApi`, separados para no recargar la ficha al cambiar de día.
- ✅ `src/pages/DetalleCancha.jsx` + `DetalleCancha.css` — estados de carga/error/éxito, reserva confirmada con código `SC-XXXXX`.
- ✅ `src/styles/components.css` — bloque nuevo `.c-galeria` · `.c-detalle` · `.c-reserva` · `.c-day` · `.c-resumen`, solo tokens.
- ✅ `src/lib/mockData.js` — `DETALLES_CANCHA` (ficha por cancha: dirección, capacidad, descripción, amenidades, normas, calzado, sede, imágenes). `getCancha` la mezcla; `getCanchas` sigue ligero.
- ✅ `src/lib/format.js` — `formatMes` y `proximosDias(n)` (avance en UTC, sin saltos por horario de verano).
- ✅ `src/api/types.js` — typedefs `CanchaDetalle` y `Amenidad`.

### Bloqueantes / Decisiones
- `useReservas` **no** se crea aquí: llega en FASE 3, donde tiene consumidor (la lista de mis reservas). El alta desde el detalle llama a `api/reservas.crear` directamente.
- El `clienteId` de la reserva es `USUARIO_DEMO.id` provisional; la sesión real llega con `useAuth` en FASE 5.
- El mapa de la sede es un marcador con tokens, no un mapa real: el backend no expone geolocalización y no se quieren dependencias externas.
- El detalle se dividió en `CanchaDetail` (ficha) + `TarjetaReserva` (reserva) — una responsabilidad por componente. `CanchaCard` y `SlotGrid` se quedan en `components/ui/`.
- `ExplorarCanchas` **sigue leyendo `CANCHAS` en local**: no se creó `useCanchas` ni se migró el catálogo (la FASE 1 quedó congelada). Pendiente no bloqueante: al tocar el catálogo, envolver `getCanchas` en `useCanchas` y apoyarse en `filtrarCanchas` para conservar el filtrado puro.
- `src/api/axios.js` sigue sin uso (se conserva; pendiente decidir).

### Métricas
- Build: 53.34 kB CSS / 297.77 kB JS (gzip: 9.38 / 90.77).
- Lint: 0 errores.
- Tests SSR + contratos + rutas + componentes: 93/93 OK (`node .check/verificar.mjs`).
- Hex fuera de tokens: 0 · Violeta detectado: 0.

---

## Estado tras Fase 3 — 2026-10-12

### Completado
- ✅ `src/hooks/useApi.js` — nuevo **modo semilla**: `mockData` sin `mock` pinta el dato de inmediato (y en SSR) y **además** hace la petición, para que `refetch()` refleje cambios; `loading` solo se enciende si no hay nada que mostrar.
- ✅ `src/lib/format.js` — `formatDiaSemana`, `formatMesCorto`, `formatDiaNumero`, `diasEntre`, `etiquetaRelativa` (Hoy / Mañana / En N días / Fin de semana / Finalizada) y `horasEntre`; `formatFechaLarga` reusa `formatDiaSemana`.
- ✅ `src/lib/filtroReservas.js` — lógica pura: `GRUPOS`, `ETIQUETA_GRUPO`, `clasificar`, `enriquecer`, `filtrar`, `contar`, `horasHasta`, `puedeCancelar` (>24 h), `puedeCalificar`.
- ✅ `src/lib/comprobante.js` — `reservasACSV` (puro, escapa comas/comillas) y `descargarTexto` (guarda sin DOM para SSR).
- ✅ `src/hooks/useReservas.js` — `useReservas({ clienteId, estado })` sobre `useApi`, con semilla filtrada por cliente en modo mock.
- ✅ `src/components/reservas/` — `ReservaList`, `ReservaCard` (bloque de fecha + cuerpo + pie), `ReservaActions`, `CancelarReservaModal`, `CalificarReservaModal` e `index.js`.
- ✅ `src/pages/MisReservas.jsx` + `MisReservas.css` — hero, 4 pestañas con contador, filtro por deporte, paginación, aside (política / atención / CTA), modales, aviso flotante y `EmptyState` (por pestaña o por filtro); prop `clienteId` (por defecto `USUARIO_DEMO.id`).
- ✅ `src/styles/components.css` — bloque `.c-turno` (con modificador `--canceladas` y adaptación móvil) + `.c-estrellas`/`.c-estrella` + `.c-cancelar__texto`; solo tokens.
- ✅ `src/components/ui/Modal.jsx` — guarda de SSR: sin `document` pinta el diálogo en su sitio en vez de reventar en el portal.
- ✅ `src/lib/rutas.js` + `src/App.jsx` — ruta `#/mis-reservas` y `rutaDeMisReservas()`; `App` la cablea con `onVerCancha` → detalle y `onExplorar` → catálogo.
- ✅ Capturas `mis-reservas-desktop.png`, `mis-reservas-movil.png` y `mis-reservas-cancelar.png`.

### Bloqueantes / Decisiones
- **Política de cancelación = 24 h**, no las 6 h del texto de Stitch: manda la coherencia con el detalle de cancha (FASE 2) y con `puedeCancelar`.
- **Omitidos** del diseño de Stitch: "Invitar amigos" (requiere compartir) y "Escribir por WhatsApp" (canal de soporte inexistente). Sí se conservan la política, "Atención al deportista" y el CTA, que navega al catálogo.
- **Calificar** no tiene endpoint: el estado vive en la página (un `Set` de ids) y no sobrevive a la recarga. Cuando exista `POST /api/reservas/:id/calificacion`, pasa a `useApi`.
- **"Descargar comprobantes"** se implementa como exportación **CSV** real de lo que se está viendo (`lib/comprobante.js`), no como PDF: no hay generación de documentos ni dependencias para ello.
- La página no tiene enlace en la UI (no hay cabecera global): se entra por `#/mis-reservas`, como a `#/estilo`. Pendiente cuando exista armazón.
- `src/api/axios.js` sigue sin uso (se conserva; pendiente decidir).

### Métricas
- Build: 61.47 kB CSS / 315.34 kB JS (gzip: 10.38 / 95.81).
- Lint: 0 errores.
- Tests SSR + contratos + rutas + componentes: 165/165 OK (`node .check/verificar.mjs`).
- Hex fuera de tokens: 0 · Violeta detectado: 0.

---

## Estado tras Fase 4 — 2026-10-13

### Completado
- ✅ `src/lib/mockData.js` — `RESERVAS` pasa a ser **global** (20 turnos: septiembre y octubre de 2026, de los 6 clientes) para que el panel tenga mes actual y mes anterior; se añade `HOY_DEMO = '2026-10-12'` como día de referencia (el panel no depende del reloj) y `codigo` (`CL-0001`…) a cada cliente.
- ✅ `src/api/types.js` — `Cliente.codigo` y nuevo contrato `CanchaNueva`.
- ✅ `src/lib/deportes.js` — `ESTADOS_CANCHA` (disponible / ocupado / mantenimiento) y `DEPORTES_CLAVES`.
- ✅ `src/api/canchas.js` — **con estado**: copia mutable + `_reiniciarMock()`; `crear` / `actualizar` / `eliminar` con validación (`normalizar` + `ApiError 400/404`).
- ✅ `src/api/reservas.js` — `actualizarEstado(id, estado)` para la gestión del panel.
- ✅ `src/lib/metricasAdmin.js` — `mesDe`, `mesAnterior`, `variacion`, `calcularResumen` y `proximosTurnos` (puras; el "ahora" es un parámetro).
- ✅ `src/lib/orden.js` — `comparar` para ordenar tablas (números, texto en español, vacíos al final).
- ✅ `src/lib/exportar.js` + `exportarTablas.js` — CSV genérico y las columnas de clientes/reservas; `comprobante.js` ahora los reutiliza.
- ✅ `src/hooks/useClientes.js`, `useCanchasAdmin.js`, `useReservasAdmin.js` — semilla de mock para SSR.
- ✅ `src/components/ui/DataTable.jsx` — ordenación real, paginación (`pageSize`) y modo apilado (`stack`); `comparar` sale a `lib/orden.js`; `bulkBar` recibe los ids seleccionados.
- ✅ `src/components/ui/Paginador.jsx` — primitiva de paginación controlada.
- ✅ `src/components/admin/` — `AdminSidebar`, `StatsCards`, `ClienteTable`, `ClienteDetalleModal`, `CanchaAdminTable`, `CanchaForm`, `ReservaAdminTable`, `ReservaManualModal`, `ConfirmarModal` e `index.js`.
- ✅ `src/pages/PanelAdmin.jsx` + `PanelAdmin.css` — armazón sidebar + topbar, 4 secciones, modales, aviso flotante; única pieza que habla con `src/api/` (los componentes suben sus intenciones).
- ✅ `src/styles/components.css` — `.c-sidebar` (columna 248 px → banda horizontal <1024 px), `.c-paginador` y `.c-table--stack` (filas a tarjetas <1024 px con `data-label`); `.c-table__sort` pasa a botón.
- ✅ `src/lib/rutas.js` + `src/App.jsx` — ruta `#/admin` y `rutaDeAdmin()`.
- ✅ Capturas `admin-resumen-desktop`, `admin-resumen-movil`, `admin-clientes`, `admin-ficha-cliente`, `admin-canchas`, `admin-nueva-cancha`, `admin-reservas` y `admin-nueva-reserva`.

### Bloqueantes / Decisiones
- **Reconciliación con Stitch:** el plan fija 4 secciones (Resumen · Clientes · Canchas · Reservas) y Stitch muestra un único "Resumen General" con barra lateral. Manda el plan. La sección "Tarifas y Pagos" de Stitch **se omite**: no está en el plan y no hay datos ni endpoint.
- **Métricas = las del plan** (clientes, canchas, reservas del mes, ingresos del mes). Los deltas comparan octubre con septiembre de 2026 respecto a `HOY_DEMO`, no al reloj.
- **"Nueva reserva manual"** (secretaría) y **"Nueva cancha"** son las acciones primarias; el alta manual calcula el total con el precio/hora de la cancha.
- **Editar clientes** no se ofrece: el user-service no expone `PUT`; la ficha es de solo lectura con salto a sus reservas.
- Un turno cancelado/confirmado desde el panel se refleja al instante porque el mock de reservas es con estado y `refetch()` vuelve a pedir.
- `src/api/axios.js` sigue sin uso (se conserva; pendiente decidir).
- Pendientes no bloqueantes: crear `useCanchas` y migrar `ExplorarCanchas`; mover "Calificar" (FASE 3) a API cuando exista `POST /api/reservas/:id/calificacion`.

### Métricas
- Build: 70.10 kB CSS / 349.10 kB JS (gzip: 11.48 / 104.33).
- Lint: 0 errores.
- Tests SSR + contratos + rutas + componentes: **251/251 OK** (`node .check/verificar.mjs`, +86 de FASE 4).
- Inspección en vivo (Brave headless + CDP, `.check/admin-live.mjs`): navegación, filtros, modales, selección masiva y apilado móvil, **0 errores de consola y 0 desborde**.
- Hex fuera de tokens: 0 · Violeta detectado: 0 · CSS válido (lightningcss).

---

## Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Backend no expone `/canchas` `/reservas` a tiempo | Alta | Bloquea F2–F4 | Mocks completos en `api/*.js` con `VITE_USE_MOCK=true`; interfaz idéntica |
| Stitch usa patrones no accesibles (contraste, foco) | Media | Rework | Validar cada componente contra checklist de accesibilidad al portarlo |
| Divergencia visual entre Stitch y tokens | Baja | Inconsistencia | `tokens.css` es fuente única; Stitch solo referencia visual |
| `node_modules` roto por lockfiles | Baja | Build falla | `npm install --no-package-lock` documentado; `bun.lock` respetado |
| CSS inválido para lightningcss (reglas sueltas en @layer) | Media | Build falla | Ya corregido: primitivas envueltas en `:root`; validar cada commit |

---

## Comandos de verificación (reutilizables)

```bash
# Build producción
npx vite build

# Lint
node node_modules/eslint/bin/eslint.js src

# Validación CSS con lightningcss (NO PostCSS)
node -e "
const {transform} = require('lightningcss');
const fs = require('fs');
for (const f of ['src/index.css','src/styles/tokens.css','src/styles/base.css','src/styles/components.css','src/pages/StyleGuide.css','src/pages/ExplorarCanchas.css','src/pages/DetalleCancha.css','src/pages/MisReservas.css','src/pages/PanelAdmin.css']) {
  transform({filename: f, code: Buffer.from(fs.readFileSync(f)), minify: true});
}
console.log('CSS OK');
"

# Render SSR de todas las páginas
node -e "
const {renderToString} = require('react-dom/server');
// importar y renderizar cada página
"
```

---

## Próximo paso inmediato

FASE 4 cerrada ✅. Siguiente: **FASE 5 — Autenticación y Perfil**
(`#/login`, `#/registro`, `#/recuperar`, `#/perfil`) con `useAuth`, guard de rutas
y acceso admin por rol. Antes, pendientes menores no bloqueantes: decidir si se
elimina `src/api/axios.js`, envolver `getCanchas` en `useCanchas` y migrar
`ExplorarCanchas`, y mover "Calificar" (FASE 3) a API cuando exista
`POST /api/reservas/:id/calificacion`.