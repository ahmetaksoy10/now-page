import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// Tüm tasarım sistemi tek bir ustalıkla yazılmış CSS dosyasında toplanır (bkz. App.css).
import './App.css'

// StrictMode: Geliştirme aşamasında olası yan etki (side effect) hatalarını
// erken yakalamak için React'in önerdiği sarmalayıcı. Production build'i etkilemez.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
