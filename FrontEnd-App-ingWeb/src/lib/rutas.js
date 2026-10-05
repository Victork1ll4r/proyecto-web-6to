import { useEffect, useState } from 'react'

/**
 * Rutas de la aplicación.
 *
 * Enrutado mínimo por hash: el proyecto todavía no tiene enrutador, y en vez
 * de añadir una dependencia se resuelve con el hash para poder alternar entre
 * el catálogo y el catálogo de componentes. Este módulo queda separado de
 * App.jsx porque un archivo que exporta un hook y un componente a la vez
 * rompe el fast refresh de Vite.
 *
 *   #/            catálogo de canchas
 *   #/estilo      catálogo de componentes (validador del diseño)
 *
 * Cuando llegue el enrutador real, solo se sustituye este archivo.
 */

export const RUTAS = {
  '/': { titulo: 'Explorar canchas' },
  '/estilo': { titulo: 'Style guide' },
}

/** ¿Estamos en el navegador? Lo permite prerenderizar y testear sin DOM. */
const enNavegador = () => typeof window !== 'undefined'

export function rutaActual() {
  if (!enNavegador()) return '/'

  const hash = window.location.hash.replace(/^#/, '') || '/'
  return hash in RUTAS ? hash : '/'
}

/** Devuelve la ruta activa y la mantiene sincronizada con el hash. */
export function useRuta() {
  const [ruta, setRuta] = useState(rutaActual)

  useEffect(() => {
    if (!enNavegador()) return undefined

    const alCambiar = () => setRuta(rutaActual())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  useEffect(() => {
    if (enNavegador()) {
      document.title = `${RUTAS[ruta].titulo} · Sistema Canchas`
    }
  }, [ruta])

  return ruta
}