# Sistema Canchas

> Sistema de reservas de canchas deportivas — **diseño moderno, verde energía**, tokens CSS + React + Vite.  
> Sistema de diseño operable + catálogo de componentes validado en navegador + plan de integración por fases.

---

## Estado actual

| Área | Estado |
|------|--------|
| **Sistema de diseño** | ✅ Completo (tokens, base, componentes, docs) |
| **Catálogo ExplorarCanchas** | ✅ Portado desde Stitch + verificado |
| **Cimentación API + hooks (FASE 0)** | ✅ `api/` (canchas, reservas, clientes, auth), `hooks/useApi`, `lib/format`, `.env` |
| **Detalle + Reserva (FASE 2)** | ✅ `#/cancha/:id` — galería, ficha, selector de días, `SlotGrid`, modal de confirmación + código `SC-XXXXX` |
| **Mis Reservas (FASE 3)** | ✅ `#/mis-reservas` — filtros por estado y deporte, tarjetas de turno, cancelar (si >24 h), calificar, exportar comprobantes |
| **Panel Admin (FASE 4)** | ✅ `#/admin` — resumen con métricas, clientes, CRUD de canchas, reservas globales (filtros, bulk, CSV) |
| **Auth / Perfil** | ❌ No generadas en Stitch — pendiente FASE 5 |
| **Backend real** | Solo `/api/clientes` (user) y `/api/auth` (auth); canchas y reservas siguen en mock |

---

## Capturas

### 1. Documentación generada (`.md`) — ✅ en el repo

| Documento | Captura |
|-----------|---------|
| **DESIGN_SYSTEM.md** — Especificación completa (tokens, componentes, contratos, accesibilidad) | ![DESIGN_SYSTEM](docs/screenshots/design-system-md.png) |
| **STITCH_PROMPTS.md** — 10 prompts (P1–P10) para generar pantallas en Google Stitch | ![STITCH_PROMPTS](docs/screenshots/stitch-prompts-md.png) |
| **PORT_STITCH_PLAN.md** — Plan de integración 6 fases, ~14–18 días | ![PORT_STITCH_PLAN](docs/screenshots/port-stitch-plan-md.png) |

> ✅ Las tres están en `docs/screenshots/`.

---

### 2. Google Stitch — Pantallas generadas (5/5 en el repo)

| Vista en Stitch | Captura |
|-----------------|---------|
| **Dashboard Stitch** con las 4 pantallas generadas (Explorar, Detalle, Mis Reservas, Admin) | ![Stitch Dashboard](docs/screenshots/stitch-dashboard.png) |
| **Explorar canchas** — código + preview | ![Stitch Explorar](docs/screenshots/stitch-explorar.png) |
| **Detalle y reserva** — código + preview | ![Stitch Detalle](docs/screenshots/stitch-detalle.png) |
| **Mis reservas** — código + preview | ![Stitch Mis Reservas](docs/screenshots/stitch-mis-reservas.png) |
| **Panel de control admin** — código + preview | ![Stitch Admin](docs/screenshots/stitch-admin.png) |

