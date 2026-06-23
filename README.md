# Şu An — Ahmet AKSOY | Now Page

> Bir CV'nin anlatamadığı şeyleri anlatan, hayatımdan **canlı bir kesit** sunan kişisel _now page_ — şu an neye odaklandığım, ne dinlediğim, ne kodladığım hep gerçek veriyle.

Bu depo (repository), Ahmet Aksoy'un kişisel "Şu An (Now)" sayfasının tüm kaynak kodlarını barındırmaktadır. 

### [🔗 Canlı Demo İçin Tıklayın →](https://ahmetaksoy10.github.io/now-page/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Vanilla CSS](https://img.shields.io/badge/CSS-Vanilla%20%2B%20Tokens-1572B6?logo=css3&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=githubpages&logoColor=white)
![Last.fm](https://img.shields.io/badge/Last.fm-Canl%C4%B1%20Veri-D51007?logo=lastdotfm&logoColor=white)

---

## 📁 Proje Yapısı

Bu depo, ana geliştirme ortamını ve otomatik dağıtım (deployment) süreçlerini içerir.

```text
now-page/
├── .github/                  # GitHub Actions iş akışları (otomatik deploy için)
├── frontend/                 # Ana uygulama kaynak kodları (React + Vite)
│   ├── src/                  # React bileşenleri, CSS, içerik (content.js)
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
- ⚡ **Performans ve Erişilebilirlik:** `prefers-reduced-motion` desteği, lazy loading ve error boundary kullanımları.

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

Ana dal (branch) olan `main` üzerine yapılan her push işlemi, `.github/workflows` klasöründeki yapılandırmayı tetikler. GitHub Actions, projeyi otomatik olarak build eder (`npm run build`) ve GitHub Pages'e deploy eder. Süreç tamamen otomatiktir.

---

## 🛠️ Teknolojiler ve Mimari

Uygulamanın mimarisinde tamamen istemci tarafı (Client-Side) ve tek sayfa uygulaması (SPA) prensipleri benimsenmiştir:
- **Framework:** React 19 + Vite 8
- **Stil Yönetimi:** Vanilla CSS (Design-Token Sistemi, BEM Metodolojisi) - Hiçbir CSS framework'ü kullanılmamıştır, her şey tek bir `App.css` dosyasında yönetilmektedir.
- **İçerik Yönetimi:** Tüm sayfa verileri tek bir doğruluk kaynağında (Single Source of Truth) `frontend/src/data/content.js` içerisinde tutulmaktadır. Böylece bileşenlere dokunmadan içerik güncellenebilmektedir.

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Daha fazla bilgi için dosyaları inceleyebilir, kendi projelerinizde esinlenebilir veya kullanabilirsiniz.

---
*Bu detaylı README dosyası, uygulamanın genel yapısını açıklamak üzere projenin kök dizininde konumlandırılmıştır.*
