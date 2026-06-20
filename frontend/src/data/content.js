/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  İÇERİK KATMANI (Single Source of Truth)
 * ─────────────────────────────────────────────────────────────────────────────
 *  Sayfadaki TÜM metinler ve görseller bu dosyada toplanır. Component'ler
 *  içerik bilmez, sadece bu veriyi import edip ekrana çizer.
 *
 *  Neden böyle? İçerik ile sunum (UI) birbirinden ayrılınca:
 *   1. Bilgileri güncellemek için tek bir dosyayı düzenlemek yeterli olur.
 *   2. Component'ler tekrar kullanılabilir ve test edilebilir kalır.
 *
 *  Görseller ES import ile alınır: Vite build sırasında dosyaları
 *  hash'leyip doğru base path ile sunar (GitHub Pages uyumu otomatik).
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Görseller ────────────────────────────────────────────────────────────────
import profilFoto from '../assets/profile.jpg'
import siloKapak from '../assets/silo-kapak.jpg'
import romaSelfie from '../assets/roma/roma2.jpg'
import romaKubbe from '../assets/roma/roma5.jpg'
import romaTapinak from '../assets/roma/roma8.jpg'
import romaKolezyum from '../assets/roma/roma1.jpg'
import travioAna from '../assets/projects/travio4.png'
import travioArama from '../assets/projects/travio5.png'
import travioGiris from '../assets/projects/travio2.png'
import subgravePano from '../assets/projects/subgrave1.png'
import subgraveMezarlik from '../assets/projects/subgrave3.png'
import subgraveDetay from '../assets/projects/subgrave2.png'
import travelguidePano from '../assets/projects/travelguide3.png'

// Galeri setleri: klasördeki TÜM görseller tek seferde, dosya adına göre
// sıralı toplanır. Yeni ekran görüntüsü eklemek = dosyayı klasöre atmak;
// kod değişikliği gerekmez (import.meta.glob, Vite'ın derleme zamanı sihri).
const galeriYap = (moduller, etiket) =>
  Object.keys(moduller)
    .sort()
    .map((yol, sira) => ({ src: moduller[yol], alt: `${etiket} — görsel ${sira + 1}` }))

const travioGaleri = galeriYap(
  import.meta.glob('../assets/projects/travio*.png', { eager: true, import: 'default' }),
  'Travio ekran görüntüsü',
)
const subgraveGaleri = galeriYap(
  import.meta.glob('../assets/projects/subgrave*.png', { eager: true, import: 'default' }),
  'Subgrave ekran görüntüsü',
)
const travelguideGaleri = galeriYap(
  import.meta.glob('../assets/projects/travelguide*.png', { eager: true, import: 'default' }),
  'TravelGuide ekran görüntüsü',
)
export const romaGaleri = galeriYap(
  import.meta.glob('../assets/roma/roma*.jpg', { eager: true, import: 'default' }),
  'Roma seyahatinden kare',
)

