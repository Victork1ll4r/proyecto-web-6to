import { ExplorarCanchas } from './pages/ExplorarCanchas.jsx'
import { DetalleCancha } from './pages/DetalleCancha.jsx'
import { StyleGuide } from './pages/StyleGuide.jsx'
import { navegar, rutaDeCancha, useRuta } from './lib/rutas.js'

/**
 * Punto de entrada de la aplicación.
 *
 * El mapa ruta → vista vive en lib/rutas.js; aquí solo se resuelve cuál se
 * muestra y se le pasan los parámetros de la URL. Cada vista es responsable
 * de sus propios datos y estilos.
 */
export default function App() {
  const { ruta, params } = useRuta()

  if (ruta === '/cancha/:id') {
    return <DetalleCancha id={params.id} onVolver={() => navegar('/')} />
  }

  if (ruta === '/estilo') return <StyleGuide />

  return <ExplorarCanchas onReservar={(cancha) => navegar(rutaDeCancha(cancha.id))} />
}
