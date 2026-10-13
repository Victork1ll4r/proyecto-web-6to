import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AdminSidebar,
  CanchaAdminTable,
  CanchaForm,
  ClienteDetalleModal,
  ClienteTable,
  ConfirmarModal,
  ReservaAdminTable,
  ReservaManualModal,
  StatsCards,
} from '../components/admin/index.js'
import { Badge } from '../components/ui/Chip.jsx'
import { Button } from '../components/ui/Button.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { Alert, Skeleton, Toast } from '../components/ui/Feedback.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { actualizar, crear as crearCancha, eliminar as eliminarCancha } from '../api/canchas.js'
import { actualizarEstado, crear as crearReserva } from '../api/reservas.js'
import { useCanchasAdmin } from '../hooks/useCanchasAdmin.js'
import { useClientes } from '../hooks/useClientes.js'
import { useReservasAdmin } from '../hooks/useReservasAdmin.js'
import { ESTADOS_RESERVA } from '../lib/deportes.js'
import { HOY_DEMO } from '../lib/mockData.js'
import { formatFechaLarga, formatFecha, formatMoneda, formatRangoHoras } from '../lib/format.js'
import { proximosTurnos } from '../lib/metricasAdmin.js'
import './PanelAdmin.css'

/** Cabecera de cada sección: título, descripción y acción primaria. */
const CABECERAS = {
  resumen: {
    titulo: 'Resumen general',
    descripcion: 'Las cifras del mes y los turnos que vienen.',
    accion: 'reserva',
  },
  clientes: {
    titulo: 'Clientes',
    descripcion: 'Quién reserva en tus canchas y desde cuándo.',
    accion: null,
  },
  canchas: {
    titulo: 'Canchas',
    descripcion: 'El catálogo que ven los clientes al reservar.',
    accion: 'cancha',
  },
  reservas: {
    titulo: 'Reservas',
    descripcion: 'Todos los turnos, de todos los clientes.',
    accion: 'reserva',
  },
}

/**
 * PanelAdmin — panel de control del administrador (§4.6, FASE 4).
 *
 * Armazón de dos columnas: `AdminSidebar` fija a la izquierda y, a la derecha,
 * una barra superior con el título de la sección más el contenido. Las cuatro
 * secciones (Resumen · Clientes · Canchas · Reservas) se cambian sin recargar.
 *
 * Todo el estado vive aquí: las tablas y los modales son presentacionales y
 * suben sus intenciones (guardar, borrar, cambiar estado) a esta página, que es
 * la única que habla con `src/api/`. Tras cada mutación se llama a `refetch()`
 * del hook correspondiente, de modo que la tabla refleja el mock con estado.
 *
 * Nota: el rol admin llegará con `useAuth` en la FASE 5; hasta entonces la
 * ruta `#/admin` es accesible directamente.
 *
 * @param {object} props
 * @param {(canchaId: number) => void} [props.onVerCancha]
 */
