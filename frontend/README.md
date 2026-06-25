# Şu An — Ahmet AKSOY | Now Page

> Bir CV'nin anlatamadığı şeyleri anlatan, hayatımdan **canlı bir kesit** sunan kişisel _now page_ — şu an neye odaklandığım, ne dinlediğim, ne kodladığım hep gerçek veriyle.

### [🔗 Canlı Demo →](https://ahmetaksoy10.github.io/now-page/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vanilla CSS](https://img.shields.io/badge/CSS-Vanilla%20%2B%20Tokens-1572B6?logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=githubpages&logoColor=white)
![Vitest](https://img.shields.io/badge/Test-Vitest-6E9F18?logo=vitest&logoColor=white)
![Last.fm](https://img.shields.io/badge/Last.fm-Canl%C4%B1%20Veri-D51007?logo=lastdotfm&logoColor=white)

---

## ✨ Öne Çıkanlar

- 🎵 **Gerçek "şu an çalıyor"** — Apple Music çalışlarım Last.fm'e scrobble ediliyor; kart canlı olarak ne dinlediğimi gösteriyor (çalmıyorsa "son çalınan").
- 📊 **Canlı GitHub paneli** — gerçek katkı ısı haritası, güncel seri, repo/yıldız/takipçi sayaçları ve dil dağılımı (GitHub REST API).
- 🌌 **Yaşayan aurora arka plan** — fareyle/scroll ile parallax yapan sıcak renk küreleri + akan ışık şeritleri + süzülen parçacıklar (saf CSS + ince canvas).
- 🎬 **Dark/Light tema** — tıklanan noktadan açılan dairesel geçişle (View Transitions API).
- 🧱 **Bento grid + glassmorphism** — asimetrik, dergi hissi veren yerleşim; scroll-reveal animasyonları; imleci izleyen kart parıltısı.
- 🔎 **Build-zamanı prerender (SSG)** — sayfa statik HTML'e render edilip yayınlanır (içerik kaynak HTML'de → SEO + link önizlemeleri), istemcide React hydrate eder.
- 🧪 **Test + CI** — Vitest birim testleri + Testing Library bileşen testi; her PR'da lint + test + build kalite kapısı.
- 🛡️ **Sağlamlık & erişilebilirlik** — Error Boundary'ler, blur-up lazy görseller, iletişim formu (Formspree), `prefers-reduced-motion`, "içeriğe atla" skip-link.
- 🥚 Ve keşfedilmeyi bekleyen birkaç **easter egg**.

---

## 🛠️ Teknolojiler

| Katman | Kullanılan |
| --- | --- |
| **Çatı** | React 19 + Vite 8 (build-zamanı prerender / SSG + hydration) |
| **Stil** | Vanilla CSS — design-token sistemi, BEM isimlendirme, `src/styles/` altında modüler |
| **İkonlar** | Lucide React + özel marka SVG'leri |
| **Canlı veri** | GitHub REST API · Last.fm API |
| **Test** | Vitest + Testing Library (jsdom) |
| **Görsel** | `vite-plugin-image-optimizer` (sharp) ile build-zamanı sıkıştırma |
| **CI/CD** | GitHub Actions → PR'da kalite kapısı (lint+test+build), `main`'de otomatik deploy |

---

## 📐 Mimari Kararlar

- **Neden prerender (SSG)?** İçerik statik HTML'de gelsin diye build sırasında `react-dom/server` ile render edilir (`prerender.mjs`), istemcide `hydrateRoot` ile canlanır. Crawler'lar ve link önizlemeleri JS çalıştırmadan içeriği görür; çıktı yine tamamen statik (GitHub Pages). Canlı veriler (saat, GitHub/Last.fm) tarayıcıda, deterministik bir başlangıç durumundan hydrate olur (uyumsuzluk yok).
- **Neden Vanilla CSS (modüler)?** Sıfır CSS-framework bağımlılığı, CSS değişkenleriyle (design token) tam kontrol. Tema `<html data-theme>` ile tek seferde döner — hiçbir component yeniden render olmaz. Tasarım, bakımı kolaylaştırmak için `src/styles/` altında modüllere bölünmüştür; `App.css` cascade sırasını koruyan indekstir.
- **Neden `content.js` ayrımı?** Tüm metin ve görseller tek bir "doğruluk kaynağı"nda (`data/content.js`). Component'ler içerik bilmez, sadece çizer → güncellemek için tek dosya, bileşenler yeniden kullanılabilir ve test edilebilir kalır.
- **Neden saf util + test?** Ağ/DOM içermeyen mantık (`utils/github.js`, `utils/eposta.js`, `utils/lastfm.js`) bileşenlerden ayrılır → Vitest ile bağımsız test edilir; CI bunu her değişiklikte koşar.
- **Küçük, yeniden kullanılabilir bileşenler** — her kart kendi sorumluluğunda; ortak `BentoCard` yerleşim/animasyon/parıltıyı tek yerde toplar.

---

## 🚀 Kurulum & Çalıştırma

```bash
# Depoyu klonla
git clone https://github.com/ahmetaksoy10/now-page.git
cd now-page/frontend

# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat (http://localhost:5173)
npm run dev

# Testler (Vitest) — tek seferlik / izleme modu
npm run test
npm run test:watch

# Kod kalitesi
npm run lint

# Production build (client build → SSR build → prerender enjeksiyonu)
npm run build

# Build'i (prerender'lı statik çıktıyı) yerelde önizle
npm run preview
```

> **Last.fm için (opsiyonel):** Müzik kartının çalışması için `frontend/.env.local` içine bir Last.fm API anahtarı koyun:
> ```bash
> VITE_LASTFM_API_KEY=buraya_anahtariniz
> ```
> Canlı deploy için aynı değeri GitHub repo'da **Settings → Secrets → Actions** altına `VITE_LASTFM_API_KEY` olarak ekleyin. Anahtar salt-okunurdur ve `.gitignore`'dadır.

---

## 📁 Proje Yapısı

```
frontend/
├── index.html              # Ana HTML + SEO/OG meta + prerender yer tutucusu
├── prerender.mjs           # Build sonrası statik HTML üretimi (SSG)
├── scripts/
│   └── generate-og.mjs     # 1200×630 OG görseli üreteci (sharp)
├── src/
│   ├── entry-client.jsx    # İstemci girişi (prod: hydrateRoot, dev: createRoot)
│   ├── entry-server.jsx    # SSR girişi (renderToString — prerender için)
│   ├── App.jsx             # Kompozisyon kökü (bölümleri sıralar)
│   ├── App.css             # Modüler CSS indeksi (styles/ dosyalarını @import eder)
│   ├── styles/             # Bölümlere ayrılmış CSS (tokens, base, cards, ...)
│   ├── data/
│   │   └── content.js      # TÜM içerik (Single Source of Truth)
│   ├── components/         # Bileşenler (HeroSection, GitHubActivity, ...)
│   │   └── icons/          # Marka SVG ikonları
│   ├── hooks/              # useScrollReveal, useLocalTime, ...
│   ├── utils/              # Saf mantık + testleri (github, eposta, lastfm)
│   ├── test/setup.js       # Vitest kurulum (jest-dom + jsdom mock'ları)
│   └── assets/             # Görseller (profil, projeler, roma)
└── vite.config.js          # base yolu + görsel optimizasyon + Vitest yapılandırması
```

---

## 🔗 Canlı Veri Kaynakları

- **GitHub REST API** — `Promise.all` ile paralel istekler: profil, repolar, dil dağılımı. Katkı ısı haritası ücretsiz/CORS-açık bir proxy'den (jogruber) gelir. `AbortController` ile temiz iptal, üç durumlu UI (yükleniyor / hata / başarı).
- **Last.fm API** — `user.getRecentTracks` ile gerçek "şu an çalıyor / son çalınan". Apple Music → Last.fm köprüsü (NepTunes ile scrobble). 45 sn'de bir tazelenir; hata/anahtar yoksa kart kibarca Last.fm linkine düşer.

---

## 📄 Lisans

**MIT** © Ahmet AKSOY — dilediğin gibi incele, öğren, kullan.

---

<sub>Balıkesir'de, bolca kahveyle elle yazıldı. ☕</sub>
