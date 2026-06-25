// ─────────────────────────────────────────────────────────────────────────────
//  OG (Open Graph) görseli üreteci — 1200×630
// ─────────────────────────────────────────────────────────────────────────────
//  Sosyal paylaşım önizlemesi için siteyle uyumlu, koyu temalı bir kart üretir.
//  Tek seferlik bir asset'tir ama script repoda durur → yeniden üretilebilir.
//
//  Çalıştır:  node scripts/generate-og.mjs   (frontend/ içinden)
//
//  Not: Metinler SVG ile çizilir; web fontları (Inter/Instrument Serif) sistemde
//  kurulu olmayabileceği için güvenli sistem-font yığını kullanılır (Helvetica/
//  Georgia). Renkler App.css koyu tema token'larıyla aynıdır.
// ─────────────────────────────────────────────────────────────────────────────
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CIKTI = resolve(__dirname, '../public/og-image.jpg')

const W = 1200
const H = 630

// App.css koyu tema token'larıyla birebir
const BG = '#0d0b09'
const METIN = '#f4efe6'
const ACCENT = '#e8a33c'
const IKINCIL = 'rgba(236, 228, 212, 0.62)'
const UCUNCUL = 'rgba(236, 228, 212, 0.45)'

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Aurora parıltıları: accent'ten türemiş sıcak küreler (düşük yoğunluk) -->
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(232,163,60,0.30)" />
      <stop offset="100%" stop-color="rgba(232,163,60,0)" />
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(229,115,78,0.22)" />
      <stop offset="100%" stop-color="rgba(229,115,78,0)" />
    </radialGradient>
  </defs>

  <!-- Zemin -->
  <rect width="${W}" height="${H}" fill="${BG}" />
  <circle cx="1010" cy="150" r="360" fill="url(#glowA)" />
  <circle cx="170" cy="560" r="340" fill="url(#glowB)" />

  <!-- İnce çerçeve -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="22"
        fill="none" stroke="rgba(245,238,224,0.10)" stroke-width="1.5" />

  <!-- Eyebrow: NOW PAGE + nabız noktası -->
  <circle cx="92" cy="142" r="6" fill="${ACCENT}" />
  <text x="112" y="148" font-family="'Courier New', monospace" font-size="22"
        letter-spacing="6" fill="${ACCENT}">NOW PAGE</text>

  <!-- İsim (kalın) + accent nokta -->
  <text x="86" y="320" font-family="Helvetica, Arial, sans-serif" font-weight="700"
        font-size="118" letter-spacing="-2" fill="${METIN}">Ahmet AKSOY<tspan fill="${ACCENT}">.</tspan></text>

  <!-- Motto (serif italik) -->
  <text x="90" y="408" font-family="Georgia, 'Times New Roman', serif" font-style="italic"
        font-size="52" fill="${IKINCIL}">şu an — bugünkü ben</text>

  <!-- Alt satır: rol · konum -->
  <text x="92" y="552" font-family="'Courier New', monospace" font-size="24"
        letter-spacing="1" fill="${UCUNCUL}">Bilgisayar Mühendisliği Öğrencisi · Balıkesir</text>
</svg>`

await sharp(Buffer.from(svg)).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(CIKTI)
console.log(`✓ OG görseli üretildi: ${CIKTI} (${W}×${H})`)
