import { ExplorarCanchas } from './pages/ExplorarCanchas.jsx'
import { StyleGuide } from './pages/StyleGuide.jsx'
import { useRuta } from './lib/rutas.js'

/**
 * Punto de entrada de la aplicación.
 *
 * El mapa ruta → vista vive en lib/rutas.js; aquí solo se resuelve cuál se
 * muestra. Cada vista es responsable de sus propios datos y estilos.
 */
const VISTAS = {
  '/': ExplorarCanchas,
  '/estilo': StyleGuide,
}

export default function App() {
  const ruta = useRuta()
  const Vista = VISTAS[ruta]

  return <Vista />
}