// ── Kimlik & Sosyal Medya ────────────────────────────────────────────────────
export const profile = {
  name: 'Ahmet Aksoy',
  role: 'Balıkesir Üniversitesi Bilgisayar Mühendisliği 2. sınıf öğrencisi',
  location: 'Karesi, Balıkesir',
  email: 'a.aksoy1020@gmail.com',
  photo: profilFoto,
  // GitHub API entegrasyonu bu kullanıcı adıyla canlı veri çeker.
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

// ── Son güncelleme ───────────────────────────────────────────────────────────
// Now-page'in en önemli sinyali: sayfanın CANLI olduğu. Bu tarih elle, içeriği
// her gerçekten güncellediğinde değiştirilir (sayfanın açıldığı an değil).
// Hero'daki damga ve Footer aynı kaynaktan beslenir (tek doğruluk noktası).
export const lastUpdated = '2026-06-17'

// ── Hakkımda ─────────────────────────────────────────────────────────────────
// Hero'nun kısa tanıtımının ötesinde: kim olduğum, nasıl çalıştığım, birkaç
// insani gerçek. Sayfaya sıcaklık ve hikâye katar (işe alımcı "bu kişiyle
// çalışmak nasıl" diye bakar). icon anahtarları About bileşeninde lucide'a eşlenir.
export const about = {
  lead: 'Kod yazmak benim için bir görev değil, çözmekten keyif aldığım bir bulmaca.',
  paragraphs: [
    'Balıkesir Üniversitesi’nde bilgisayar mühendisliği ikinci sınıf öğrencisiyim. ' +
      'Beni asıl heyecanlandıran şey, kafamdaki bir fikrin ekranda çalışan bir şeye ' +
      'dönüştüğü o an. Bu yüzden sürekli yeni bir şey deniyor, bozuyor ve yeniden yapıyorum.',
    'Çalışma şeklim iki katmanlı: önce bir fikri hızlıca prototipe döküp gerçekten ' +
      'işe yarıyor mu görüyorum, sonra detayları — temiz mimariyi, kullanıcının fark ' +
      'etmeden hissettiği küçük dokunuşları — sabırla cilalıyorum. iOS’ta SwiftUI, ' +
      'web’de React; ikisi arasında gidip gelmeyi seviyorum.',
    'Kod yazmadığım zamanlarda Türkçe çalma listemle kahve içiyor, bir sonraki ' +
      'seyahatin planını yapıyor ya da bir distopya romanına dalıyorum. Roma’dan ' +
      'döneli aylar oldu ama etkisi hâlâ üzerimde — gezdiğim her yer projelerime sızıyor.',
  ],
  facts: [
    { id: 'kahve', icon: 'coffee', text: 'Günde 3 fincan kahveyle çalışır' },
    { id: 'platform', icon: 'code', text: 'iOS (SwiftUI) ↔ web (React) arası' },
    { id: 'kitap', icon: 'book', text: 'Akşamları kurgu & distopya okur' },
    { id: 'hedef', icon: 'target', text: 'Sıradaki hedef: Yaz 2026 stajı' },
  ],
}

// ── Navigasyon (yapışkan mini menü) ──────────────────────────────────────────
export const navLinks = [
  { id: 'odak', label: 'Odak', href: '#odak' },
  { id: 'projeler', label: 'Projeler', href: '#projeler' },
  { id: 'github', label: 'GitHub', href: '#github' },
  { id: 'hakkimda', label: 'Hakkımda', href: '#hakkimda' },
  { id: 'yolculuk', label: 'Yolculuk', href: '#yolculuk' },
  { id: 'iletisim', label: 'İletişim', href: '#iletisim' },
]

// ── Skill cloud (etiket bulutu) — teknolojiler + kişilik karışımı ─────────────
// weight: 1–3. Bulutta yazı boyutunu belirler (3 = en büyük/baskın yetenek).
// kind: 'tech' nötr yetenek; 'fun' kişilik dokunuşu (farklı renk vurgusu alır).
export const skills = [
  { label: 'Python', weight: 3, kind: 'tech' },
  { label: 'React', weight: 3, kind: 'tech' },
  { label: 'SwiftUI', weight: 2, kind: 'tech' },
  { label: 'FastAPI', weight: 2, kind: 'tech' },
  { label: 'JavaScript', weight: 2, kind: 'tech' },
  { label: 'CSS', weight: 2, kind: 'tech' },
  { label: 'Git & GitHub', weight: 2, kind: 'tech' },
  { label: 'SQLite', weight: 1, kind: 'tech' },
  { label: 'Vite', weight: 1, kind: 'tech' },
  { label: 'Figma', weight: 1, kind: 'tech' },
  { label: 'Firebase', weight: 1, kind: 'tech' },
  { label: 'Docker', weight: 1, kind: 'tech' },
  { label: 'Bolca kahve', weight: 1, kind: 'fun' },
  { label: 'Türkçe müzik', weight: 1, kind: 'fun' },
  { label: 'Roma gezgini', weight: 1, kind: 'fun' },
]

// ── Zaman çizelgesi (Yolculuk) ───────────────────────────────────────────────
// Kronolojik sırada okunur; her madde scroll'la kademeli belirir.
export const timeline = [
  {
    id: 'baslangic',
    date: 'Eylül 2024',
    title: 'Bilgisayar Mühendisliği',
    text: 'Balıkesir Üniversitesi’nde yolculuk başladı. İlk satır kod, ilk gece yarısı debug.',
    icon: 'school',
  },
  {
    id: 'masaustu',
    date: '2024 – 2025',
    title: 'İlk projeler — TravelGuide',
    text: 'Python ve PyQt ile Türkiye’nin 81 ilini oyunlaştıran masaüstü gezi rehberi.',
    icon: 'code',
  },
  {
    id: 'ios',
    date: '2025',
    title: 'iOS dünyasına giriş',
    text: 'SwiftUI ile Travio ve Subgrave: yapay zekâ, SwiftData ve gerçek servis entegrasyonları.',
    icon: 'smartphone',
  },
  {
    id: 'roma',
    date: 'Nisan 2026',
    title: 'Roma',
    text: 'Antik mimari ve seyahat tutkusu projelere sızdı — gezi temalı uygulamalar tesadüf değil.',
    icon: 'map',
  },
  {
    id: 'hackathon',
    date: 'Haziran 2026',
    title: 'OEE Dashboard — YZT x Trex Hackathonu',
    text:
      'YZT x Trex Hackathonu’nda 3 kişilik ekiple 4. olduk. FastAPI ve Pandas ile ' +
      'devasa sensör verilerini işleyip, React (Vite/Tailwind) arayüzünde canlı ' +
      '“What-if” simülasyonları sunan dinamik bir OEE Karar Destek Sistemi geliştirdik.',
    icon: 'trophy',
  },
  {
    id: 'simdi',
    date: 'Haziran 2026',
    title: 'Şu an',
    text: 'Travio’ya odaklanma, bu Now Page ve Yaz 2026 staj arayışı.',
    icon: 'target',
  },
]

// ── Kapanış CTA bölümü ───────────────────────────────────────────────────────
export const contactCta = {
  label: 'Bir sonraki adım',
  note:
    'Yaz 2026 staj dönemim için ekip arıyorum. React, Python/FastAPI veya ' +
    'iOS projelerinizde hem öğrenir hem değer katarım — bir kahve uzaklıktayım.',
  // İletişim formu gönderimi (Formspree) — sayfa yenilenmeden fetch ile POST edilir
  formAction: 'https://formspree.io/f/mdavqrjy',
}

// ── 01 · Ana Odak ────────────────────────────────────────────────────────────
export const currentFocus = {
  title: 'Travio — yapay zekâ destekli iOS seyahat asistanı',
  description:
    'Enerjimin büyük kısmını yeniden Travio’ya verdim. SwiftUI ile yazdığım bu ' +
    'iOS uygulamasının kalbindeki Gemini AI asistanını derinleştiriyor, ödeme ve ' +
    'abonelik altyapısını sağlamlaştırıyor, gün gün tatil planı üretimine yeni ' +
    'özellikler ekliyorum.',
  tags: ['SwiftUI', 'Gemini AI', 'Firebase', 'iOS Geliştirme'],
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
  title: 'Silo (Wool)',
  author: 'Hugh Howey',
  cover: siloKapak,
  reason:
    'Yeraltındaki dev bir siloda geçen distopik bir hikâye. Gün boyu kod ' +
    'yazdıktan sonra zihnimi bambaşka bir dünyaya taşıyor — kurgu, benim için ' +
    'en iyi dinlenme şekli.',
  currentPage: 200,
  totalPages: 500, // = %40 ilerleme
}

// ── 04 · Dinlediklerim (Last.fm — gerçek "şu an / son çalınan") ──────────────
// Apple Music çalışlarım NepTunes ile Last.fm'e scrobble ediliyor; kart bu
// veriyi canlı çeker (bir şey çalıyorsa "Şu an çalıyor", yoksa "Son çalınan").
// apiKey salt-okunur (sadece public veri) ve .env.local'dan gelir — repoya
// girmez; canlı deploy için GitHub Actions secret'ı olarak da eklenir.
export const lastfm = {
  user: 'ahmetaksoy10',
  apiKey: import.meta.env.VITE_LASTFM_API_KEY,
  label: 'Dinlediklerim',
  profileUrl: 'https://www.last.fm/user/ahmetaksoy10',
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
  // Ana kare + küçük şerit: gerçek seyahat fotoğrafları
  photo: romaSelfie,
  photoAlt: 'Ahmet Aksoy, Roma’da Kolezyum önünde',
  gallery: [
    { src: romaKubbe, alt: 'Roma’da barok kubbeler' },
    { src: romaTapinak, alt: 'Villa Borghese’de göl kenarındaki antik tapınak' },
    { src: romaKolezyum, alt: 'Kolezyum’un dış cephesi' },
  ],
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
  repoUrl: 'https://github.com/ahmetaksoy10/now-page',
  liveUrl: 'https://ahmetaksoy10.github.io/now-page/',
}

// Raftaki diğer projeler:
//  - screenshots → karttaki üst medya şeridi (seçilmiş 1-3 kare)
//  - gallery     → detay modalındaki TÜM ekran görüntüleri (otomatik toplanır)
//  - features    → modaldaki "Öne Çıkanlar" listesi
//  - repoUrl     → GitHub linki (null ise repo henüz özel demektir)
export const otherProjects = [
  {
    id: 'travio',
    name: 'Travio',
    status: 'Geliştiriliyor',
    tagline: 'Yapay zekâ destekli iOS seyahat asistanı',
    description:
      'Uçak, otobüs ve otel aramayı tek platformda birleştiren iOS seyahat ' +
      'uygulaması. Gemini AI ile kişiye özel, gün gün tatil planı üretiyor.',
    longDescription:
      'Travio; uçak, otobüs ve otel aramayı tek platformda birleştiren bir iOS ' +
      'uygulaması. Kalbinde "Travio Mind" var: destinasyon, bütçe, ilgi alanı ve ' +
      'tempoya göre Google Gemini AI ile gün gün kişisel tatil planı üreten asistan. ' +
      'Ödeme, abonelik ve kimlik doğrulama uçtan uca gerçek servislerle çalışıyor.',
    features: [
      'Gemini AI ile kişiye özel, gün gün tatil planı üretimi',
      'Duffel API ile uçak araması; otobüs ve otel tek platformda',
      'Firebase Auth — e-posta ve Google ile giriş',
      'RevenueCat ile Plus aboneliği, Iyzico 3D Secure kart ödemesi',
      'Feature-based MVVM + Repository Pattern mimarisi',
      'Hassas anahtarlar Firebase Functions backend’inde; rate limiting ve PCI uyumu',
    ],
    stack: ['SwiftUI', 'Firebase', 'Gemini AI', 'Duffel API', 'RevenueCat', 'Iyzico'],
    repoUrl: null, // repo şimdilik özel — yayınlanınca linki buraya ekleyin
    screenshots: [
      { src: travioAna, alt: 'Travio ana ekranı — Nereye gitmek istersin?' },
      { src: travioArama, alt: 'Travio arama ekranı' },
      { src: travioGiris, alt: 'Travio giriş ekranı' },
    ],
    gallery: travioGaleri,
  },
  {
    id: 'subgrave',
    name: 'Subgrave',
    status: 'Geliştiriliyor',
    tagline: '"Abonelik Mezarlığı" metaforuyla abonelik takibi',
    description:
      '"Abonelik Mezarlığı" metaforuyla abonelik takibi: kullanılmayan ' +
      'abonelikler hayalete dönüşüyor, yıl sonunda Wrapped tarzı rapor sunuyor.',
    longDescription:
      'Subgrave, abonelik takibini sıkıcı bir tablodan çıkarıp bir hikâyeye ' +
      'dönüştürüyor: iptal ettiğin abonelikler özel çizilmiş mezar taşlarıyla ' +
      '"Mezarlık"ta yatıyor, 30 günden uzun süredir kullanmadıkların hayalet olarak ' +
      'işaretleniyor. Sıfır backend felsefesiyle tamamen cihaz üzerinde çalışıyor.',
    features: [
      '4 sekme: Dashboard, Yaşayanlar, Mezarlık ve İstatistik',
      'TombstoneShape ile özel çizilmiş mezar taşları',
      '30+ gün kullanılmayan abonelikler otomatik "hayalet" işaretlenir',
      'Yenilemeden 3 gün önce yerel bildirim',
      'Spotify Wrapped tarzı yıllık rapor, Swift Charts ile grafikler',
      'AppIntents ile Siri otomasyonu',
      'iOS 17 Observation framework (@Observable) + SwiftData kalıcılığı',
    ],
    stack: ['SwiftUI', 'SwiftData', 'Swift Charts', 'AppIntents'],
    repoUrl: null, // repo şimdilik özel — yayınlanınca linki buraya ekleyin
    screenshots: [
      { src: subgravePano, alt: 'Subgrave ana panosu — abonelik özetleri' },
      { src: subgraveMezarlik, alt: 'Subgrave mezarlık ekranı — iptal edilen abonelikler' },
      { src: subgraveDetay, alt: 'Subgrave abonelik listesi' },
    ],
    gallery: subgraveGaleri,
  },
  {
    id: 'travelguide',
    name: 'TravelGuide',
    status: 'Tamamlandı',
    tagline: 'Türkiye’yi oyunlaştıran masaüstü gezi rehberi',
    description:
      'Türkiye’nin 81 ilini oyunlaştırılmış şehir kartlarıyla keşfettiren ' +
      'masaüstü gezi rehberi; 19 rozet, seviye sistemi ve haftalık seri.',
    longDescription:
      'TravelGuide, Türkiye’nin 81 ilini interaktif şehir kartlarıyla keşfettiren, ' +
      'oyunlaştırılmış bir masaüstü uygulaması. Rozetler, seviyeler ve haftalık ' +
      'seriyle keşfi bir oyuna çeviriyor; internetsiz ortamda bile tamamen ' +
      'çevrimdışı çalışıyor.',
    features: [
      '81 il, interaktif şehir kartları ve keşif puanı',
      '19 rozetlik başarım sistemi, haftalık seri (streak), 6 seviyeli ilerleme',
      'PDF gezi karnesi ve favorileri dışa aktarma',
      'Açık/koyu tema; 94 Lucide SVG ikonu runtime’da retina netliğinde boyanır',
      'Sıfır backend — SQLite ile cihazda saklama, tamamen çevrimdışı',
      'Katmanlı modüler mimari: main / ui_components / database / styles / icons',
    ],
    stack: ['Python', 'PyQt5', 'SQLite', 'QSS'],
    repoUrl: 'https://github.com/ahmetaksoy10/travel-guide',
    screenshots: [
      { src: travelguidePano, alt: 'TravelGuide ana ekranı — keşif yolculuğu panosu' },
    ],
    gallery: travelguideGaleri,
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

// ── 09 · Araç Kutum ──────────────────────────────────────────────────────────
// Günlük geliştirme rutininde kullanılan araçlar/ortam. "icon" anahtarı
// component'teki lucide ikonuna eşlenir (içerik ↔ sunum ayrımı korunur).
export const toolbox = [
  { id: 'editor', label: 'Editör', tool: 'VS Code', icon: 'code' },
  { id: 'ios', label: 'iOS', tool: 'Xcode', icon: 'app' },
  { id: 'design', label: 'Tasarım', tool: 'Figma', icon: 'pen' },
  { id: 'version', label: 'Versiyon', tool: 'Git & GitHub', icon: 'git' },
  { id: 'db', label: 'Veritabanı', tool: 'SQLite', icon: 'database' },
  { id: 'circuit', label: 'Devre', tool: 'Tinkercad', icon: 'cpu' },
  { id: 'os', label: 'Sistem', tool: 'macOS', icon: 'laptop' },
]
