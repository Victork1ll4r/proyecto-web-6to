# Plan de Integración — Páginas Stitch → Frontend + Backend

**Versión:** 1.0  
**Fecha:** 2026-10-05  
**Estado:** Pendiente de aprobación

---

## Contexto actual

| Pantalla Stitch | Estado | Backend necesario |
|---|---|---|
| `explorar_canchas` | ✅ Portada (React + tokens) | `GET /api/canchas` (propuesto) |
| `detalle_y_reserva_de_cancha` | 📦 Código + PNG | `GET /api/canchas/:id`, `POST /api/reservas` (propuestos) |
| `mis_reservas` | 📦 Código + PNG | `GET /api/reservas?cliente=:id` (propuesto) |
| `panel_de_control_admin` | 📦 Código + PNG | `GET /api/clientes` (real), `GET /api/canchas`, `GET /api/reservas` |
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
│   │   ├── canchas/            # Componentes de dominio cancha
│   │   │   ├── CanchaCard.jsx
│   │   │   ├── CanchaGrid.jsx
│   │   │   ├── CanchaDetail.jsx
│   │   │   ├── SlotGrid.jsx
│   │   │   └── ReservaModal.jsx
│   │   ├── reservas/           # Componentes de dominio reserva
│   │   │   ├── ReservaList.jsx
│   │   │   ├── ReservaCard.jsx
│   │   │   └── ReservaActions.jsx
│   │   ├── admin/              # Componentes de dominio admin
│   │   │   ├── ClienteTable.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   └── AdminSidebar.jsx
│   │   └── layout/             # Header, Footer, Sidebar, PageShell
│   ├── hooks/
│   │   ├── useCanchas.js
│   │   ├── useCanchaDetail.js
│   │   ├── useReservas.js
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   ├── lib/
│   │   ├── mockData.js         # Datos de desarrollo (actualizados con Stitch)
│   │   ├── filtroCanchas.js    # Lógica pura de filtrado (ya existe)
│   │   ├── cx.js               # Utilidades (ya existe)
│   │   ├── deportes.js         # Catálogo de deportes (ya existe)
│   │   ├── format.js           # Moneda, fecha, hora (nuevo)
│   │   ├── rutas.js            # Hash routing (ya existe)
│   │   └── validators.js       # Validaciones de formulario
│   ├── pages/
│   │   ├── ExplorarCanchas.jsx       # ✅ YA PORTADA
│   │   ├── ExplorarCanchas.css
│   │   ├── DetalleCancha.jsx         # 🔄 FASE 2
│   │   ├── DetalleCancha.css
│   │   ├── MisReservas.jsx           # 🔄 FASE 3
│   │   ├── MisReservas.css
│   │   ├── PanelAdmin.jsx            # 🔄 FASE 4
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
| Cliente HTTP tipado (`api/client.js`) | `src/api/client.js` | ☐ |
| Endpoints Cancha (mock + types) | `src/api/canchas.js` | ☐ |
| Endpoints Reserva (mock + types) | `src/api/reservas.js` | ☐ |
| Endpoints Auth (mock + types) | `src/api/auth.js` | ☐ |
| Contratos JSDoc `Cancha`, `Reserva`, `Disponibilidad`, `Cliente` | `src/api/types.js` | ☐ |
| Hook genérico `useApi` (loading/error/data + mock toggle) | `src/hooks/useApi.js` | ☐ |
| Utilidades de formato (COP, hora 24h, código `SC-XXXXX`) | `src/lib/format.js` | ☐ |
| Variables de entorno `.env` (`VITE_API_BASE`, `VITE_USE_MOCK`) | `.env`, `.env.example` | ☐ |
| **Verificación:** build + lint + test SSR de hooks puros | | ☐ |

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

### FASE 2 — Detalle de Cancha + Reserva (3–4 días)

**Pantallas Stitch:** `detalle_y_reserva_de_cancha/code.html` + `screen.png`

#### 2.1 Componentes de dominio `canchas/`

| Componente | Responsabilidad | Props clave |
|---|---|---|
| `CanchaDetail` | Vista completa: galería, info, horario, acción | `cancha`, `onReservar` |
| `SlotGrid` | Ya existe — rangos contiguos, selección múltiple | `slots`, `seleccion`, `onChange` |
| `ReservaModal` | Confirmación: resumen, precio total, formulario datos | `cancha`, `slots`, `onConfirm`, `onCancel` |
| `GaleríaCancha` | Carousel simple, teclado accesible | `imagenes[]` |

