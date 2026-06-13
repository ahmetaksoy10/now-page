import Navbar from './components/Navbar.jsx'
import HeroSection from './components/HeroSection.jsx'
import Marquee from './components/Marquee.jsx'
import CurrentFocus from './components/CurrentFocus.jsx'
import EnergyStatus from './components/EnergyStatus.jsx'
import CurrentlyListening from './components/CurrentlyListening.jsx'
import LearningRadar from './components/LearningRadar.jsx'
import CurrentlyReading from './components/CurrentlyReading.jsx'
import LifeHighlight from './components/LifeHighlight.jsx'
import ActiveProject from './components/ActiveProject.jsx'
import LearningBacklog from './components/LearningBacklog.jsx'
import GitHubActivity from './components/GitHubActivity.jsx'
import ContactCta from './components/ContactCta.jsx'
import Footer from './components/Footer.jsx'

/**
 * App — Sayfanın kompozisyon kökü.
 *
 * Mimari karar: App hiçbir iş mantığı içermez; bölümleri doğru sırayla
 * "besteler" (composition root). Kartlar 12 kolonluk bir bento grid'e
 * yerleşir; her kart kendi span'ını BentoCard üzerinden bildirir.
 *
 * Bento ritmi (desktop):  7+5 → 5+7 → 7+5 → 12 → 4+4+4 → 12 → 12
 * Mobilde tüm kartlar tek kolona akar (CSS media query).
 */
function App() {
  return (
    <div className="page" id="top">
      {/* Dekoratif arka plan: sıcak ışık haleleri + ince grid + film greni */}
      <div className="page__background" aria-hidden="true">
        <div className="page__glow page__glow--one" />
        <div className="page__glow page__glow--two" />
        <div className="page__grid" />
        <div className="page__noise" />
      </div>

      <Navbar />

      <main className="page__content">
        <HeroSection />
        <Marquee />

        <div className="bento-grid">
          <CurrentFocus />
          <EnergyStatus />
          <CurrentlyListening />
          <LearningRadar />
          <CurrentlyReading />
          <LifeHighlight />
          <ActiveProject />
          <LearningBacklog />
          <GitHubActivity />
        </div>

        <ContactCta />
      </main>

      <Footer />
    </div>
  )
}

export default App
