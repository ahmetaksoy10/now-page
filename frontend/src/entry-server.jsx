import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

/**
 * entry-server — Build-zamanı prerender (SSG) için sunucu girişi.
 *
 * `prerender.mjs` bu modülü import edip `render()`'ı çağırır; sonuç,
 * `index.html`'deki <!--app-html--> yer tutucusunun yerine yazılır. Böylece
 * statik HTML gerçek içeriği (isim, başlıklar, metinler) taşır → crawler'lar
 * ve link önizlemeleri JS çalıştırmadan içeriği görür. CSS burada import
 * EDİLMEZ; stil <link>'i client build'inin ürettiği index.html'de zaten var.
 *
 * Not: Canlı parçalar (saat, GitHub/Last.fm kartları) sunucuda deterministik
 * başlangıç durumunu (yer tutucu / "yükleniyor") çizer; istemci aynısını
 * hydrate eder → uyumsuzluk olmaz.
 */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
