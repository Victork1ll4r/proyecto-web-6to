import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  CanchaCard,
  Card,
  Checkbox,
  Chip,
  ChipRow,
  DataTable,
  EmptyState,
  Icon,
  Input,
  Medallion,
  Modal,
  PasswordInput,
  Radio,
  Select,
  Skeleton,
  SlotGrid,
  SlotLegend,
  StatCard,
  Switch,
  TableAction,
  Textarea,
  Toast,
} from '../components/ui/index.js'
import {
  CANCHAS,
  CLIENTES,
  DIAS,
  ESCALA_TIPO,
  HORARIOS,
  HORARIOS_TODOS_LIBRES,
  ICONOS,
  PALETA,
} from '../lib/mockData.js'
import { getDeporte } from '../lib/deportes.js'
import { formatCurrency } from '../lib/cx.js'
import './StyleGuide.css'

/* --------------------------------------------------------------------- */
/* Piezas auxiliares de la página                                         */
/* --------------------------------------------------------------------- */

function Section({ id, title, description, children }) {
  return (
    <section className="sg__section" id={id}>
      <header className="sg__section-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      {children}
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="sg__demo sg__demo--column">
      {label ? <p className="u-label sg__demo-label">{label}</p> : null}
      {children}
    </div>
  )
}

/* --------------------------------------------------------------------- */
/* Página                                                                 */
/* --------------------------------------------------------------------- */

const NAV = [
  ['marca', 'Color'],
  ['tipografia', 'Tipografía'],
  ['espaciado', 'Espaciado y radios'],
  ['iconos', 'Iconos'],
  ['botones', 'Botones'],
  ['formularios', 'Formularios'],
  ['chips', 'Chips y badges'],
  ['cancha', 'Tarjeta de cancha'],
  ['horarios', 'Horarios'],
  ['datos', 'Métricas y tablas'],
  ['feedback', 'Feedback'],
  ['overlays', 'Modal'],
]

const ESPACIOS = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
const RADIOS = [
  ['--r-sm', '8'],
  ['--r-md', '12'],
  ['--r-lg', '16'],
  ['--r-xl', '20'],
  ['--r-2xl', '28'],
  ['--r-full', '999'],
]
const SOMBRAS = ['--sh-xs', '--sh-sm', '--sh-md', '--sh-lg', '--sh-xl']

