import { useMemo, useState } from 'react'
import {
  CalificarReservaModal,
  CancelarReservaModal,
  ReservaList,
} from '../components/reservas/index.js'
import { Button } from '../components/ui/Button.jsx'
import { Chip, ChipRow } from '../components/ui/Chip.jsx'
import { Alert, EmptyState, Skeleton, Toast } from '../components/ui/Feedback.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { cancelar } from '../api/reservas.js'
import { useReservas } from '../hooks/useReservas.js'
import { CANCHAS, USUARIO_DEMO } from '../lib/mockData.js'
import { DEPORTES } from '../lib/deportes.js'
import { cx } from '../lib/cx.js'
import {
  ETIQUETA_GRUPO,
  GRUPOS,
  contar,
  enriquecer,
  filtrar,
} from '../lib/filtroReservas.js'
import { descargarTexto, reservasACSV } from '../lib/comprobante.js'
import { formatMoneda } from '../lib/format.js'
import './MisReservas.css'

/**
 * MisReservas — historial y gestión de turnos (§4.4, FASE 3).
 *
 * Portado de `mis_reservas` de Stitch. La página es quien posee el estado
 * (pestaña, filtro, página, modales) y quien habla con `api/reservas.js`; los
 * componentes de `components/reservas/` solo pintan.
 *
 * Desviaciones conscientes del diseño de Stitch, por coherencia con el resto
 * de la app:
 *   - la política de cancelación es de **24 h** (como el detalle de cancha y
 *     `puedeCancelar`), no de 6 h;
 *   - no hay cabecera global ni pie de página: son del armazón, no de la vista;
 *   - "Invitar amigos" y "Escribir por WhatsApp" no se portan: necesitan
 *     compartir y un canal de soporte que todavía no existen.
 *
 * El cliente es `USUARIO_DEMO` mientras no exista `useAuth` (FASE 5): cuando
 * llegue la sesión, aquí solo cambia de dónde sale el `clienteId`.
 *
 * @param {object} props
 * @param {number} [props.clienteId]                       dueño de las reservas
 * @param {(canchaId: number) => void} [props.onVerCancha]  ir a la ficha
 * @param {() => void} [props.onExplorar]                   ir al catálogo
 */

/** Filtros de deporte. `todas` no filtra; el color sale del token del deporte. */
const DEPORTES_FILTRO = [
  { key: 'todas', label: 'Todos', icono: 'check' },
  { key: 'futbol', label: 'Fútbol' },
  { key: 'padel', label: 'Pádel' },
  { key: 'basquet', label: 'Básquet' },
  { key: 'tenis', label: 'Tenis' },
  { key: 'voley', label: 'Vóley' },
]

/** Turnos por página. Coincide con el `slice` de la paginación. */
const POR_PAGINA = 5

/** Mensaje legible de un error que viene de la capa de API. */
function mensajeDeError(error) {
  return error?.message ?? 'No se pudo completar la operación. Inténtalo de nuevo.'
}

/** Texto del estado vacío, distinto según lo que se esté mirando. */
function vacioDe(grupo, hayOtras) {
  if (hayOtras) {
    return {
      icon: 'filter_alt_off',
      title: 'Sin resultados con ese filtro',
      description: 'Prueba con otro deporte o mira todas las reservas.',
    }
  }

  const porGrupo = {
    proximas: {
      icon: 'event_available',
      title: 'No tienes turnos próximos',
      description: 'Cuando reserves una cancha, tu próximo partido aparecerá aquí.',
    },
    pasadas: {
      icon: 'history',
      title: 'Todavía no has jugado',
      description: 'Los turnos que ya pasaron quedarán en este historial.',
    },
    canceladas: {
      icon: 'event_busy',
      title: 'No has cancelado ningún turno',
      description: 'Aquí verás los turnos que canceles, con su devolución.',
    },
    todas: {
      icon: 'sports_soccer',
      title: 'Aún no tienes reservas',
      description: 'Explora las canchas disponibles y reserva tu primer turno.',
    },
  }

  return porGrupo[grupo] ?? porGrupo.todas
}

