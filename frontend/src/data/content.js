/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  İÇERİK KATMANI (Single Source of Truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Sayfadaki TÜM metinler bu dosyada toplanır. Component'ler içerik bilmez,
 *  sadece bu veriyi import edip ekrana çizer.
 *
 *  Neden böyle? İçerik ile sunum (UI) birbirinden ayrılınca:
 *   1. Bilgileri güncellemek için tek bir dosyayı düzenlemek yeterli olur.
 *   2. Component'ler tekrar kullanılabilir ve test edilebilir kalır.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Kimlik & Sosyal Medya ────────────────────────────────────────────────────
export const profile = {
  name: 'Ahmet Aksoy',
  role: 'Balıkesir Üniversitesi Bilgisayar Mühendisliği 2. sınıf öğrencisi',
  location: 'Karesi, Balıkesir',
  email: 'a.aksoy1020@gmail.com',
  // GitHub API entegrasyonu bu kullanıcı adıyla canlı veri çeker;
  // hero'daki avatar da doğrudan github.com/KULLANICI.png adresinden gelir.
  githubUsername: 'ahmetaksoy10',
  intro:
    'Kod yazmayı, öğrenmeyi ve yeni şeyler denemeyi seviyorum. Bu sayfa, ' +
    'CV’min anlatamayacağı şeyleri anlatır — şu an hayatımda neler ' +
    'olduğuna dair canlı bir kesit.',
  status: 'Staja açık · Yaz 2026',
}

export const socialLinks = [
  { id: 'github', label: 'GitHub profilim', url: 'https://github.com/ahmetaksoy10' },
  { id: 'linkedin', label: 'LinkedIn profilim', url: 'https://www.linkedin.com/in/ahmet-aksoy10' },
  { id: 'mail', label: 'Bana e-posta gönder', url: 'mailto:a.aksoy1020@gmail.com' },
]

// ── Navigasyon (yapışkan mini menü) ──────────────────────────────────────────
export const navLinks = [
  { id: 'odak', label: 'Odak', href: '#odak' },
  { id: 'projeler', label: 'Projeler', href: '#projeler' },
  { id: 'github', label: 'GitHub', href: '#github' },
  { id: 'iletisim', label: 'İletişim', href: '#iletisim' },
]

// ── Kayan şerit (marquee) — teknolojiler + kişilik karışımı ──────────────────
export const marqueeItems = [
  'Python',
  'FastAPI',
  'React',
  'SwiftUI',
  'SQLite',
  'Git & GitHub',
  'Docker (öğreniyorum)',
  'Tinkercad',
  'Figma',
  'Bolca kahve',
  'Türkçe müzik',
  'Roma gezgini',
]

// ── Kapanış CTA bölümü ───────────────────────────────────────────────────────
export const contactCta = {
  label: 'Bir sonraki adım',
  note:
    'Yaz 2026 staj dönemim için ekip arıyorum. React, Python/FastAPI veya ' +
    'iOS projelerinizde hem öğrenir hem değer katarım — bir kahve uzaklıktayım.',
}

// ── 01 · Ana Odak ────────────────────────────────────────────────────────────
export const currentFocus = {
  title: 'OEE Dashboard — Hackathon projesine yoğunlaşmak',
  description:
    'Endüstriyel üretim verilerini izleyen dashboard ekranları geliştiriyorum. ' +
    'FastAPI tabanlı backend üzerinde "what-if" analiz modülleriyle üretim ' +
    'senaryolarını simüle edip farklı durumları test ediyorum. Haziran ' +
    'itibarıyla enerjimin büyük kısmı burada.',
  tags: ['Python', 'FastAPI', 'What-if Analizi', 'Veri Odaklı İzleme'],
}

// ── 02 · Öğrenim Radarı ──────────────────────────────────────────────────────
// level: 0–100 arası (radar çubuğunun doluluk oranı)
// stage: badge üzerinde görünen kısa durum etiketi
export const learningRadar = [
  { id: 'python', name: 'Python & FastAPI', stage: 'Aktif', level: 85, icon: 'server' },
  { id: 'react', name: 'React + Vite', stage: 'Derinleşiyorum', level: 78, icon: 'atom' },
  { id: 'swiftui', name: 'SwiftUI', stage: 'Derinleşiyorum', level: 72, icon: 'smartphone' },
  { id: 'sql', name: 'SQL & SQLite', stage: 'Aktif', level: 60, icon: 'database' },
  { id: 'git', name: 'Git & GitHub', stage: 'Aktif', level: 70, icon: 'git' },
  { id: 'docker', name: 'Docker', stage: 'Keşif', level: 15, icon: 'container' },
]

// ── 03 · Kütüphanem ──────────────────────────────────────────────────────────
export const currentlyReading = {
  title: 'Clean Architecture',
  author: 'Robert C. Martin',
  reason:
    'Yazılımın sadece bugün çalışması değil, yıllar sonra da sürdürülebilir ' +
    'kalması nasıl mümkün olur? Projelerimdeki katmanlı mimariyi daha bilinçli ' +
    'kurmak için okuyorum.',
  currentPage: 173,
  totalPages: 432, // ≈ %40 ilerleme
}

// ── 04 · Ses Arka Planı ──────────────────────────────────────────────────────
export const currentlyListening = {
  track: 'Kod Yazarken Çalanlar',
  artist: 'Apple Music',
  album: 'Türkçe Çalma Listesi',
  // Mini player UI'ında gösterilen statik süre bilgileri
  elapsed: '2:14',
  duration: '3:47',
  progress: 58, // yüzde cinsinden ilerleme
}

// ── 05 · Sistem Durumu (Enerji) ──────────────────────────────────────────────
export const energyStatus = {
  level: 75, // yüzde cinsinden enerji seviyesi
  context: 'Haziran 2026 · Final dönemi',
  note: 'Finaller yaklaşıyor ama kahve desteğiyle sistem ayakta.',
}

// ── 06 · Hayattan Bir Kare ───────────────────────────────────────────────────
export const lifeHighlight = {
  date: 'Nisan 2026',
  category: 'Seyahat Günlüğü',
  title: 'Roma, İtalya',
  description:
    'Antik mimariyi, dar sokakların ritmini ve bambaşka bir yaşam tarzını ' +
    'yakından gözlemledim. Seyahat tutkusu projelerime de sızıyor — ' +
    'TravelGuide ve Travio boşuna değil.',
}

// ── 07 · Projeler ────────────────────────────────────────────────────────────
export const activeProject = {
  name: 'Şu An — Now Page',
  status: 'Aktif Geliştirme',
  description:
    'İnternet Programlama dersi final projesi: nownownow.com akımından ilham ' +
    'alan, hayatımdan canlı bir kesit sunan kişisel web sayfası. Main dalına ' +
    'her push sonrası GitHub Actions ile otomatik olarak yayınlanıyor.',
  architecture: [
    'React + Vite ile component tabanlı SPA mimarisi',
    'GitHub REST API entegrasyonu — Promise.all ile paralel istekler',
    'Vanilla CSS design-token sistemiyle dark/light tema',
    'GitHub Actions ile otomatik CI/CD deploy (GitHub Pages)',
  ],
  stack: ['React', 'Vite', 'Vanilla CSS', 'GitHub API'],
  repoUrl: 'https://github.com/ahmetaksoy10/internet-programlama-final-2026',
  liveUrl: 'https://ahmetaksoy10.github.io/internet-programlama-final-2026/',
}

// Raftaki diğer projeler — durum etiketi karta renk kodu olarak yansır
export const otherProjects = [
  {
    id: 'travio',
    name: 'Travio',
    status: 'Geliştiriliyor',
    description:
      'Uçak, otobüs ve otel aramayı tek platformda birleştiren iOS seyahat ' +
      'uygulaması. Gemini AI ile kişiye özel, gün gün tatil planı üretiyor.',
    stack: ['SwiftUI', 'Firebase', 'Gemini AI'],
  },
  {
    id: 'subgrave',
    name: 'Subgrave',
    status: 'Geliştiriliyor',
    description:
      '"Abonelik Mezarlığı" metaforuyla abonelik takibi: kullanılmayan ' +
      'abonelikler hayalete dönüşüyor, yıl sonunda Wrapped tarzı rapor sunuyor.',
    stack: ['SwiftUI', 'SwiftData', 'AppIntents'],
  },
  {
    id: 'travelguide',
    name: 'TravelGuide',
    status: 'Tamamlandı',
    description:
      'Türkiye’nin 81 ilini oyunlaştırılmış şehir kartlarıyla keşfettiren ' +
      'masaüstü gezi rehberi; 19 rozet, seviye sistemi ve haftalık seri.',
    stack: ['Python', 'PyQt5', 'SQLite'],
  },
]

// ── 08 · Öğrenme Listesi (Backlog) ───────────────────────────────────────────
export const learningBacklog = [
  { id: 'git', label: 'Git ve GitHub temellerini öğrenmek', done: true },
  { id: 'docker', label: 'Docker temelleri & konteyner yapısını öğrenmek', done: false },
  { id: 'rn', label: 'React Native ile mobil uygulama denemesi', done: false },
  { id: 'book', label: 'Clean Architecture kitabını bitirmek', done: false },
  { id: 'portfolio', label: 'Kişisel portfolyo sitesini yayına almak', done: false },
  { id: 'oss', label: 'Açık kaynak bir projeye ilk katkımı yapmak', done: false },
]
