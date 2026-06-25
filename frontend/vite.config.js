import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
//
// GitHub Pages, projeyi "https://ahmetaksoy10.github.io/REPO-ADI/" altında yayınlar.
// Bu yüzden derlenen asset yollarının köke ("/") değil, repo adına göre çözülmesi gerekir.
// `base` ayarı tam olarak bunu sağlar. Repo adı değişirse sadece bu satırı güncelleyin.
//
// Fonksiyon formu: SSR (prerender) build'i ile normal client build'ini ayırt
// edebilmek için `isSsrBuild` bayrağını kullanır (bkz. aşağıdaki görsel optimizasyonu).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    // Görsel optimizasyonu (sharp): build sırasında JPG/PNG'leri sıkıştırır.
    // SSR (prerender) build'inde GEREKSİZDİR — orada asset emit edilmez, yalnızca
    // URL çözülür. Atlamak hem hızlandırır hem de iki build'in asset hash'lerinin
    // ayrışma riskini ortadan kaldırır (prerender HTML'indeki <img> yolları client
    // build'in ürettiği dosyalarla birebir eşleşsin). Kalite 82 → görünür kayıpsız.
    ...(isSsrBuild
      ? []
      : [
          ViteImageOptimizer({
            test: /\.(jpe?g|png)$/i,
            jpg: { quality: 82 },
            jpeg: { quality: 82 },
            png: { quality: 82 },
          }),
        ]),
  ],
  base: '/now-page/',
  // Geliştirme sunucusu: PORT ortam değişkeni tanımlıysa onu kullan
  // (önizleme araçlarıyla uyum için); yoksa Vite varsayılanında kal.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  // Vitest: birim + bileşen testleri. jsdom ortamı DOM API'leri sağlar;
  // globals → describe/it/expect import'suz; setup jest-dom matcher'larını yükler.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
}))
