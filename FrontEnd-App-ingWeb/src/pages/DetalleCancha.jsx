import { useMemo, useState } from 'react'
import { CanchaDetail, ReservaModal, TarjetaReserva } from '../components/canchas/index.js'
import { Button } from '../components/ui/Button.jsx'
import { Alert, EmptyState, Medallion, Skeleton } from '../components/ui/Feedback.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { useCanchaDetail } from '../hooks/useCanchaDetail.js'
import { useDisponibilidad } from '../hooks/useDisponibilidad.js'
import { crear } from '../api/reservas.js'
import { USUARIO_DEMO } from '../lib/mockData.js'
import {
  formatFechaLarga,
  formatMoneda,
  formatRangoHoras,
  horaFin,
  proximosDias,
} from '../lib/format.js'
import './DetalleCancha.css'

/**
 * DetalleCancha — detalle y reserva de una cancha (§4.3, FASE 2).
 *
 * Portado de `detalle_y_reserva_de_cancha` de Stitch. La página es quien
 * posee el estado (día elegido, turnos seleccionados, modal) y quien habla con
 * la API; los componentes de `components/canchas/` solo pintan.
 *
 * @param {{id: string, onVolver: () => void}} props
 */
export function DetalleCancha({ id, onVolver }) {
  const dias = useMemo(() => proximosDias(7), [])
  const [dia, setDia] = useState(() => dias[0].iso)
  const [seleccion, setSeleccion] = useState([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorReserva, setErrorReserva] = useState(null)
  const [reservaCreada, setReservaCreada] = useState(null)
  const [emailContacto, setEmailContacto] = useState('')

  const { data: cancha, loading, error, refetch } = useCanchaDetail(id)
  const { data: disponibilidad, loading: cargandoSlots } = useDisponibilidad(id, dia)

  const slots = disponibilidad?.slots ?? []

  const indices = [...seleccion].sort((a, b) => a - b)
  const horas = indices.length
  const total = (cancha?.precioHora ?? 0) * horas
  const primera = horas > 0 ? slots[indices[0]]?.hora : null
  const fin = horas > 0 ? slots[indices[indices.length - 1]]?.hora : null
  const rango = primera && fin ? formatRangoHoras(primera, horaFin(fin, 1)) : ''

  function cambiarDia(iso) {
    if (iso === dia) return
    setDia(iso)
    setSeleccion([])
  }

  async function confirmar(datosContacto) {
    setEnviando(true)
    setErrorReserva(null)

    try {
      const reserva = await crear({
        canchaId: cancha.id,
        // Provisional: la sesión real llega con useAuth en la FASE 5.
        clienteId: USUARIO_DEMO.id,
        fecha: dia,
        horaInicio: primera,
        horaFin: horaFin(fin, 1),
        total,
      })

      setReservaCreada(reserva)
      setEmailContacto(datosContacto.email)
      setModalAbierto(false)
      setSeleccion([])
    } catch (fallo) {
      setErrorReserva(fallo?.message ?? 'No pudimos confirmar la reserva. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  /* ── Carga ─────────────────────────────────────────────────────────── */
  if (loading && !cancha) {
    return (
      <div className="dc">
        <div className="dc__grid">
          <div className="dc__skeletonmain">
            <Skeleton height="320px" radius="var(--r-lg)" />
            <Skeleton width="60%" height="34px" />
            <Skeleton width="40%" height="18px" />
            <Skeleton height="140px" radius="var(--r-lg)" />
          </div>
          <Skeleton height="440px" radius="var(--r-lg)" />
        </div>
      </div>
    )
  }

  /* ── Error / no encontrada ─────────────────────────────────────────── */
  if (error || !cancha) {
    return (
      <div className="dc dc--center">
        <EmptyState
          icon="search_off"
          tone="danger"
          title="No encontramos esa cancha"
          description="Puede que el enlace esté roto o que la cancha ya no esté publicada. Vuelve al catálogo para ver las que sí están disponibles."
          action={
            <div className="dc__acciones">
              <Button variant="secondary" icon="refresh" onClick={refetch}>
                Reintentar
              </Button>
              <Button icon="arrow_back" onClick={onVolver}>
                Volver al catálogo
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  /* ── Contenido ─────────────────────────────────────────────────────── */
  return (
    <div className="dc">
      <nav className="dc__migas" aria-label="Ruta de navegación">
        <button type="button" className="dc__miga" onClick={onVolver}>
          <Icon name="home" size={18} />
          Canchas
        </button>
        <Icon name="chevron_right" size={18} className="dc__migasep" />
        <span className="dc__migaactual">{cancha.nombre}</span>
      </nav>

      <div className="dc__grid">
        <CanchaDetail cancha={cancha} />

        <aside className="dc__aside" aria-label="Reserva">
          {reservaCreada ? (
            <div className="c-reserva c-reserva--ok">
              <Medallion icon="check_circle" />
              <h2 className="c-reserva__oktitle">Reserva confirmada</h2>
              <p className="c-reserva__oktext">
                Guarda tu código <strong className="u-mono">{reservaCreada.codigo}</strong>.
              </p>

              <dl className="c-resumen">
                <div className="c-resumen__row">
                  <dt>Cancha</dt>
                  <dd>{cancha.nombre}</dd>
                </div>
                <div className="c-resumen__row">
                  <dt>Fecha</dt>
                  <dd>{formatFechaLarga(reservaCreada.fecha)}</dd>
                </div>
                <div className="c-resumen__row">
                  <dt>Horario</dt>
                  <dd className="u-tabular">
                    {formatRangoHoras(reservaCreada.horaInicio, reservaCreada.horaFin)}
                  </dd>
                </div>
                <div className="c-resumen__row c-resumen__row--total">
                  <dt>Total</dt>
                  <dd className="u-tabular">{formatMoneda(reservaCreada.total)}</dd>
                </div>
              </dl>

              {emailContacto ? (
                <Alert tone="ok">Te enviamos la confirmación a {emailContacto}.</Alert>
              ) : null}

              <Button fullWidth icon="arrow_back" onClick={onVolver}>
                Volver al catálogo
              </Button>
            </div>
          ) : (
            <TarjetaReserva
              cancha={cancha}
              dias={dias}
              dia={dia}
              onDia={cambiarDia}
              slots={slots}
              seleccion={seleccion}
              onSeleccion={setSeleccion}
              cargando={cargandoSlots}
              onReservar={() => {
                setErrorReserva(null)
                setModalAbierto(true)
              }}
            />
          )}
        </aside>
      </div>

      <ReservaModal
        open={modalAbierto}
        canchaNombre={cancha.nombre}
        dia={dia}
        rango={rango}
        horas={horas}
        total={total}
        enviando={enviando}
        error={errorReserva}
        onConfirm={confirmar}
        onCancel={() => setModalAbierto(false)}
      />
    </div>
  )
}
