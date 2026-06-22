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

// ── Konsol easter egg: kaynağı merak edip konsolu açan geliştiricilere selam ──
console.log(
  '%c Hey! 👋 ',
  'font-size:18px;font-weight:700;color:#211505;background:#e8a33c;padding:6px 12px;border-radius:8px;',
)
console.log(
  '%cKonsolu açtığına göre meraklısın. 🙂\n' +
    '%cKaynak kod →%c https://github.com/ahmetaksoy10/now-page\n' +
    '%cİpucu: bir de ↑↑↓↓←→←→BA dene. 😉',
  'font-size:13px;color:#e8a33c;line-height:1.9;',
  'font-size:13px;color:#9a9088;',
  'font-size:13px;color:#e8a33c;font-weight:600;',
  'font-size:12px;color:#9a9088;font-style:italic;',
)
