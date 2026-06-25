import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
// Tüm tasarım sistemi tek bir indeks CSS'inde toplanır (bkz. App.css → styles/).
import './App.css'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production'da index.html build-zamanı prerender edilmiştir (statik içerik
// #root içinde hazır) → hydrateRoot mevcut DOM'u "canlandırır". Dev sunucusunda
// prerender YOKtur (boş kök) → createRoot ile normal mount yapılır.
if (import.meta.env.PROD) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}

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