export function StyleGuide() {
  const [theme, setTheme] = useState('light')
  const [dia, setDia] = useState(1)
  const [horas, setHoras] = useState([])
  const [modal, setModal] = useState(false)
  const [toasts, setToasts] = useState([])

  // --- Estado de los formularios de demostración -----------------------
  const [email, setEmail] = useState('juan.perez@correo.com')
  const [password, setPassword] = useState('canchas2026')
  const [telefono, setTelefono] = useState('300 123 4567')
  const [deporte, setDeporte] = useState('futbol')
  const [zona, setZona] = useState('norte')
  const [notas, setNotas] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [acepto, setAcepto] = useState(false)
  const [plan, setPlan] = useState('mensual')
  const [sms, setSms] = useState(false)
  const [avisos, setAvisos] = useState(true)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const pushToast = (toast) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const totalHoras = horas.length

  return (
    <div className="sg">
      {/* ------------------------------------------------------------ */}
      <header className="sg__top">
        <div className="sg__brand">
          <span className="sg__logo" aria-hidden="true">
            SC
          </span>
          <span className="sg__brand-text">
            <span className="sg__brand-name">Sistema Canchas</span>
            <span className="sg__brand-sub">Style guide v1.0</span>
          </span>
        </div>

        <Button
          variant="secondary"
          icon={theme === 'light' ? 'dark_mode' : 'light_mode'}
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        </Button>
      </header>

      <div className="sg__layout">
        {/* ------------------------------------------------------ */}
        <nav className="sg__side" aria-label="Secciones del catálogo">
          <p className="u-overline sg__side-title">Componentes</p>
          <ul className="sg__side-list">
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a className="sg__side-link" href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="sg__main">
          {/* ==================================================== */}
          <Section
            id="marca"
            title="Color"
            description="Verde energía sobre carbón. El botón primario es verde #00B86B con texto carbón #0D1211: el blanco sobre ese verde solo da 2.6:1 y no cumple el contraste mínimo."
          >
            {PALETA.map(({ group, tokens }) => (
              <Row key={group} label={group}>
                <div className="sg__grid-4" style={{ width: '100%' }}>
                  {tokens.map(([name, hex]) => (
                    <div className="sg__swatch" key={name}>
                      <span className="sg__swatch-chip" style={{ '--swatch': hex }} />
                      <span className="sg__swatch-info">
                        <span className="sg__swatch-name">{name}</span>
                        <span className="sg__swatch-hex">{hex}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </Row>
            ))}

            <Row label="Badges de estado">
              <Badge tone="disponible">Disponible</Badge>
              <Badge tone="ocupado">Ocupada</Badge>
              <Badge tone="pendiente">Pendiente</Badge>
              <Badge tone="cancelada">Cancelada</Badge>
              <Badge tone="confirmada">Confirmada</Badge>
              <Badge tone="rechazada">Rechazada</Badge>
              <Badge tone="activo">Activo</Badge>
              <Badge tone="inactivo">Inactivo</Badge>
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="tipografia"
            title="Tipografía"
            description="Sora para títulos (nunca por debajo de 600), Inter para todo el texto de interfaz y JetBrains Mono para códigos. Ambas familias son de Google Fonts."
          >
            <Row>
              {ESCALA_TIPO.map(([token, size, weight, sample]) => (
                <div className="sg__type-row" key={token}>
                  <span className="sg__type-token">{token}</span>
                  <span style={{ fontSize: size, fontWeight: weight }}>{sample}</span>
                </div>
              ))}
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="espaciado"
            title="Espaciado, radios y sombras"
            description="Espaciado base de 4 px. Las sombras llevan tinte verde (rgb(13 18 17 / …)); nunca negro puro."
          >
            <Row label="Escala de espaciado">
              <div style={{ width: '100%' }}>
                {ESPACIOS.map((px) => (
                  <div className="sg__meter" key={px}>
                    <span className="sg__meter-key">--sp-{px}</span>
                    <span className="sg__meter-bar" style={{ width: `${px * 2.4}px` }} />
                    <span className="u-muted" style={{ fontSize: 'var(--fs-caption)' }}>
                      {px} px
                    </span>
                  </div>
                ))}
              </div>
            </Row>

            <Row label="Radios">
              {RADIOS.map(([token, px]) => (
                <span
                  className="sg__radius-sample"
                  key={token}
                  style={{ borderRadius: `var(${token})` }}
                >
                  {px}
                </span>
              ))}
            </Row>

            <Row label="Elevación">
              {SOMBRAS.map((token) => (
                <span
                  key={token}
                  className="sg__radius-sample"
                  style={{ boxShadow: `var(${token})`, borderRadius: 'var(--r-md)' }}
                >
                  {token}
                </span>
              ))}
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="iconos"
            title="Iconos"
            description="Un solo set en todo el producto: Material Symbols Rounded. Nunca emojis."
          >
            <Row>
              <div className="sg__icons">
                {ICONOS.map((name) => (
                  <span className="sg__icon" key={name}>
                    <Icon name={name} size={24} />
                    {name}
                  </span>
                ))}
              </div>
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="botones"
            title="Botones"
            description="Alto mínimo de 44 px en cualquier dispositivo táctil. Una sola acción primaria por pantalla."
          >
            <Row label="Variantes">
              <Button>Reservar</Button>
              <Button variant="secondary">Ver horarios</Button>
              <Button variant="ghost">Cancelar</Button>
              <Button variant="soft">Reportar problema</Button>
              <Button variant="danger">Eliminar</Button>
            </Row>

            <Row label="Tamaños">
              <Button size="sm">Pequeño 36</Button>
              <Button size="md">Mediano 44</Button>
              <Button size="lg">Grande 52</Button>
            </Row>

            <Row label="Estados">
              <Button disabled>Deshabilitado</Button>
              <Button loading>Cargando</Button>
              <Button variant="secondary" disabled>
                Secundario off
              </Button>
              <Button variant="secondary" loading>
                Guardando
              </Button>
            </Row>

            <Row label="Con icono">
              <Button icon="add">Nueva cancha</Button>
              <Button iconRight="arrow_forward" variant="secondary">
                Continuar
              </Button>
              <Button iconOnly variant="secondary" aria-label="Filtrar">
                <Icon name="filter_list" size={20} />
              </Button>
            </Row>

            <Row label="Ancho completo">
              <Button size="lg" fullWidth>
                Confirmar reserva
              </Button>
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="formularios"
            title="Formularios"
            description="La etiqueta siempre está visible encima del campo: nunca se sustituye por el texto de ejemplo. Los mensajes de error aparecen sin saltar el diseño."
          >
            <Row label="Estados de un campo">
              <div className="sg__panel" style={{ width: '100%' }}>
                <Input
                  label="Reposo"
                  placeholder="Escribe aquí"
                  helper="Texto de ayuda de 13 px en gris secundario."
                />
                <Input
                  label="Con ícono y error"
                  icon="mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error="Ese correo ya está registrado. Prueba iniciar sesión."
                  required
                />
                <Input label="Deshabilitado" defaultValue="No editable" disabled />
              </div>
            </Row>

            <Row label="Contraseña, teléfono y selec">
              <div className="sg__panel" style={{ width: '100%' }}>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helper="Mínimo 8 caracteres."
                />

                <Input
                  label="Teléfono"
                  affix="+57"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  helper="Opcional. Te avisamos por aquí si cambia una reserva."
                />

                <Select label="Deporte" value={deporte} onChange={(e) => setDeporte(e.target.value)}>
                  <option value="">Todos los deportes</option>
                  <option value="futbol">Fútbol</option>
                  <option value="voley">Vóley</option>
                  <option value="basquet">Básquet</option>
                  <option value="tenis">Tenis</option>
                  <option value="padel">Padel</option>
                </Select>

                <Select label="Zona" icon="location_on" value={zona} onChange={(e) => setZona(e.target.value)}>
                  <option value="norte">Zona Norte</option>
                  <option value="sur">Zona Sur</option>
                  <option value="este">Zona Este</option>
                  <option value="oeste">Zona Oeste</option>
                  <option value="centro">Centro</option>
                </Select>

                <Textarea
                  label="Nota para la cancha"
                  placeholder="Cuéntanos si necesitas algo especial…"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                />
              </div>
            </Row>

            <Row label="Casillas, opciones e interruptores">
              <div className="sg__panel" style={{ width: '100%' }}>
                <Checkbox label="Recordarme" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} />
                <Checkbox
                  label="Acepto los términos y condiciones y la política de privacidad"
                  checked={acepto}
                  onChange={(e) => setAcepto(e.target.checked)}
                />
                <Checkbox label="Opción deshabilitada" disabled />

                <div className="u-row" style={{ gap: 'var(--sp-5)' }}>
                  <Radio label="Mensual" name="plan" value="mensual" checked={plan === 'mensual'} onChange={(e) => setPlan(e.target.value)} />
                  <Radio label="Trimestral" name="plan" value="trimestral" checked={plan === 'trimestral'} onChange={(e) => setPlan(e.target.value)} />
                </div>

                <div className="u-stack" style={{ gap: 'var(--sp-5)', paddingTop: 'var(--sp-2)' }}>
                  <Switch
                    label="Recordatorios por correo"
                    description="Te avisamos 2 horas antes de tu reserva."
                    checked={avisos}
                    onChange={setAvisos}
                  />
                  <Switch
                    label="Recordatorios por SMS"
                    description="Solo para cambios de última hora."
                    checked={sms}
                    onChange={setSms}
                  />
                </div>
              </div>
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="chips"
            title="Chips y badges"
            description="El chip enciende con fondo verde suave y borde verde. El punto de color identifica la disciplina."
          >
            <Row label="Filtros">
              <ChipRow>
                <Chip selected onClick={() => {}}>
                  Todas
                </Chip>
                <Chip onClick={() => {}}>Fútbol</Chip>
                <Chip onClick={() => {}}>Vóley</Chip>
                <Chip onClick={() => {}}>Básquet</Chip>
                <Chip onClick={() => {}}>Tenis</Chip>
                <Chip onClick={() => {}}>Padel</Chip>
                <Chip icon="roofing" onClick={() => {}}>
                  Techadas
                </Chip>
              </ChipRow>
            </Row>

            <Row label="Por disciplina">
              <ChipRow>
                {Object.entries({ futbol: 1, voley: 1, basquet: 1, tenis: 1, padel: 1 }).map(([key]) => {
                  const dep = getDeporte(key)
                  return (
                    <Chip key={key} dot={dep.color}>
                      {dep.label}
                    </Chip>
                  )
                })}
              </ChipRow>
            </Row>

            <Row label="Avatares">
              <Avatar name="Juan Pérez" size={40} ring />
              <Avatar name="Laura Méndez" size={48} />
              <Avatar name="Carlos Rivas" size={32} neutral />
              <Avatar size={96} />
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="cancha"
            title="Tarjeta de cancha"
            description="Imagen 16:10 con degradado oscuro para que el chip de deporte y la valoración se lean sobre cualquier foto. Las características van como etiquetas de texto, no iconos: la información es secundaria y así no compite con el título. Aquí la acción es primaria a ancho completo; en el catálogo completo esa repetición es aceptable porque cada tarjeta es un objetivo de decisión distinto y la acción es el propósito de la pantalla."
          >
            <div className="sg__grid-3">
              {CANCHAS.slice(0, 3).map((cancha) => (
                <CanchaCard
                  key={cancha.id}
                  cancha={cancha}
                  onReservar={(c) =>
                    pushToast({
                      tone: 'ok',
                      title: `Turno en ${c.nombre}`,
                      children: `${formatCurrency(c.precioHora)} por hora`,
                    })
                  }
                />
              ))}
            </div>
          </Section>

          {/* ==================================================== */}
          <Section
            id="horarios"
            title="Selección de horarios"
            description="Pulsa un horario libre y luego el siguiente para ampliar el bloque: los turnos contiguos se reservan juntos. Al pulsar dentro del bloque, se recorta."
          >
            <div className="sg__grid-2">
              <Card>
                <p className="u-overline">Horarios del sábado 9</p>
                <SlotLegend />
                <SlotGrid slots={HORARIOS} cols={4} onChange={setHoras} />
                <div className="sg__summary">
                  <div className="sg__summary-row">
                    <span>Sábado 9 de octubre</span>
                  </div>
                  <div className="sg__summary-row">
                    <span>Seleccionado</span>
                    <strong>
                      {totalHoras === 0
                        ? '—'
                        : `${HORARIOS[horas[0]].hora} – ${HORARIOS[horas.at(-1)].hora}`}
                    </strong>
                  </div>
                  <div className="sg__summary-row">
                    <span>Duración</span>
                    <strong>{totalHoras} {totalHoras === 1 ? 'hora' : 'horas'}</strong>
                  </div>
                  <div className="sg__summary-row">
                    <span>Total</span>
                    <strong>{formatCurrency(totalHoras * 12000)}</strong>
                  </div>
                </div>
                <Button fullWidth disabled={totalHoras === 0}>
                  Confirmar reserva
                </Button>
              </Card>

              <div className="u-stack">
                <Card>
                  <p className="u-overline">Elige el día</p>
                  <div className="sg__days">
                    {DIAS.map((d, i) => (
                      <button
                        key={d.numero}
                        type="button"
                        className={[
                          'sg__day',
                          i === dia && 'sg__day--on',
                          !d.disponible && 'sg__day--full',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => d.disponible && setDia(i)}
                        disabled={!d.disponible}
                        aria-pressed={i === dia}
                      >
                        <span className="sg__day-nombre">{d.dia}</span>
                        <span className="sg__day-numero">{d.numero}</span>
                        {d.disponible ? <span className="sg__day-dot" /> : null}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <p className="u-overline">Día sin disponibilidad</p>
                  <SlotLegend />
                  <SlotGrid slots={HORARIOS_TODOS_LIBRES.map((_, i) => ({ hora: HORARIOS[i].hora, estado: 'ocupado' }))} cols={4} />
                </Card>
              </div>
            </div>
          </Section>

          {/* ==================================================== */}
          <Section
            id="datos"
            title="Métricas y tablas"
            description="Las cifras usan ancho de dígito fijo para alinearse en columna. En la tabla, la única acción verde de la pantalla está en la cabecera."
          >
            <Row label="Tarjetas de métrica">
              <div className="sg__grid-4" style={{ width: '100%' }}>
                <StatCard label="Total de clientes" value="248" delta="+12 este mes" icon="groups" />
                <StatCard label="Clientes activos" value="231" delta="+8 este mes" icon="verified_user" />
                <StatCard label="Cuentas inactivas" value="17" delta="−2 este mes" direction="down" icon="person_off" />
                <StatCard label="Reservas del mes" value="1.402" delta="+18% vs. septiembre" icon="event_available" />
              </div>
            </Row>

            <Row label="Tabla de clientes con selección múltiple">
              <div style={{ width: '100%' }}>
                <DataTable
                  selectable
                  rows={CLIENTES}
                  columns={[
                    {
                      key: 'nombre',
                      header: 'Nombre',
                      render: (row) => (
                        <span className="c-table__cell-person">
                          <Avatar name={row.nombre} size={32} />
                          <span>
                            <strong style={{ display: 'block' }}>{row.nombre}</strong>
                            <span className="u-muted" style={{ fontSize: 'var(--fs-caption)' }}>
                              {row.email}
                            </span>
                          </span>
                        </span>
                      ),
                    },
                    { key: 'telefono', header: 'Teléfono' },
                    { key: 'registro', header: 'Registro' },
                    { key: 'reservas', header: 'Reservas', align: 'right', sortable: true },
                    {
                      key: 'activo',
                      header: 'Estado',
                      render: (row) => (
                        <Badge tone={row.activo ? 'activo' : 'inactivo'}>
                          {row.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      ),
                    },
                    {
                      key: 'acciones',
                      header: <span className="u-visually-hidden">Acciones</span>,
                      render: (row) => (
                        <span className="c-table__actions">
                          <TableAction icon="edit" label={`Editar a ${row.nombre}`} />
                          <TableAction
                            icon={row.activo ? 'person_off' : 'person_add'}
                            label={row.activo ? 'Desactivar' : 'Activar'}
                            danger={row.activo}
                          />
                        </span>
                      ),
                    },
                  ]}
                  bulkBar={({ count, clear }) => (
                    <>
                      <Button size="sm" variant="soft" icon="person_off">
                        Desactivar {count}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={clear}>
                        Limpiar
                      </Button>
                    </>
                  )}
                />
              </div>
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="feedback"
            title="Feedback"
            description="Alertas, estado vacío, esqueletos de carga y avisos flotantes. Ningún estado se comunica solo con color."
          >
            <Row label="Alertas">
              <div style={{ width: '100%' }} className="u-stack">
                <Alert tone="ok" title="Te enviamos la confirmación">
                  La reserva SC-4A7F2 quedó registrada para el sábado 9.
                </Alert>
                <Alert tone="warn" title="La reserva sigue pendiente">
                  Puedes cancelar sin costo hasta 2 horas antes del turno.
                </Alert>
                <Alert tone="danger" title="No pudimos guardar tus cambios">
                  Revisa tu conexión e inténtalo de nuevo.
                </Alert>
                <Alert tone="info">
                  Si el correo está registrado, recibirás el enlace en menos de un minuto.
                </Alert>
              </div>
            </Row>

            <Row label="Avisos flotantes">
              <Button
                variant="secondary"
                icon="notifications"
                onClick={() =>
                  pushToast({
                    tone: 'ok',
                    title: 'Reserva confirmada',
                    children: 'Sábado 9 de octubre, 18:00 – 20:00.',
                  })
                }
              >
                Mostrar un toast
              </Button>

              <div className="u-stack" style={{ gap: 'var(--sp-3)' }}>
                {toasts.map((t) => (
                  <Toast
                    key={t.id}
                    tone={t.tone}
                    title={t.title}
                    onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                  >
                    {t.children}
                  </Toast>
                ))}
              </div>
            </Row>

            <Row label="Estado vacío">
              <EmptyState
                icon="event_busy"
                title="No tienes reservas todavía"
                description="Cuando reserves una cancha, aparecerá aquí con todos los detalles."
                action={<Button variant="secondary">Explorar canchas</Button>}
              />
              <EmptyState
                icon="cloud_off"
                tone="danger"
                title="No pudimos cargar la información"
                description="El servidor respondió con un error inesperado. Inténtalo de nuevo en unos segundos."
                action={<Button icon="refresh">Reintentar</Button>}
              />
            </Row>

            <Row label="Esqueletos de carga">
              <Card>
                <div className="u-stack">
                  <Skeleton width="45%" height={20} />
                  <Skeleton width="100%" height={12} />
                  <Skeleton width="80%" height={12} />
                  <Skeleton width="100%" height={140} radius="var(--r-md)" />
                </div>
              </Card>
            </Row>
          </Section>

          {/* ==================================================== */}
          <Section
            id="overlays"
            title="Modal"
            description="Foco atrapado, Escape para cerrar y retorno del foco al elemento que lo abrió. Se usa para confirmar acciones destructivas y para el resumen final de una reserva."
          >
            <Row>
              <Button icon="check_circle" onClick={() => setModal(true)}>
                Abrir confirmación
              </Button>

              <Button variant="secondary" icon="delete" onClick={() => setModal('peligro')}>
                Abrir acción destructiva
              </Button>
            </Row>
          </Section>

          <footer className="sg__footer">
            <p>
              Tokens: <code>src/styles/tokens.css</code> · Componentes:{' '}
              <code>src/components/ui</code> · Especificación:{' '}
              <code>docs/design/DESIGN_SYSTEM.md</code>
            </p>
            <p style={{ marginTop: 'var(--sp-2)' }}>
              Esta página es el validador del sistema: si un componente se ve aquí, se ve en
              cualquier pantalla.
            </p>
          </footer>
        </main>
      </div>

      <Modal
        open={modal === true}
        onClose={() => setModal(false)}
        title="¡Reserva confirmada!"
        description="Te enviamos la confirmación a juan.perez@correo.com"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              Seguir explorando
            </Button>
            <Button onClick={() => setModal(false)}>Ver mis reservas</Button>
          </>
        }
      >
        <div className="u-stack" style={{ alignItems: 'center', gap: 'var(--sp-5)' }}>
          <Medallion icon="check" size={72} />

          <div className="sg__summary" style={{ width: '100%' }}>
            <div className="sg__summary-row">
              <span>Código</span>
              <strong className="u-mono">SC-4A7F2</strong>
            </div>
            <div className="sg__summary-row">
              <span>Cancha</span>
              <strong>Cancha Fútbol 1</strong>
            </div>
            <div className="sg__summary-row">
              <span>Fecha y hora</span>
              <strong>Sábado 9, 18:00 – 20:00</strong>
            </div>
            <div className="sg__summary-row">
              <span>Total</span>
              <strong>{formatCurrency(24000)}</strong>
            </div>
          </div>

          <Alert tone="warn" style={{ width: '100%' }}>
            Puedes cancelar sin costo hasta 2 horas antes.
          </Alert>
        </div>
      </Modal>

      <Modal
        open={modal === 'peligro'}
        onClose={() => setModal(false)}
        title="¿Cancelar esta reserva?"
        description="La acción no se puede deshacer y el horario queda libre para otros usuarios."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              Mantener reserva
            </Button>
            <Button variant="danger" onClick={() => setModal(false)}>
              Sí, cancelar
            </Button>
          </>
        }
      >
        <div className="sg__summary">
          <div className="sg__summary-row">
            <span>Reserva</span>
            <strong className="u-mono">SC-4A7F2</strong>
          </div>
          <div className="sg__summary-row">
            <span>Horario</span>
            <strong>Sábado 9, 18:00 – 20:00</strong>
          </div>
        </div>
      </Modal>
    </div>
  )
}
