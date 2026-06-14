import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// GitHub Pages, projeyi "https://ahmetaksoy10.github.io/REPO-ADI/" altında yayınlar.
// Bu yüzden derlenen asset yollarının köke ("/") değil, repo adına göre çözülmesi gerekir.
// `base` ayarı tam olarak bunu sağlar. Repo adı değişirse sadece bu satırı güncelleyin.
export default defineConfig({
  plugins: [react()],
  base: '/now-page/',
  // Geliştirme sunucusu: PORT ortam değişkeni tanımlıysa onu kullan
  // (önizleme araçlarıyla uyum için); yoksa Vite varsayılanında kal.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    // Three.js chunk'ı doğası gereği büyük; eşiği ona göre ayarla.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Three.js'i kendi chunk'ına ayır: ağır 3D kütüphane, uygulama
        // kodundan bağımsız olarak paralel indirilir ve tarayıcıda ayrı
        // önbelleklenir (uygulama kodu değişince yeniden indirilmez).
        // Vite 8 / rolldown manualChunks'ı fonksiyon olarak bekler.
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
        },
      },
    },
  },
})
