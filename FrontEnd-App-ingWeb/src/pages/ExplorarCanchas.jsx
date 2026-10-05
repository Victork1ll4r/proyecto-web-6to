import { useMemo, useState } from 'react'
import { Button, CanchaCard, Chip, Icon, Select } from '../components/ui/index.js'
import { CANCHAS, ZONAS } from '../lib/mockData.js'
import {
  CRITERIOS_INICIALES,
  SUPERFICIES,
  filtrarCanchas,
  hayFiltrosActivos,
} from '../lib/filtroCanchas.js'
import './ExplorarCanchas.css'

/**
 * ExplorarCanchas — catálogo de canchas (§4.2 del sistema de diseño).
 *
 * Portado desde la pantalla equivalente generada en Google Stitch. Los
 * radios, colores y tipografías pasan por tokens; no queda ningún hex aquí.
 *
 * Nota sobre los datos: las canchas y zonas son locales. El backend solo
 * expone /api/clientes (DESIGN_SYSTEM §6), así que el fetching del catálogo
 * queda pendiente de que existan los endpoints de cancha.
 */

/** Filtros de deporte. `todas` no filtra. */
const DEPORTES = [
  { key: 'todas', label: 'Todos', icono: 'check' },
  { key: 'futbol', label: 'Fútbol' },
  { key: 'padel', label: 'Pádel' },
  { key: 'basquet', label: 'Básquet' },
  { key: 'tenis', label: 'Tenis' },
  { key: 'voley', label: 'Vóley' },
]

export function ExplorarCanchas({ onReservar }) {
  const [criterios, setCriterios] = useState(CRITERIOS_INICIALES)
  const { deporte, zona, superficie, techada, iluminacion, busqueda } = criterios

  const resultados = useMemo(() => filtrarCanchas(CANCHAS, criterios), [criterios])

  const actualizar = (cambio) => setCriterios((prev) => ({ ...prev, ...cambio }))

  const hayFiltros = hayFiltrosActivos(criterios)

  function limpiar() {
    setCriterios(CRITERIOS_INICIALES)
  }

  return (
    <div className="ec">
      {/* Encabezado --------------------------------------------------- */}
      <section className="ec__head">
        <div className="ec__headtext">
          <span className="u-overline">Explorar catálogo</span>
          <h1>Encuentra tu cancha</h1>
          <p className="u-muted">
            Reserva canchas de fútbol, pádel, tenis y básquet por hora en tiempo real.
          </p>
        </div>

        <p className="ec__live">
          <span className="ec__dot" aria-hidden="true" />
          <span className="u-tabular">{resultados.length} canchas disponibles hoy</span>
        </p>
      </section>

      {/* Barra de filtros --------------------------------------------- */}
      <div className="ec__filters">
        <div className="ec__filtersinner">
          <div className="ec__search">
            <Icon name="search" size={20} className="ec__searchicon" />
            <input
              className="ec__searchinput"
              type="search"
              value={busqueda}
              onChange={(e) => actualizar({ busqueda: e.target.value })}
              placeholder="Buscar por nombre, barrio o club…"
              aria-label="Buscar canchas"
            />
          </div>

          <div className="ec__chips" role="group" aria-label="Filtrar por deporte">
            {DEPORTES.map((d) => (
              <Chip
                key={d.key}
                selected={deporte === d.key}
                icon={d.icono}
                onClick={() => actualizar({ deporte: d.key })}
              >
                {d.label}
              </Chip>
            ))}
          </div>

          <div className="ec__extras">
            <Select aria-label="Filtrar por zona" value={zona} onChange={(e) => actualizar({ zona: e.target.value })}>
              {ZONAS.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </Select>

            <Select
              aria-label="Filtrar por superficie"
              value={superficie}
              onChange={(e) => actualizar({ superficie: e.target.value })}
            >
              {SUPERFICIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>

            <Chip
              icon="roofing"
              selected={techada}
              onClick={() => actualizar({ techada: !techada })}
            >
              Techada
            </Chip>

            <Chip
              icon="lightbulb"
              selected={iluminacion}
              onClick={() => actualizar({ iluminacion: !iluminacion })}
            >
              Iluminación
            </Chip>
          </div>
        </div>
      </div>

      {/* Resultados --------------------------------------------------- */}
      <main className="ec__main">
        {hayFiltros ? (
          <div className="ec__resultbar">
            <p className="u-muted">
              <strong className="u-tabular">{resultados.length}</strong>{' '}
              {resultados.length === 1 ? 'cancha coincide' : 'canchas coinciden'}
            </p>
            <Button variant="ghost" size="sm" icon="close" onClick={limpiar}>
              Limpiar filtros
            </Button>
          </div>
        ) : null}

        {resultados.length === 0 ? (
          <div className="ec__empty">
            <span className="ec__emptyicon">
              <Icon name="search_off" size={40} />
            </span>
            <h2 className="ec__emptytitle">Sin canchas que coincidan</h2>
            <p className="u-muted ec__emptytext">
              Prueba con otro deporte, otra zona o quita los filtros activos.
            </p>
            <Button icon="filter_alt_off" onClick={limpiar}>
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="ec__grid">
            {resultados.map((cancha) => (
              <CanchaCard key={cancha.id} cancha={cancha} onReservar={onReservar} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}