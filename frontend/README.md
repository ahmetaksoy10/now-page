# Şu An — Ahmet AKSOY | Now Page

> Bir CV'nin anlatamadığı şeyleri anlatan, hayatımdan **canlı bir kesit** sunan kişisel _now page_ — şu an neye odaklandığım, ne dinlediğim, ne kodladığım hep gerçek veriyle.

### [🔗 Canlı Demo →](https://ahmetaksoy10.github.io/now-page/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vanilla CSS](https://img.shields.io/badge/CSS-Vanilla%20%2B%20Tokens-1572B6?logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=githubpages&logoColor=white)
![Last.fm](https://img.shields.io/badge/Last.fm-Canl%C4%B1%20Veri-D51007?logo=lastdotfm&logoColor=white)

---

## ✨ Öne Çıkanlar

- 🎵 **Gerçek "şu an çalıyor"** — Apple Music çalışlarım Last.fm'e scrobble ediliyor; kart canlı olarak ne dinlediğimi gösteriyor (çalmıyorsa "son çalınan").
- 📊 **Canlı GitHub paneli** — gerçek katkı ısı haritası, güncel seri, repo/yıldız/takipçi sayaçları ve dil dağılımı (GitHub REST API).
- 🌌 **Yaşayan aurora arka plan** — fareyle/scroll ile parallax yapan sıcak renk küreleri + akan ışık şeritleri + süzülen parçacıklar (saf CSS + ince canvas).
- 🎬 **Dark/Light tema** — tıklanan noktadan açılan dairesel geçişle (View Transitions API).
- 🧱 **Bento grid + glassmorphism** — asimetrik, dergi hissi veren yerleşim; scroll-reveal animasyonları; imleci izleyen kart parıltısı.
- 🛡️ **Sağlamlık** — Error Boundary'ler, blur-up lazy görseller, MX-doğrulamalı iletişim formu (Formspree), `prefers-reduced-motion` desteği.
- 🥚 Ve keşfedilmeyi bekleyen birkaç **easter egg**.

---

## 🛠️ Teknolojiler

| Katman | Kullanılan |
| --- | --- |
| **Çatı** | React 19 + Vite 8 (SPA, yalnızca istemci) |
| **Stil** | Vanilla CSS — design-token sistemi, BEM isimlendirme, tek dosya |
| **İkonlar** | Lucide React + özel marka SVG'leri |
| **Canlı veri** | GitHub REST API · Last.fm API |
| **Görsel** | `vite-plugin-image-optimizer` (sharp) ile build-zamanı sıkıştırma |
| **Deploy** | GitHub Actions → GitHub Pages (her `main` push'unda otomatik) |

---

## 📐 Mimari Kararlar

- **Neden SPA (yalnızca istemci)?** İçerik kişisel ve hafif; sunucuya gerek yok. Statik build, GitHub Pages'te ücretsiz ve hızlı yayınlanıyor. Canlı veriler doğrudan tarayıcıdan (GitHub / Last.fm API) çekiliyor.
- **Neden Vanilla CSS?** Tüm tasarım tek bir `App.css`'te, CSS değişkenleriyle (design token) yönetiliyor. Tema, `<html data-theme>` attribute'üyle tek seferde dönüyor — hiçbir component yeniden render olmuyor. Sıfır CSS-framework bağımlılığı, tam kontrol.
- **Neden `content.js` ayrımı?** Tüm metin ve görseller tek bir "doğruluk kaynağı"nda (`data/content.js`). Component'ler içerik bilmez, sadece çizer → güncellemek için tek dosya, bileşenler yeniden kullanılabilir ve test edilebilir kalır.
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

# Production build
npm run build

# Build'i yerelde önizle
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
├── index.html              # Ana HTML + SEO/OG meta etiketleri
├── src/
│   ├── App.jsx             # Kompozisyon kökü (bölümleri sıralar)
│   ├── App.css             # Tek CSS dosyası (design token sistemi)
│   ├── data/
│   │   └── content.js      # TÜM içerik (Single Source of Truth)
│   ├── components/         # ~30 bileşen (HeroSection, GitHubActivity, ...)
│   │   └── icons/          # Marka SVG ikonları
│   ├── hooks/              # useScrollReveal, useLocalTime, ...
│   └── assets/             # Görseller (profil, projeler, roma)
└── vite.config.js          # base yolu + görsel optimizasyon
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
