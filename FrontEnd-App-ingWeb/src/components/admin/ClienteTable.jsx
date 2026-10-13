import { useMemo, useState } from 'react'
import { Avatar, Badge } from '../ui/Chip.jsx'
import { Button } from '../ui/Button.jsx'
import { DataTable, TableAction } from '../ui/DataTable.jsx'
import { Input, Select } from '../ui/Field.jsx'
import { comparar } from '../../lib/orden.js'
import { descargarClientes } from '../../lib/exportarTablas.js'

/**
 * ClienteTable — listado de clientes del panel (§4.6, FASE 4.1).
 *
 * Columnas: código, nombre (con su correo), teléfono, registro, estado y
 * acciones. Encima, una barra de herramientas con búsqueda y filtro por estado;
 * debajo, paginación y selección múltiple (con exportación) que ofrece
 * `DataTable`. El filtrado y la ordenación los resuelve la tabla; aquí solo se
 * preparan las filas y las columnas.
 *
 * @param {object} props
 * @param {import('../../api/types.js').Cliente[]} props.clientes
 * @param {(cliente: import('../../api/types.js').Cliente) => void} props.onVerDetalle
 */

/** "DD/MM/YYYY" → "YYYYMMDD", para ordenar por fecha. */
function claveFecha(texto) {
  const [dia, mes, anio] = String(texto ?? '').split('/')
  return `${anio ?? ''}${mes ?? ''}${dia ?? ''}`
}

export function ClienteTable({ clientes, onVerDetalle }) {
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return clientes.filter((cliente) => {
      if (estado === 'activos' && !cliente.activo) return false
      if (estado === 'inactivos' && cliente.activo) return false
      if (!q) return true

      return [cliente.codigo, cliente.nombre, cliente.email, cliente.telefono].some((valor) =>
        String(valor ?? '').toLowerCase().includes(q),
      )
    })
  }, [clientes, busqueda, estado])

  const columns = useMemo(
    () => [
      { key: 'codigo', header: 'Código', sortable: true },
      {
        key: 'nombre',
        header: 'Cliente',
        sortable: true,
        sorter: (a, b) => comparar(a.nombre, b.nombre),
        render: (cliente) => (
          <div className="c-table__cell-person">
            <Avatar name={cliente.nombre} size={36} />
            <div>
              <p className="pa__celda-fuerte">{cliente.nombre}</p>
              <p className="pa__celda-suave u-truncate">{cliente.email}</p>
            </div>
          </div>
        ),
      },
      { key: 'telefono', header: 'Teléfono', render: (c) => <span className="u-tabular">{c.telefono}</span> },
      { key: 'registro', header: 'Registro', sortable: true, sorter: (a, b) => comparar(claveFecha(a.registro), claveFecha(b.registro)) },
      {
        key: 'activo',
        header: 'Estado',
        render: (cliente) => (
          <Badge tone={cliente.activo ? 'activo' : 'inactivo'}>
            {cliente.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        ),
      },
      {
        key: 'acciones',
        header: 'Acciones',
        align: 'right',
        render: (cliente) => (
          <div className="c-table__actions">
            <TableAction
              icon="visibility"
              label={`Ver ficha de ${cliente.nombre}`}
              onClick={() => onVerDetalle(cliente)}
            />
          </div>
        ),
      },
    ],
    [onVerDetalle],
  )

  return (
    <div className="pa__bloque">
      <div className="pa__toolbar">
        <div className="pa__toolbar-buscar">
          <Input
            icon="search"
            type="search"
            placeholder="Buscar por nombre, correo o código"
            aria-label="Buscar clientes"
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
          <option value="todos">Todos los estados</option>
          <option value="activos">Solo activos</option>
          <option value="inactivos">Solo inactivos</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={filtrados}
        selectable
        stack
        pageSize={5}
        paginadorEtiqueta="clientes"
        emptyMessage="Ningún cliente coincide con el filtro"
        bulkBar={({ clear, selected }) => (
          <>
            <Button
              variant="secondary"
              size="sm"
              icon="download"
              onClick={() => descargarClientes(filtrados.filter((c) => selected.has(c.id)))}
            >
              Exportar
            </Button>
            <Button variant="ghost" size="sm" onClick={clear}>
              Limpiar
            </Button>
          </>
        )}
      />
    </div>
  )
}