export function MisReservas({ clienteId = USUARIO_DEMO.id, onVerCancha, onExplorar }) {
  const { data, loading, error, refetch } = useReservas({ clienteId })

  const [grupo, setGrupo] = useState('proximas')
  const [deporte, setDeporte] = useState('todas')
  const [pagina, setPagina] = useState(1)
  const [calificadas, setCalificadas] = useState(() => new Set())
  const [aviso, setAviso] = useState(null)

  const [paraCancelar, setParaCancelar] = useState(null)
  const [cancelando, setCancelando] = useState(false)
  const [errorCancelar, setErrorCancelar] = useState(null)

  const [paraCalificar, setParaCalificar] = useState(null)

  /** Se fija una vez por montaje para que la clasificación sea estable. */
  const ahora = useMemo(() => new Date(), [])

  const reservas = useMemo(() => enriquecer(data ?? [], CANCHAS), [data])
  const conteos = useMemo(() => contar(reservas, ahora), [reservas, ahora])
  const visibles = useMemo(
    () => filtrar(reservas, { grupo, deporte, hoy: ahora }),
    [reservas, grupo, deporte, ahora],
  )

  const totalPaginas = Math.max(1, Math.ceil(visibles.length / POR_PAGINA))
  const paginaActual = Math.min(pagina, totalPaginas)
  const enPagina = visibles.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA)

  function elegirGrupo(clave) {
    setGrupo(clave)
    setPagina(1)
  }

  function elegirDeporte(clave) {
    setDeporte(clave)
    setPagina(1)
  }

  function descargarComprobantes() {
    const contenido = `\uFEFF${reservasACSV(visibles, CANCHAS)}`

    if (descargarTexto('mis-reservas.csv', contenido)) {
      setAviso({
        tone: 'ok',
        title: 'Comprobantes descargados',
        texto: `${visibles.length} ${visibles.length === 1 ? 'turno' : 'turnos'} en un archivo CSV.`,
      })
    }
  }

  async function confirmarCancelacion() {
    if (!paraCancelar) return

    const reserva = paraCancelar
    setCancelando(true)
    setErrorCancelar(null)

    try {
      await cancelar(reserva.id)
      refetch()
      setAviso({
        tone: 'ok',
        title: 'Turno cancelado',
        texto: `${reserva.codigo} quedó cancelado. Te devolvemos ${formatMoneda(reserva.total)}.`,
      })
      setParaCancelar(null)
    } catch (fallo) {
      setErrorCancelar(mensajeDeError(fallo))
    } finally {
      setCancelando(false)
    }
  }

  function enviarCalificacion({ puntos, comentario }) {
    if (!paraCalificar) return

    setCalificadas((previas) => new Set(previas).add(paraCalificar.id))
    setAviso({
      tone: 'ok',
      title: '¡Gracias por tu calificación!',
      texto: `${puntos} de 5 estrellas${comentario ? ' con tu comentario' : ''}.`,
    })
    setParaCalificar(null)
  }

  const cargandoSinDatos = loading && !data
  const hayOtraCosa = conteos[grupo] > 0 && visibles.length === 0
  const vacio = vacioDe(grupo, hayOtraCosa)

  return (
    <main className="mr">
      <nav className="mr__migas" aria-label="Miga de pan">
        <button type="button" className="mr__miga" onClick={onExplorar}>
          Inicio
        </button>
        <Icon name="chevron_right" size={18} />
        <span aria-current="page">Mis reservas</span>
      </nav>

      <header className="mr__head">
        <div className="mr__headtext">
          <span className="u-overline">Gestión de usuario</span>
          <h1>Mis reservas</h1>
          <p>Consulta el historial y gestiona tus turnos deportivos programados.</p>
        </div>

        <Button
          variant="secondary"
          icon="download"
          onClick={descargarComprobantes}
          disabled={visibles.length === 0}
          title="Descarga en CSV los turnos que estás viendo"
        >
          Descargar comprobantes
        </Button>
      </header>

      <div className="mr__tabs" role="tablist" aria-label="Estado de las reservas">
        {GRUPOS.map((clave) => (
          <button
            key={clave}
            type="button"
            role="tab"
            aria-selected={grupo === clave}
            className={cx('mr__tab', grupo === clave && 'mr__tab--on')}
            onClick={() => elegirGrupo(clave)}
          >
            {ETIQUETA_GRUPO[clave]}
            <span className="mr__tabcount u-tabular">{conteos[clave]}</span>
          </button>
        ))}
      </div>

      <div className="mr__filtros">
        <span className="mr__filtrolabel">Filtrar:</span>

        <ChipRow>
          {DEPORTES_FILTRO.map((filtro) => (
            <Chip
              key={filtro.key}
              selected={deporte === filtro.key}
              icon={filtro.icono}
              dot={filtro.key === 'todas' ? undefined : DEPORTES[filtro.key]?.color}
              onClick={() => elegirDeporte(filtro.key)}
            >
              {filtro.label}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="mr__grid">
        <section className="mr__main" aria-label="Listado de reservas">
          {error ? (
            <Alert tone="danger" title="No pudimos cargar tus reservas">
              {mensajeDeError(error)}
            </Alert>
          ) : (
            <p className="mr__count">
              <Icon name="info" size={18} />
              Mostrando {visibles.length} {visibles.length === 1 ? 'turno' : 'turnos'} ·{' '}
              {ETIQUETA_GRUPO[grupo]}
            </p>
          )}

          {cargandoSinDatos ? (
            <ul className="mr__lista" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <li key={i} className="mr__item">
                  <div className="c-turno c-turno--esqueleto">
                    <Skeleton width="96px" height="128px" radius="var(--r-lg)" />
                    <div className="c-turno__body">
                      <Skeleton width="40%" height="20px" />
                      <Skeleton width="70%" height="26px" />
                      <Skeleton width="55%" height="16px" />
                      <Skeleton width="80%" height="16px" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : visibles.length === 0 && !error ? (
            <EmptyState
              icon={vacio.icon}
              title={vacio.title}
              description={vacio.description}
              action={
                hayOtraCosa ? (
                  <Button variant="secondary" icon="restart_alt" onClick={() => elegirDeporte('todas')}>
                    Ver todos los deportes
                  </Button>
                ) : (
                  <Button icon="search" onClick={onExplorar}>
                    Explorar canchas
                  </Button>
                )
              }
            />
          ) : (
            <ReservaList
              reservas={enPagina}
              ahora={ahora}
              calificadas={calificadas}
              onVerDetalle={(reserva) => onVerCancha?.(reserva.canchaId)}
              onCancelar={(reserva) => {
                setErrorCancelar(null)
                setParaCancelar(reserva)
              }}
              onCalificar={(reserva) => setParaCalificar(reserva)}
            />
          )}

          {totalPaginas > 1 ? (
            <nav className="mr__pager" aria-label="Paginación">
              <Button
                variant="ghost"
                size="sm"
                icon="chevron_left"
                iconOnly
                aria-label="Página anterior"
                disabled={paginaActual === 1}
                onClick={() => setPagina(paginaActual - 1)}
              />

              <span className="mr__pagerinfo">
                Página <b className="u-tabular">{paginaActual}</b> de{' '}
                <b className="u-tabular">{totalPaginas}</b> ({visibles.length}{' '}
                {visibles.length === 1 ? 'turno' : 'turnos'} en total)
              </span>

              <Button
                variant="ghost"
                size="sm"
                icon="chevron_right"
                iconOnly
                aria-label="Página siguiente"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPagina(paginaActual + 1)}
              />
            </nav>
          ) : null}
        </section>

        <aside className="mr__aside">
          <section className="mr__panel">
            <h2 className="mr__panelhead">
              <Icon name="verified_user" size={20} />
              Política de cancelación
            </h2>

            <p className="mr__paneltext">
              Puedes cancelar cualquier turno con derecho a reembolso total hasta con{' '}
              <strong>24 horas de anticipación</strong> al inicio del partido.
            </p>

            <ul className="mr__panelist">
              <li className="mr__panelitem mr__panelitem--ok">
                <Icon name="check" size={18} />
                Más de 24 h antes: reembolso del 100% automático al medio de pago.
              </li>
              <li className="mr__panelitem">
                <Icon name="schedule" size={18} />
                Menos de 24 h: sin reembolso ni reprogramación.
              </li>
              <li className="mr__panelitem">
                <Icon name="umbrella" size={18} />
                Cancelado por lluvia: reprogramación sin costo o reembolso total.
              </li>
            </ul>
          </section>

          <section className="mr__panel">
            <h2 className="mr__panelhead">
              <Icon name="headset_mic" size={20} />
              Atención al deportista
            </h2>

            <p className="mr__paneltext u-tabular">Lunes a Domingo · 07:00 a 23:00</p>

            <p className="mr__paneltext">
              ¿Problemas climáticos en la sede o necesitas mover el horario de tu partido? Nuestro
              equipo te responde en minutos.
            </p>

            <a className="mr__panelcontacto" href="tel:+5716013456789">
              <Icon name="call" size={18} />
              (601) 345 6789
            </a>
          </section>

          <section className="mr__cta">
            <Icon name="sports_soccer" size={28} />
            <h2>¿Listo para otro partido?</h2>
            <p>Encuentra más canchas disponibles hoy.</p>

            <Button variant="secondary" iconRight="chevron_right" onClick={onExplorar}>
              Reservar otra cancha
            </Button>
          </section>
        </aside>
      </div>

      {aviso ? (
        <div className="mr__aviso">
          <Toast tone={aviso.tone} title={aviso.title} onClose={() => setAviso(null)}>
            {aviso.texto}
          </Toast>
        </div>
      ) : null}

      <CancelarReservaModal
        open={Boolean(paraCancelar)}
        reserva={paraCancelar}
        cancha={paraCancelar?.cancha ?? null}
        enviando={cancelando}
        error={errorCancelar}
        onConfirmar={confirmarCancelacion}
        onCerrar={() => {
          setParaCancelar(null)
          setErrorCancelar(null)
        }}
      />

      <CalificarReservaModal
        key={paraCalificar?.id ?? 'calificar'}
        open={Boolean(paraCalificar)}
        reserva={paraCalificar}
        cancha={paraCalificar?.cancha ?? null}
        onEnviar={enviarCalificacion}
        onCerrar={() => setParaCalificar(null)}
      />
    </main>
  )
}
