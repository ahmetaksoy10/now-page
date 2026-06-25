// ─────────────────────────────────────────────────────────────────────────────
//  Prerender (SSG) — build sonrası statik HTML üretimi
// ─────────────────────────────────────────────────────────────────────────────
//  Akış (package.json "build" script'i):
//    1. vite build                                  → dist/ (client: JS/CSS/asset + index.html)
//    2. vite build --ssr src/entry-server.jsx ...   → dist-server/entry-server.js
//    3. node prerender.mjs  (bu dosya)              → uygulamayı render edip
//       dist/index.html'deki <!--app-html--> yer tutucusuna yazar.
//
//  Sonuç yine tamamen statik bir site (GitHub Pages uyumlu); fark şu ki artık
//  index.html gerçek içeriği (isim, başlıklar, metinler) taşır → crawler ve
//  link önizlemeleri JS çalıştırmadan içeriği görür. İstemcide React aynı DOM'u
//  hydrate eder.
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, 'dist')
const indexPath = resolve(distDir, 'index.html')

const template = readFileSync(indexPath, 'utf-8')

// SSR bundle'ını dinamik import et ve uygulamayı HTML dizesine render et
const { render } = await import(resolve(__dirname, 'dist-server/entry-server.js'))
const appHtml = render()

// Tam #root kalıbını hedefle (belirsizlik/yanlış eşleşme olmasın)
const placeholder = '<div id="root"><!--app-html--></div>'
if (!template.includes(placeholder)) {
  throw new Error(`index.html içinde beklenen yer tutucu bulunamadı: ${placeholder}`)
}

writeFileSync(indexPath, template.replace(placeholder, `<div id="root">${appHtml}</div>`))

// Geçici SSR çıktısını temizle (yalnızca prerender için gerekliydi)
rmSync(resolve(__dirname, 'dist-server'), { recursive: true, force: true })

console.log('✓ Prerender tamam: dist/index.html statik içerikle dolduruldu')
