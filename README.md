# Şu An — Ahmet AKSOY | Now Page

> Bir CV'nin anlatamadığı şeyleri anlatan, hayatımdan **canlı bir kesit** sunan kişisel _now page_ — şu an neye odaklandığım, ne dinlediğim, ne kodladığım hep gerçek veriyle.

Bu depo (repository), Ahmet Aksoy'un kişisel "Şu An (Now)" sayfasının tüm kaynak kodlarını barındırmaktadır. 

### [🔗 Canlı Demo İçin Tıklayın →](https://ahmetaksoy10.github.io/now-page/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vanilla CSS](https://img.shields.io/badge/CSS-Vanilla%20%2B%20Tokens-1572B6?logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=githubpages&logoColor=white)
![Vitest](https://img.shields.io/badge/Test-Vitest-6E9F18?logo=vitest&logoColor=white)
![Last.fm](https://img.shields.io/badge/Last.fm-Canl%C4%B1%20Veri-D51007?logo=lastdotfm&logoColor=white)

---

## 📁 Proje Yapısı

Bu depo, ana geliştirme ortamını ve otomatik dağıtım (deployment) süreçlerini içerir.

```text
now-page/
├── .github/workflows/        # GitHub Actions: ci.yml (kalite kapısı) + deploy.yml
├── frontend/                 # Ana uygulama kaynak kodları (React + Vite)
│   ├── src/                  # Bileşenler, styles/ (modüler CSS), utils/, data/content.js
│   ├── scripts/              # generate-og.mjs (OG görseli üreteci)
│   ├── prerender.mjs         # Build sonrası statik HTML üretimi (SSG)
│   └── package.json          # Bağımlılıklar ve npm scriptleri
└── README.md                 # Bu dosya
```

Projenin tüm kod mimarisi ve UI detayları `frontend` klasörü içerisinde yer almaktadır. Uygulamayı geliştirmek veya detaylı incelemek için `frontend/README.md` dosyasına da göz atabilirsiniz.

---

## ✨ Öne Çıkan Özellikler

- 🎵 **Gerçek Zamanlı Müzik Entegrasyonu:** Apple Music üzerinden dinlediğim şarkılar Last.fm'e scrobble ediliyor ve müzik kartında canlı olarak gösteriliyor.
- 📊 **Canlı GitHub İstatistikleri:** GitHub REST API kullanılarak gerçek katkı ısı haritası, güncel çalışma serisi, dil dağılımı ve diğer GitHub istatistikleri doğrudan tarayıcıya çekilir.
- 🌌 **Dinamik ve Yaşayan Arayüz:** Saf CSS kullanılarak oluşturulan parallax etkili aurora arka planı, süzülen parçacıklar ve akan ışık şeritleri.
- 🧱 **Modern Tasarım (Bento Grid):** Asimetrik yerleşim, glassmorphism efektleri ve imleci izleyen etkileşimli kart parıltıları.
- 🎬 **Sorunsuz Tema Geçişleri:** View Transitions API ile dark/light (karanlık/aydınlık) tema arasında dairesel ve yumuşak bir animasyonla geçiş.
- 🔎 **Build-zamanı Prerender (SSG):** Sayfa, `react-dom/server` ile statik HTML'e render edilip yayınlanır; içerik kaynak HTML'de gelir (SEO + link önizlemeleri), istemcide React hydrate eder.
- 🧪 **Test + CI Kalite Kapısı:** Saf mantık için Vitest birim testleri + Testing Library bileşen testi; her PR'da lint + test + build çalışır (GitHub Actions).
- ⚡ **Performans ve Erişilebilirlik:** `prefers-reduced-motion` desteği, lazy loading, error boundary, "içeriğe atla" (skip-link) ve klavye dostu navigasyon.

---

## 🚀 Hızlı Başlangıç (Geliştirme Ortamı)

Projeyi bilgisayarınızda yerel olarak çalıştırmak için aşağıdaki adımları izleyin:

### 1. Depoyu Klonlayın

```bash
git clone https://github.com/ahmetaksoy10/now-page.git
cd now-page/frontend
```
> **Önemli:** Tüm npm komutlarını çalıştırmadan önce `frontend` klasörü içerisine (`cd frontend`) girdiğinizden emin olun.

### 2. Bağımlılıkları Kurun

```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```
Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışmaya başlayacaktır.

### 4. (Opsiyonel) Last.fm API Entegrasyonu

Müzik kartındaki canlı verinin (şu an çalan şarkı) çalışması için Last.fm'den bir API anahtarı almanız gerekir. 
`frontend/.env.local` adında bir dosya oluşturup içine anahtarınızı ekleyin:

```bash
VITE_LASTFM_API_KEY=sizin_api_anahtariniz_buraya
```

---

## ⚙️ CI/CD ve Yayınlama (Deployment)

Bu proje GitHub Pages üzerinde barındırılmaktadır. 

Ana dal (branch) olan `main` üzerine yapılan her push işlemi, `.github/workflows/deploy.yml` yapılandırmasını tetikler. GitHub Actions önce **lint + test** koşar (bozuk kod canlıya çıkmaz), ardından projeyi build eder (`npm run build`) ve GitHub Pages'e deploy eder. Süreç tamamen otomatiktir.

Ayrıca her **pull request** ve `main` dışı dal push'unda `.github/workflows/ci.yml` bir **kalite kapısı** olarak lint + test + build çalıştırır.

---

## 🛠️ Teknolojiler ve Mimari

Uygulama, build-zamanında statik HTML'e **prerender** edilen (SSG) ve istemcide hydrate olan bir tek sayfa uygulamasıdır (SPA):
- **Framework:** React 19 + Vite 8
- **Render:** Build sırasında `react-dom/server` ile statik HTML üretilir (`prerender.mjs`), istemcide `hydrateRoot` ile canlanır. Çıktı yine tamamen statiktir (GitHub Pages uyumlu).
- **Stil Yönetimi:** Vanilla CSS (Design-Token Sistemi, BEM Metodolojisi) — hiçbir CSS framework'ü yok. Stiller bakımı kolaylaştırmak için `frontend/src/styles/` altında anlamlı modüllere bölünmüştür; `App.css` bunları doğru cascade sırasıyla içeren indekstir.
- **İçerik Yönetimi:** Tüm sayfa verileri tek bir doğruluk kaynağında (Single Source of Truth) `frontend/src/data/content.js` içerisinde tutulmaktadır. Böylece bileşenlere dokunmadan içerik güncellenebilmektedir.
- **Test & Kalite:** Saf yardımcılar (`frontend/src/utils/`) Vitest ile, bir bileşen Testing Library ile test edilir; CI her değişikliği lint + test + build kapısından geçirir.

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Daha fazla bilgi için dosyaları inceleyebilir, kendi projelerinizde esinlenebilir veya kullanabilirsiniz.

---