export function PanelAdmin({ onVerCancha }) {
  const [seccion, setSeccion] = useState('resumen')

  const { data: clientesData, loading: cargandoClientes, error: errorClientes } = useClientes()
  const { data: canchasData, loading: cargandoCanchas, refetch: refetchCanchas } = useCanchasAdmin()
  const { data: reservasData, loading: cargandoReservas, refetch: refetchReservas } =
    useReservasAdmin()

  const clientes = useMemo(() => clientesData ?? [], [clientesData])
  const canchas = useMemo(() => canchasData ?? [], [canchasData])
  const reservas = useMemo(() => reservasData ?? [], [reservasData])

  const reservasEnriquecidas = useMemo(() => {
    const porCancha = new Map(canchas.map((cancha) => [cancha.id, cancha]))
    const porCliente = new Map(clientes.map((cliente) => [cliente.id, cliente]))

    return reservas.map((reserva) => ({
      ...reserva,
      cancha: porCancha.get(reserva.canchaId) ?? null,
      cliente: porCliente.get(reserva.clienteId) ?? null,
    }))
  }, [reservas, canchas, clientes])

  /* ── Estado de los modales ───────────────────────────────────────────── */
  const [clienteDetalle, setClienteDetalle] = useState(null)
  const [formCancha, setFormCancha] = useState(null) // null | {cancha} | {}
  const [canchaAEliminar, setCanchaAEliminar] = useState(null)
  const [reservaManualOpen, setReservaManualOpen] = useState(false)
  const [filtroCliente, setFiltroCliente] = useState(null)

  const [enviando, setEnviando] = useState(false)
  const [formError, setFormError] = useState(null)
  const [confirmError, setConfirmError] = useState(null)

  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  function avisar(mensaje, tone = 'ok') {
    setToast({ mensaje, tone })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }

  const cargando = (cargandoClientes && !clientesData) || (cargandoCanchas && !canchasData) || (cargandoReservas && !reservasData)

  /* ── Acciones ────────────────────────────────────────────────────────── */

  async function guardarCancha(datos) {
    const editando = Boolean(formCancha?.cancha)
    setEnviando(true)
    setFormError(null)

    try {
      if (editando) await actualizar(formCancha.cancha.id, datos)
      else await crearCancha(datos)

      await refetchCanchas()
      setFormCancha(null)
      avisar(editando ? 'Cancha actualizada.' : 'Cancha creada.')
    } catch (error) {
      setFormError(error?.message ?? 'No se pudo guardar la cancha.')
    } finally {
      setEnviando(false)
    }
  }

  async function borrarCancha() {
    if (!canchaAEliminar) return
    setEnviando(true)
    setConfirmError(null)

    try {
      await eliminarCancha(canchaAEliminar.id)
      await refetchCanchas()
      setCanchaAEliminar(null)
      avisar('Cancha eliminada.')
    } catch (error) {
      setConfirmError(error?.message ?? 'No se pudo eliminar la cancha.')
    } finally {
      setEnviando(false)
    }
  }

  async function cambiarEstado(lista, estado) {
    const objetivo = Array.isArray(lista) ? lista : [lista]
    if (objetivo.length === 0) return

    try {
      await Promise.all(objetivo.map((reserva) => actualizarEstado(reserva.id, estado)))
      await refetchReservas()
      avisar(
        objetivo.length === 1
          ? `Reserva ${estado}.`
          : `${objetivo.length} reservas actualizadas.`,
      )
    } catch (error) {
      avisar(error?.message ?? 'No se pudo cambiar el estado.', 'danger')
    }
  }

  async function guardarReservaManual(datos) {
    setEnviando(true)
    setFormError(null)

    try {
      await crearReserva(datos)
      await refetchReservas()
      setReservaManualOpen(false)
      avisar('Reserva creada.')
    } catch (error) {
      setFormError(error?.message ?? 'No se pudo crear la reserva.')
    } finally {
      setEnviando(false)
    }
  }

  function verReservasDeCliente(cliente) {
    setClienteDetalle(null)
    setFiltroCliente(cliente)
    setSeccion('reservas')
  }

  const cabecera = CABECERAS[seccion]

  return (
    <div className="pa">
      <AdminSidebar
        seccion={seccion}
        onSeccion={setSeccion}
        cuentas={{ clientes: clientes.length, canchas: canchas.length, reservas: reservas.length }}
      />

      <div className="pa__contenido">
        <header className="pa__top">
          <div>
            <p className="pa__top-overline">Panel de administración</p>
            <h1 className="pa__top-titulo">{cabecera.titulo}</h1>
          </div>

          <div className="pa__top-derecha">
            <span className="pa__top-fecha u-tabular">
              <Icon name="calendar_today" size={18} />
              {formatFechaLarga(HOY_DEMO)}
            </span>

            {cabecera.accion === 'cancha' ? (
              <Button icon="add" onClick={() => setFormCancha({})}>
                Nueva cancha
              </Button>
            ) : cabecera.accion === 'reserva' ? (
              <Button icon="add" onClick={() => setReservaManualOpen(true)}>
                Nueva reserva manual
              </Button>
            ) : null}
          </div>
        </header>

        <main className="pa__main">
          {errorClientes && seccion === 'clientes' ? (
            <Alert tone="danger" title="No se pudieron cargar los clientes">
              {errorClientes.message}
            </Alert>
          ) : null}

          {cargando ? (
            <div className="pa__esqueleto">
              <Skeleton height={96} radius="var(--r-lg)" />
              <Skeleton height={280} radius="var(--r-lg)" />
            </div>
          ) : (
            <>
              {seccion === 'resumen' ? (
                <Resumen
                  clientes={clientes}
                  canchas={canchas}
                  reservas={reservas}
                  reservasEnriquecidas={reservasEnriquecidas}
                  onVerTodas={() => setSeccion('reservas')}
                />
              ) : null}

              {seccion === 'clientes' ? (
                <ClienteTable clientes={clientes} onVerDetalle={setClienteDetalle} />
              ) : null}

              {seccion === 'canchas' ? (
                <CanchaAdminTable
                  canchas={canchas}
                  onVer={onVerCancha}
                  onEditar={(cancha) => setFormCancha({ cancha })}
                  onEliminar={(cancha) => {
                    setConfirmError(null)
                    setCanchaAEliminar(cancha)
                  }}
                />
              ) : null}

              {seccion === 'reservas' ? (
                <ReservaAdminTable
                  reservas={
                    filtroCliente
                      ? reservasEnriquecidas.filter((r) => r.clienteId === filtroCliente.id)
                      : reservasEnriquecidas
                  }
                  onCambiarEstado={cambiarEstado}
                  clienteFiltro={filtroCliente}
                  onQuitarFiltro={() => setFiltroCliente(null)}
                />
              ) : null}
            </>
          )}
        </main>
      </div>

      {/* ── Modales ───────────────────────────────────────────────────────── */}
      <ClienteDetalleModal
        open={Boolean(clienteDetalle)}
        cliente={clienteDetalle}
        onCerrar={() => setClienteDetalle(null)}
        onVerReservas={verReservasDeCliente}
      />

      <CanchaForm
        open={Boolean(formCancha)}
        cancha={formCancha?.cancha ?? null}
        onGuardar={guardarCancha}
        onCerrar={() => {
          setFormCancha(null)
          setFormError(null)
        }}
        enviando={enviando}
        error={formError}
      />

      <ConfirmarModal
        open={Boolean(canchaAEliminar)}
        title="Eliminar cancha"
        description={
          canchaAEliminar ? (
            <>
              Vas a eliminar <strong>{canchaAEliminar.nombre}</strong>. Esta acción no se puede
              deshacer y la cancha dejará de aparecer en el catálogo.
            </>
          ) : null
        }
        confirmLabel="Eliminar"
        onConfirmar={borrarCancha}
        onCerrar={() => {
          setCanchaAEliminar(null)
          setConfirmError(null)
        }}
        enviando={enviando}
        error={confirmError}
      />

      <ReservaManualModal
        open={reservaManualOpen}
        clientes={clientes}
        canchas={canchas}
        hoy={HOY_DEMO}
        onCrear={guardarReservaManual}
        onCerrar={() => {
          setReservaManualOpen(false)
          setFormError(null)
        }}
        enviando={enviando}
        error={formError}
      />

      {toast ? (
        <div className="pa__toast">
          <Toast tone={toast.tone} title={toast.mensaje} onClose={() => setToast(null)} />
        </div>
      ) : null}
    </div>
  )
}

