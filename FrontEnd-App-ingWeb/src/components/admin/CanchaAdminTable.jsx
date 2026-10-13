import { useMemo, useState } from 'react'
import { Badge, Chip } from '../ui/Chip.jsx'
import { DataTable, TableAction } from '../ui/DataTable.jsx'
import { Icon } from '../ui/Icon.jsx'
import { Input, Select } from '../ui/Field.jsx'
import { DEPORTES, ESTADOS_CANCHA, getDeporte } from '../../lib/deportes.js'
import { comparar } from '../../lib/orden.js'
import { formatPrecioHora } from '../../lib/format.js'

/**
 * CanchaAdminTable — CRUD de canchas (§4.6, FASE 4.1).
 *
 * Lista con búsqueda, filtro por deporte y por estado. Las acciones (ver,
 * editar y borrar) no tocan la API: suben a la página, que abre el modal,
 * confirma el borrado o navega al catálogo.
 *
 * @param {object} props
 * @param {import('../../api/types.js').Cancha[]} props.canchas
 * @param {(cancha: import('../../api/types.js').Cancha) => void} props.onEditar
 * @param {(cancha: import('../../api/types.js').Cancha) => void} props.onEliminar
 * @param {(canchaId: number) => void} [props.onVer]
 */
export function CanchaAdminTable({ canchas, onEditar, onEliminar, onVer }) {
  const [busqueda, setBusqueda] = useState('')
  const [deporte, setDeporte] = useState('todos')
  const [estado, setEstado] = useState('todos')

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return canchas.filter((cancha) => {
      if (deporte !== 'todos' && cancha.deporte !== deporte) return false
      if (estado !== 'todos' && (cancha.estado ?? 'disponible') !== estado) return false
      if (!q) return true

      return [cancha.nombre, cancha.zona, cancha.sede].some((valor) =>
        String(valor ?? '').toLowerCase().includes(q),
      )
    })
  }, [canchas, busqueda, deporte, estado])

  const columns = useMemo(
    () => [
      {
        key: 'nombre',
        header: 'Cancha',
        sortable: true,
        render: (cancha) => (
          <div>
            <p className="pa__celda-fuerte">{cancha.nombre}</p>
            <p className="pa__celda-suave">
              {cancha.sede} · {cancha.zona}
            </p>
          </div>
        ),
      },
      {
        key: 'deporte',
        header: 'Deporte',
        sortable: true,
        sorter: (a, b) => comparar(getDeporte(a.deporte).label, getDeporte(b.deporte).label),
        render: (cancha) => {
          const deporte = getDeporte(cancha.deporte)
          return (
            <Chip dot={deporte.color} icon={deporte.icon}>
              {deporte.label}
            </Chip>
          )
        },
      },
      {
        key: 'precioHora',
        header: 'Precio',
        align: 'right',
        sortable: true,
        render: (cancha) => (
          <span className="u-tabular">
            {formatPrecioHora(cancha.precioHora)}
            <span className="u-muted"> /hora</span>
          </span>
        ),
      },
      {
        key: 'puntuacion',
        header: 'Valoración',
        align: 'right',
        sortable: true,
        render: (cancha) =>
          cancha.puntuacion ? (
            <span className="pa__valoracion u-tabular">
              <Icon name="star" size={16} fill />
              {cancha.puntuacion.toFixed(1)}
            </span>
          ) : (
            <span className="u-muted">Sin reseñas</span>
          ),
      },
      {
        key: 'estado',
        header: 'Estado',
        render: (cancha) => {
          const meta = ESTADOS_CANCHA[cancha.estado ?? 'disponible'] ?? ESTADOS_CANCHA.disponible
          return <Badge tone={meta.tone}>{meta.label}</Badge>
        },
      },
      {
        key: 'acciones',
        header: 'Acciones',
        align: 'right',
        render: (cancha) => (
          <div className="c-table__actions">
            {onVer ? (
              <TableAction
                icon="visibility"
                label={`Ver ${cancha.nombre} en el catálogo`}
                onClick={() => onVer(cancha.id)}
              />
            ) : null}
            <TableAction
              icon="edit"
              label={`Editar ${cancha.nombre}`}
              onClick={() => onEditar(cancha)}
            />
            <TableAction
              icon="delete"
              label={`Eliminar ${cancha.nombre}`}
              danger
              onClick={() => onEliminar(cancha)}
            />
          </div>
        ),
      },
    ],
    [onEditar, onEliminar, onVer],
  )

  return (
    <div className="pa__bloque">
      <div className="pa__toolbar">
        <div className="pa__toolbar-buscar">
          <Input
            icon="search"
            type="search"
            placeholder="Buscar por nombre, zona o sede"
            aria-label="Buscar canchas"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        <Select
          aria-label="Filtrar por deporte"
          value={deporte}
          onChange={(event) => setDeporte(event.target.value)}
          className="pa__toolbar-select"
        >
          <option value="todos">Todos los deportes</option>
          {Object.entries(DEPORTES).map(([clave, { label }]) => (
            <option key={clave} value={clave}>
              {label}
            </option>
          ))}
        </Select>

        <Select
          aria-label="Filtrar por estado"
          value={estado}
          onChange={(event) => setEstado(event.target.value)}
          className="pa__toolbar-select"
        >
          <option value="todos">Todos los estados</option>
          {Object.entries(ESTADOS_CANCHA).map(([clave, { label }]) => (
            <option key={clave} value={clave}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={filtradas}
        stack
        pageSize={8}
        paginadorEtiqueta="canchas"
        emptyMessage="Ninguna cancha coincide con el filtro"
      />
    </div>
  )
}
