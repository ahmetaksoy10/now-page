import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
//
// GitHub Pages, projeyi "https://ahmetaksoy10.github.io/REPO-ADI/" altında yayınlar.
// Bu yüzden derlenen asset yollarının köke ("/") değil, repo adına göre çözülmesi gerekir.
// `base` ayarı tam olarak bunu sağlar. Repo adı değişirse sadece bu satırı güncelleyin.
export default defineConfig({
  plugins: [
    react(),
    // Görsel optimizasyonu (sharp): build sırasında JPG/PNG/SVG'leri sıkıştırır.
    // Yalnızca production build'de çalışır; dev sunucusunu etkilemez. Kalite 82
    // → görünür kayıp olmadan belirgin boyut düşüşü. (Aynı format korunur; gerçek
    // AVIF/WebP sunumu ayrı bir <picture> refactor'u ister.)
    ViteImageOptimizer({
      // Yalnızca raster görseller (jpg/png) — SVG'yi dışarıda bırakıyoruz çünkü
      // svgo bağımlılığı kurulu değil ve SVG kazancı önemsiz (favicon/icons).
      test: /\.(jpe?g|png)$/i,
      jpg: { quality: 82 },
      jpeg: { quality: 82 },
      png: { quality: 82 },
    }),
  ],
  base: '/now-page/',
  // Geliştirme sunucusu: PORT ortam değişkeni tanımlıysa onu kullan
  // (önizleme araçlarıyla uyum için); yoksa Vite varsayılanında kal.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
