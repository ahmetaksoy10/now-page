import Navbar from './components/Navbar.jsx'
import AuroraBackground from './components/AuroraBackground.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import HeroSection from './components/HeroSection.jsx'
import SkillCloud from './components/SkillCloud.jsx'
import CurrentFocus from './components/CurrentFocus.jsx'
import EnergyStatus from './components/EnergyStatus.jsx'
import CurrentlyListening from './components/CurrentlyListening.jsx'
import LearningRadar from './components/LearningRadar.jsx'
import CurrentlyReading from './components/CurrentlyReading.jsx'
import LifeHighlight from './components/LifeHighlight.jsx'
import ActiveProject from './components/ActiveProject.jsx'
import LearningBacklog from './components/LearningBacklog.jsx'
import Toolbox from './components/Toolbox.jsx'
import MiniTerminal from './components/MiniTerminal.jsx'
import GitHubActivity from './components/GitHubActivity.jsx'
import Timeline from './components/Timeline.jsx'
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
 * Bento ritmi (desktop):  7+5 → 5+7 → 7+5 → 12 → 4+4+4 → 12
 * Mobilde tüm kartlar tek kolona akar (CSS media query).
 */
function App() {
  return (
    <div className="page" id="top">
      {/* Kısa açılış perdesi (oturumda bir kez, reduced-motion'da atlanır) */}
      <IntroOverlay />

      {/* Komut paleti: ⌘K / Ctrl+K ya da navbar tetikleyicisiyle açılır */}
      <CommandPalette />

      {/* Dekoratif arka plan: ince mühendislik grid'i + film greni */}
      <div className="page__background" aria-hidden="true">
        <div className="page__grid" />
        <div className="page__noise" />
      </div>

      {/* Yaşayan aurora arka plan: yavaşça süzülen sıcak renk küreleri (saf CSS) */}
      <AuroraBackground />

      <Navbar />

      <main className="page__content">
        <HeroSection />
        <SkillCloud />

        <div className="bento-grid">
          <CurrentFocus />
          <EnergyStatus />
          <CurrentlyListening />
          <LearningRadar />
          <CurrentlyReading />
          <LifeHighlight />
          <ActiveProject />
          <LearningBacklog />
          <Toolbox />
          <MiniTerminal />
          <GitHubActivity />
        </div>

        <Timeline />

        <ContactCta />
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  )
}

export default App
