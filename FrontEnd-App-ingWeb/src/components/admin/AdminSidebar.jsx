import { Avatar } from '../ui/Chip.jsx'
import { Icon } from '../ui/Icon.jsx'
import { USUARIO_DEMO } from '../../lib/mockData.js'

/**
 * Secciones del panel de administración (§2.4, §4.6).
 * El orden es el de la navegación y el de las pestañas.
 */
const SECCIONES = [
  { id: 'resumen', label: 'Resumen', icon: 'dashboard', cuenta: null },
  { id: 'clientes', label: 'Clientes', icon: 'group', cuenta: 'clientes' },
  { id: 'canchas', label: 'Canchas', icon: 'stadium', cuenta: 'canchas' },
  { id: 'reservas', label: 'Reservas', icon: 'event_note', cuenta: 'reservas' },
]

/**
 * AdminSidebar — navegación del panel admin (§2.4).
 *
 * Escritorio: columna de 248 px pegada al borde. En móvil (<1024 px) la misma
 * navegación se pinta como banda horizontal desplazable (ver `.c-sidebar`).
 *
 * @param {object} props
 * @param {string} props.seccion
 * @param {(id: string) => void} props.onSeccion
 * @param {{clientes?: number, canchas?: number, reservas?: number}} [props.cuentas]
 */
export function AdminSidebar({ seccion, onSeccion, cuentas = {} }) {
  return (
    <aside className="c-sidebar" aria-label="Navegación del panel">
      <div className="c-sidebar__brand">
        <span className="c-sidebar__logo" aria-hidden="true">
          <Icon name="sports_soccer" size={22} weight={500} />
        </span>
        <div>
          <p className="c-sidebar__nombre">Sistema Canchas</p>
          <p className="c-sidebar__rol">Panel de administración</p>
        </div>
      </div>

      <nav className="c-sidebar__nav" aria-label="Secciones">
        {SECCIONES.map((item) => (
          <button
            key={item.id}
            type="button"
            className="c-sidebar__enlace"
            aria-current={seccion === item.id ? 'page' : undefined}
            onClick={() => onSeccion(item.id)}
          >
            <Icon name={item.icon} size={20} />
            {item.label}
            {item.cuenta && cuentas[item.cuenta] != null ? (
              <span className="c-sidebar__cuenta">{cuentas[item.cuenta]}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="c-sidebar__pie">
        <a className="c-sidebar__enlace" href="#/">
          <Icon name="open_in_new" size={20} />
          Vista cliente
        </a>

        <div className="c-sidebar__usuario">
          <Avatar name={USUARIO_DEMO.nombre} size={36} />
          <div className="c-sidebar__usuario-texto">
            <p className="c-sidebar__usuario-nombre u-truncate">{USUARIO_DEMO.nombre}</p>
            <p className="c-sidebar__usuario-mail u-truncate">{USUARIO_DEMO.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
