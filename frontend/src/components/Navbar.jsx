import { navLinks } from '../data/content.js'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import ThemeToggle from './ThemeToggle.jsx'
import HintButton from './HintButton.jsx'
const BOLUM_IDLERI = navLinks.map((l) => l.href.replace('#', ''))

function Navbar() {
  const aktifBolum = useScrollSpy(BOLUM_IDLERI)

  return (
    <nav className="navbar" aria-label="Sayfa içi gezinme">
      {/* İsim, imza gibi: sayfanın sahibi her an görünür */}
      <a href="#top" className="navbar__brand" aria-label="Sayfa başına dön">
        Ahmet AKSOY<span className="navbar__brand-dot">.</span>
      </a>

      <div className="navbar__links">
        {navLinks.map((link) => {
          const aktif = aktifBolum === link.href.replace('#', '')
          return (
            <a
              key={link.id}
              href={link.href}
              className={`navbar__link ${aktif ? 'is-active' : ''}`}
              aria-current={aktif ? 'true' : undefined}
            >
              {link.label}
            </a>
          )
        })}
      </div>

      <HintButton />
      <ThemeToggle />
    </nav>
  )
}

export default Navbar