#### 2.2 Página `DetalleCancha`

- URL: `#/cancha/:id`
- Usa `useCanchaDetail(id)` → `api/canchas.js` (mock hoy, real mañana)
- Estados: loading (Skeleton), error, éxito
- Integra `SlotGrid` + `ReservaModal`

#### 2.3 Hook `useCanchaDetail`

```js
export function useCanchaDetail(id) {
  return useApi(() => api.canchas.getById(id), { mock: USE_MOCK, mockData: CANCHAS.find(c => c.id === +id) })
}
```

#### 2.4 CSS `DetalleCancha.css`

- Solo layout y override de tokens; nada de hex.

#### Verificación fase 2

- [ ] SSR render sin `undefined`/`NaN`
- [ ] SlotGrid selecciona rangos contiguos
- [ ] ReservaModal abre/cierra con foco atrapado, Escape, retorno
- [ ] Precio total = `precioHora * slots.length` formateado COP
- [ ] Contratos `Cancha` + `Disponibilidad` respetados
- [ ] Build + lint + 0 hex fuera de tokens

---

### FASE 3 — Mis Reservas (2–3 días)

**Pantalla Stitch:** `mis_reservas/code.html` + `screen.png`

#### 3.1 Componentes `reservas/`

| Componente | Responsabilidad |
|---|---|
| `ReservaList` | Tabla/Lista responsive con estados (próxima, pasada, cancelada) |
| `ReservaCard` | Tarjeta individual: cancha, fecha, hora, estado, acciones |
| `ReservaActions` | Botones: ver detalle, cancelar (si >24h), calificar (si pasada) |

#### 3.2 Página `MisReservas`

- URL: `#/mis-reservas` (requiere auth — fase 5)
- Hook `useReservas({ clienteId, estado })`
- Filtros: próximas / pasadas / todas
- EmptyState si no hay reservas

#### 3.3 Hook `useReservas`

```js
export function useReservas({ clienteId, estado }) {
  return useApi(() => api.reservas.list({ clienteId, estado }), { mock: USE_MOCK, mockData: MOCK_RESERVAS })
}
```

#### Verificación fase 3

- [ ] SSR render de lista vacía y con 3+ reservas
- [ ] Filtro por estado funciona
- [ ] Acción "cancelar" abre modal confirmación
- [ ] Formato fecha `DD/MM/YYYY`, hora `HH:MM – HH:MM`, precio COP
- [ ] Código reserva `SC-XXXXX` visible
- [ ] Build + lint

---

### FASE 4 — Panel de Control Admin (3–4 días)

**Pantalla Stitch:** `panel_de_control_admin/code.html` + `screen.png`

#### 4.1 Componentes `admin/`

| Componente | Responsabilidad |
|---|---|
| `ClienteTable` | DataTable existente + columnas: código, nombre, email, teléfono, estado, acciones |
| `StatsCards` | 4 tarjetas: usuarios, canchas, reservas mes, ingresos mes |
| `AdminSidebar` | Navegación: Clientes / Canchas / Reservas / Resumen |
| `CanchaAdminTable` | CRUD canchas (crear/editar/borrar) — usa `CanchaForm` modal |
| `ReservaAdminTable` | Vista global de todas las reservas con filtros |

#### 4.2 Página `PanelAdmin`

- URL: `#/admin` (requiere rol admin — fase 5)
- Layout: sidebar fija + contenido
- Tabs: Clientes | Canchas | Reservas | Resumen

#### 4.3 Hooks `useClientes`, `useCanchasAdmin`, `useReservasAdmin`

Todos sobre `api/clientes.js`, `api/canchas.js`, `api/reservas.js`.

#### Verificación fase 4

- [ ] ClienteTable: paginación, ordenación, selección múltiple, barra masiva (ya existe en DataTable)
- [ ] StatsCards consumen endpoints reales/mock
- [ ] CanchaAdminTable: modal crear/editar con validación
- [ ] Sin colores violeta, iconos Rounded
- [ ] Build + lint

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
for (const f of ['src/index.css','src/styles/tokens.css','src/styles/base.css','src/styles/components.css','src/pages/StyleGuide.css','src/pages/ExplorarCanchas.css']) {
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

**Aprobación del plan** → Iniciar **FASE 0** (cimentación API + hooks) si el backend va a tardar, o **FASE 2** directo si los endpoints ya están listos.

¿Aprobamos y arrancamos con FASE 0?