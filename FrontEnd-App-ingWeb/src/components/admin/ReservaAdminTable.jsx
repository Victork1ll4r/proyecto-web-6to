import { useMemo, useState } from 'react'
import { Badge, Chip } from '../ui/Chip.jsx'
import { Button } from '../ui/Button.jsx'
import { DataTable, TableAction } from '../ui/DataTable.jsx'
import { Input, Select } from '../ui/Field.jsx'
import { ESTADOS_RESERVA } from '../../lib/deportes.js'
import { comparar } from '../../lib/orden.js'
import { descargarReservas } from '../../lib/exportarTablas.js'
import { formatFecha, formatMoneda, formatRangoHoras } from '../../lib/format.js'

/** Estados por los que se puede filtrar, en orden de ciclo de vida. */
const FILTROS = ['confirmada', 'pendiente', 'completada', 'cancelada', 'rechazada']

/**
 * ReservaAdminTable — vista global de reservas (§4.6, FASE 4.1).
 *
 * Todas las reservas de todos los clientes, enriquecidas con el nombre del
 * cliente y de la cancha. Filtros por estado y texto, paginación, selección
 * múltiple con confirmar/cancelar en bloque y exportación. Los cambios de
 * estado los aplica la página con `api/reservas.actualizarEstado`.
 *
 * @param {object} props
 * @param {Array<import('../../api/types.js').Reserva & {cancha?: object|null, cliente?: object|null}>} props.reservas
 * @param {(reservas: object[], estado: string) => void} props.onCambiarEstado
 * @param {() => void} [props.onQuitarFiltro]
 * @param {object|null} [props.clienteFiltro]  cliente por el que se está filtrando
 */
export function ReservaAdminTable({ reservas, onCambiarEstado, onQuitarFiltro, clienteFiltro = null }) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todas')

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return reservas.filter((reserva) => {
      if (estado !== 'todas' && reserva.estado !== estado) return false
      if (!q) return true

      return [reserva.codigo, reserva.cliente?.nombre, reserva.cancha?.nombre].some((valor) =>
        String(valor ?? '').toLowerCase().includes(q),
      )
    })
  }, [reservas, busqueda, estado])

  const columns = useMemo(
    () => [
      { key: 'codigo', header: 'Código', sortable: true },
      {
        key: 'cliente',
        header: 'Cliente',
        sortable: true,
        sorter: (a, b) => comparar(a.cliente?.nombre, b.cliente?.nombre),
        render: (reserva) => (
          <span className="pa__celda-fuerte">{reserva.cliente?.nombre ?? '—'}</span>
        ),
      },
      {
        key: 'cancha',
        header: 'Cancha',
        render: (reserva) => reserva.cancha?.nombre ?? '—',
      },
      { key: 'fecha', header: 'Fecha', sortable: true, render: (reserva) => formatFecha(reserva.fecha) },
      {
        key: 'horario',
        header: 'Horario',
        render: (reserva) => (
          <span className="u-tabular">{formatRangoHoras(reserva.horaInicio, reserva.horaFin)}</span>
        ),
      },
      {
        key: 'total',
        header: 'Total',
        align: 'right',
        sortable: true,
        render: (reserva) => <span className="u-tabular">{formatMoneda(reserva.total)}</span>,
      },
      {
        key: 'estado',
        header: 'Estado',
        render: (reserva) => {
          const meta = ESTADOS_RESERVA[reserva.estado] ?? { label: reserva.estado, tone: 'neutral' }
          return <Badge tone={meta.tone}>{meta.label}</Badge>
        },
      },
      {
        key: 'acciones',
        header: 'Acciones',
        align: 'right',
        render: (reserva) => (
          <div className="c-table__actions">
            {reserva.estado === 'pendiente' ? (
              <TableAction
                icon="check_circle"
                label={`Confirmar ${reserva.codigo}`}
                onClick={() => onCambiarEstado([reserva], 'confirmada')}
              />
            ) : null}

            {reserva.estado === 'confirmada' || reserva.estado === 'pendiente' ? (
              <TableAction
                icon="cancel"
                label={`Cancelar ${reserva.codigo}`}
                danger
                onClick={() => onCambiarEstado([reserva], 'cancelada')}
              />
            ) : null}
          </div>
        ),
      },
    ],
    [onCambiarEstado],
  )

  return (
    <div className="pa__bloque">
      <div className="pa__toolbar">
        <div className="pa__toolbar-buscar">
          <Input
            icon="search"
            type="search"
            placeholder="Buscar por código, cliente o cancha"
            aria-label="Buscar reservas"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        <Select
          aria-label="Filtrar por estado"
          value={estado}
          onChange={(event) => setEstado(event.target.value)}
          className="pa__toolbar-select"
        >
          <option value="todas">Todos los estados</option>
          {FILTROS.map((clave) => (
            <option key={clave} value={clave}>
              {ESTADOS_RESERVA[clave]?.label ?? clave}
            </option>
          ))}
        </Select>

        {clienteFiltro ? (
          <Chip icon="person" onClick={onQuitarFiltro}>
            {clienteFiltro.nombre}
            <span className="u-muted"> · quitar</span>
          </Chip>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        rows={filtradas}
        selectable
        stack
        pageSize={8}
        paginadorEtiqueta="reservas"
        emptyMessage="Ninguna reserva coincide con el filtro"
        bulkBar={({ clear, selected }) => (
          <>
            <Button
              variant="secondary"
              size="sm"
              icon="check_circle"
              onClick={() => {
                onCambiarEstado(filtradas.filter((r) => selected.has(r.id)), 'confirmada')
                clear()
              }}
            >
              Confirmar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="cancel"
              onClick={() => {
                onCambiarEstado(filtradas.filter((r) => selected.has(r.id)), 'cancelada')
                clear()
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="download"
              onClick={() => descargarReservas(filtradas.filter((r) => selected.has(r.id)))}
            >
              Exportar
            </Button>
          </>
        )}
      />
    </div>
  )
}
