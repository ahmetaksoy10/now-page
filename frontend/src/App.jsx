import Navbar from './components/Navbar.jsx'
import AuroraBackground from './components/AuroraBackground.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import EasterEgg from './components/EasterEgg.jsx'
import HeroSection from './components/HeroSection.jsx'
import CurrentFocus from './components/CurrentFocus.jsx'
import EnergyStatus from './components/EnergyStatus.jsx'
import CurrentlyListening from './components/CurrentlyListening.jsx'
import CurrentlyReading from './components/CurrentlyReading.jsx'
import LifeHighlight from './components/LifeHighlight.jsx'
import ActiveProject from './components/ActiveProject.jsx'
import LearningBacklog from './components/LearningBacklog.jsx'
import GitHubActivity from './components/GitHubActivity.jsx'
import About from './components/About.jsx'
import Timeline from './components/Timeline.jsx'
import SectionDivider from './components/SectionDivider.jsx'
import ContactCta from './components/ContactCta.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Footer from './components/Footer.jsx'

/**
 * App — Sayfanın kompozisyon kökü.
 *
 * Mimari karar: App hiçbir iş mantığı içermez; bölümleri doğru sırayla
 * "besteler" (composition root). Kartlar 12 kolonluk bir bento grid'e
 * yerleşir; her kart kendi span'ını BentoCard üzerinden bildirir.
 *
 * Akış: hero → "şu an" kartları → Hakkımda → Yolculuk → iletişim.
 * Mobilde tüm kartlar tek kolona akar (CSS media query).
 */
function App() {
  return (
    <div className="page" id="top">
      {/* Kısa açılış perdesi (oturumda bir kez, reduced-motion'da atlanır) */}
      <IntroOverlay />

      {/* Gizli Konami kodu sürprizi (↑↑↓↓←→←→BA) */}
      <EasterEgg />

      {/* Dekoratif arka plan: ince mühendislik grid'i + film greni */}
      <div className="page__background" aria-hidden="true">
        <div className="page__grid" />
        <div className="page__noise" />
      </div>

      {/* Yaşayan aurora arka plan: süzülen sıcak küreler + şeritler (saf CSS) */}
      <AuroraBackground />

      <Navbar />

      <main className="page__content">
        <HeroSection />

        {/* Bento grid bir bütün olarak korunur; ayrıca dış API çağrısı yapan
            kartlar (müzik, GitHub) kendi küçük sınırlarıyla da sarılır ki biri
            çökerse yalnızca o kart fallback göstersin, diğerleri çalışsın. */}
        <ErrorBoundary>
          <div className="bento-grid">
            <CurrentFocus />
            <EnergyStatus />
            <ErrorBoundary
              compact
              span={5}
              title="Müzik kartı yüklenemedi"
              message="Last.fm bölümü beklenmedik bir hata verdi."
            >
              <CurrentlyListening />
            </ErrorBoundary>
            <LearningBacklog />
            <CurrentlyReading />
            <LifeHighlight />
            <ActiveProject />
            <ErrorBoundary
              compact
              span={12}
              title="GitHub kartı yüklenemedi"
              message="GitHub bölümü beklenmedik bir hata verdi."
            >
              <GitHubActivity />
            </ErrorBoundary>
          </div>
        </ErrorBoundary>

        <SectionDivider />

        {/* Hikâye bloğu: önce kim olduğum, sonra buraya nasıl geldiğim */}
        <About />
        <Timeline />

        <SectionDivider />

        <ContactCta />
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  )
}

export default App