/** Sección Resumen: las cuatro métricas y los próximos turnos. */
function Resumen({ clientes, canchas, reservas, reservasEnriquecidas, onVerTodas }) {
  const proximos = useMemo(
    () => proximosTurnos(reservasEnriquecidas, HOY_DEMO, 6),
    [reservasEnriquecidas],
  )

  const columns = useMemo(
    () => [
      { key: 'fecha', header: 'Fecha', render: (r) => formatFecha(r.fecha) },
      {
        key: 'horario',
        header: 'Horario',
        render: (r) => <span className="u-tabular">{formatRangoHoras(r.horaInicio, r.horaFin)}</span>,
      },
      { key: 'cliente', header: 'Cliente', render: (r) => r.cliente?.nombre ?? '—' },
      { key: 'cancha', header: 'Cancha', render: (r) => r.cancha?.nombre ?? '—' },
      {
        key: 'total',
        header: 'Total',
        align: 'right',
        render: (r) => <span className="u-tabular">{formatMoneda(r.total)}</span>,
      },
      {
        key: 'estado',
        header: 'Estado',
        render: (r) => {
          const meta = ESTADOS_RESERVA[r.estado] ?? { label: r.estado, tone: 'neutral' }
          return <Badge tone={meta.tone}>{meta.label}</Badge>
        },
      },
    ],
    [],
  )

  return (
    <>
      <StatsCards clientes={clientes} canchas={canchas} reservas={reservas} hoy={HOY_DEMO} />

      <section className="pa__bloque">
        <div className="pa__bloque-cabecera">
          <div>
            <h2 className="pa__bloque-titulo">Próximos turnos</h2>
            <p className="pa__bloque-descripcion">Los siguientes seis turnos a partir de hoy.</p>
          </div>
          <Button variant="ghost" size="sm" iconRight="arrow_forward" onClick={onVerTodas}>
            Ver todas
          </Button>
        </div>

        <DataTable
          columns={columns}
          rows={proximos}
          stack
          emptyMessage="No hay turnos próximos"
        />
      </section>
    </>
  )
}