> ✅ Las cinco están en `docs/screenshots/`. `stitch-explorar`, `stitch-detalle`, `stitch-mis-reservas` y `stitch-admin` se tomaron del `screen.png` que exporta cada carpeta de `stitch_design_system_generator/`; `stitch-dashboard` es la vista general del proyecto en [Google Stitch](https://stitch.withgoogle.com).

---

### 3. Plan de trabajo (este documento)

| Elemento | Captura |
|----------|---------|
| **PORT_STITCH_PLAN.md** renderizado (tabla de fases, principios, riesgos) | ![Plan Trabajo](docs/screenshots/plan-trabajo.png) |

> ✅ Está en `docs/screenshots/plan-trabajo.png`.

---

### 4. App portada a React (FASE 1 + FASE 2 + FASE 3 + FASE 4) — ✅ en el repo

Capturas generadas con Brave en headless contra `npm run dev` (ancho ≤ 1600 px, tema claro).

| Vista | Escritorio (1440) | Móvil (390) |
|-------|-------------------|-------------|
| **Catálogo de canchas** (`#/`) | ![Catálogo desktop](docs/screenshots/catalogo-desktop.png) | ![Catálogo móvil](docs/screenshots/catalogo-movil.png) |
| **Detalle y reserva** (`#/cancha/1`) | ![Detalle desktop](docs/screenshots/detalle-cancha-desktop.png) | ![Detalle móvil](docs/screenshots/detalle-cancha-movil.png) |
| **Mis reservas** (`#/mis-reservas`) | ![Mis reservas desktop](docs/screenshots/mis-reservas-desktop.png) | ![Mis reservas móvil](docs/screenshots/mis-reservas-movil.png) |
| **Panel · Resumen** (`#/admin`) | ![Admin resumen desktop](docs/screenshots/admin-resumen-desktop.png) | ![Admin resumen móvil](docs/screenshots/admin-resumen-movil.png) |

**Panel Admin — Clientes y ficha** (`#/admin` → **Clientes**; ficha de solo lectura):

| Clientes (listado, filtros y paginación) | Ficha del cliente |
|------------------------------------------|-------------------|
| ![Admin clientes](docs/screenshots/admin-clientes.png) | ![Admin ficha cliente](docs/screenshots/admin-ficha-cliente.png) |

**Panel Admin — Canchas** (listado; **Nueva cancha** en modal):

| Canchas (CRUD) | Modal de alta |
|----------------|---------------|
| ![Admin canchas](docs/screenshots/admin-canchas.png) | ![Admin nueva cancha](docs/screenshots/admin-nueva-cancha.png) |

**Panel Admin — Reservas** (vista global; **Nueva reserva manual** en modal):

| Reservas (filtros, bulk, CSV) | Modal de reserva manual |
|-------------------------------|-------------------------|
| ![Admin reservas](docs/screenshots/admin-reservas.png) | ![Admin nueva reserva](docs/screenshots/admin-nueva-reserva.png) |

**Modal de confirmación de reserva** (`#/cancha/1` → elegir un turno → **Confirmar y pagar reserva**):

![Reserva modal](docs/screenshots/reserva-modal.png)

**Modal de cancelación** (`#/mis-reservas` → **Cancelar turno**):

![Cancelar reserva modal](docs/screenshots/mis-reservas-cancelar.png)

---

## Capturas pendientes (fases futuras)

| Fase | Pantallas a capturar cuando estén listas |
|------|------------------------------------------|
| **FASE 5** | `login.png`, `registro.png`, `recuperar-clave.png`, `perfil.png` |
| **FASE 6** | `admin-resumen-final.png`, `style-guide-completo.png` |

> **Convención de nombres:** `kebab-case.png`, ancho ≤ 1600 px, tema claro (`data-theme="light"`), optimizados (≤ 300 KB).

---

## Arquitectura rápida

```
FrontEnd-App-ingWeb/
├── src/
│   ├── api/              # Cliente HTTP + endpoints (mock ↔ real por env)
│   ├── components/
│   │   ├── ui/           # 13 primitivas (Button, Input, Modal, DataTable, Paginador…)
│   │   ├── canchas/      # GaleriaCancha, CanchaDetail, TarjetaReserva, ReservaModal (FASE 2)
│   │   ├── reservas/     # ReservaList, ReservaCard, ReservaActions, Cancelar/CalificarReservaModal (FASE 3)
│   │   ├── admin/        # AdminSidebar, StatsCards, ClienteTable, CanchaAdminTable, ReservaAdminTable… (FASE 4)
│   │   └── layout/       # Header, Footer, PageShell
│   ├── hooks/            # useApi, useCanchaDetail, useDisponibilidad, useReservas, useClientes, useCanchasAdmin, useReservasAdmin (+ useAuth)
│   ├── lib/              # mockData, filtroCanchas, filtroReservas, metricasAdmin, orden, exportar, comprobante, cx, format, rutas
│   ├── pages/            # ExplorarCanchas, DetalleCancha, MisReservas, PanelAdmin, Login, StyleGuide…
│   ├── styles/
│   │   ├── tokens.css    # 201 tokens — FUENTE ÚNICA DE VERDAD
│   │   ├── base.css
│   │   ├── components.css
│   │   └── pages/        # CSS por página
│   ├── App.jsx           # Hash routing (#/ #/estilo #/cancha/:id #/mis-reservas #/admin …)
│   └── main.jsx
├── docs/
│   ├── design/           # DESIGN_SYSTEM.md, STITCH_PROMPTS.md, stitch-theme.json
│   ├── PORT_STITCH_PLAN.md
│   └── screenshots/      # ← AQUÍ VAN TODAS LAS CAPTURAS
└── stitch_design_system_generator/  # Exports originales de Stitch (solo lectura)
```

---

## Scripts

```bash
# Desarrollo
npm run dev              # http://localhost:5173  (catálogo)
# http://localhost:5173/#/estilo       (style guide)
# http://localhost:5173/#/cancha/1     (detalle + reserva)
# http://localhost:5173/#/mis-reservas (mis reservas)
# http://localhost:5173/#/admin        (panel admin)

# Verificación obligatoria antes de commit
npx vite build           # Build producción
node node_modules/eslint/bin/eslint.js src   # Lint 0 errores
node -e "
const {transform}=require('lightningcss');
const fs=require('fs');
['src/index.css','src/styles/tokens.css','src/styles/base.css','src/styles/components.css','src/pages/StyleGuide.css','src/pages/ExplorarCanchas.css','src/pages/DetalleCancha.css','src/pages/MisReservas.css','src/pages/PanelAdmin.css'].forEach(f=>transform({filename:f,code:Buffer.from(fs.readFileSync(f)),minify:true}));
console.log('CSS OK');
"

# Variables de entorno
cp .env.example .env
# VITE_API_BASE=http://localhost:8080   (user-service)
# VITE_AUTH_BASE=http://localhost:8081  (auth-service)
# VITE_USE_MOCK=true                    (mock ↔ API real sin tocar la vista)

# Verificación local (script efímero, no versionado: vive en .check/)
node .check/verificar.mjs               # 251 contratos + rutas + SSR
```

---

## Principios no negociables

1. **Tokens = fuente única.** Cero hex fuera de `tokens.css` (salvo `theme-color` en `index.html`).
2. **Contraste verificado.** Botón primario `#00B86B` + texto `#0D1211` (7.3:1). Nunca blanco sobre verde (2.6:1).
3. **Iconos = Material Symbols Rounded.** Stitch generó Outlined; se corrige al portar.
4. **Radios en escala:** 8 / 12 / 16 / 28 / 999 px. Nada de `rounded-xl` arbitrario.
5. **Campos con etiqueta visible.** Nunca solo `placeholder`.
6. **Formato:** Hora 24 h (`18:00 – 20:00`), precios `$12.000 / hora`, códigos `SC-XXXXX` (reservas) y `CL-XXXX` (clientes).
7. **Mock ↔ API sin tocar la vista.** Hooks deciden por `VITE_USE_MOCK`.

---

## Cómo continuar

1. **Capturas:** hechas las de FASE 1 + FASE 2 + FASE 3 + FASE 4 (app) y las de Stitch. No queda ninguna pendiente de fases cerradas.
2. **Próxima fase:** FASES 0–4 cerradas → sigue **FASE 5 — Autenticación y Perfil** (`#/login`, `#/registro`, `#/recuperar`, `#/perfil`), con `useAuth`, guard de rutas y acceso admin por rol (`docs/PORT_STITCH_PLAN.md`).
3. **Pendientes menores (no bloquean FASE 5):** decidir si se elimina `src/api/axios.js`; envolver `getCanchas` en `useCanchas` y migrar `ExplorarCanchas`; mover "Calificar" (FASE 3) a API cuando exista `POST /api/reservas/:id/calificacion`.
4. **Commit atómico:**
   ```bash
   git add FrontEnd-App-ingWeb/src docs/PORT_STITCH_PLAN.md README.md
   git commit -m "feat(admin): panel de control con métricas, clientes, canchas y reservas (FASE 4)"
   ```

---

## Licencia

Proyecto académico / interno — sin licencia pública por ahora.