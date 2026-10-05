import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* El orden importa: el reset declara el orden de capas y los tokens deben
   existir antes de que base y components los consuman. */
import './index.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
