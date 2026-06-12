import { navLinks } from '../data/content.js'
import ThemeToggle from './ThemeToggle.jsx'

/**
 * Navbar — Ekranın üstünde süzülen cam (glass) hap menü.
 *
 * Kısa bir tek-sayfa için tam genişlik menü ağır kaçar; küçük bir hap,
 * sayfaya "ürün" havası verir. Linkler bölüm id'lerine kayar
 * (html { scroll-behavior: smooth } sayesinde yumuşak geçiş).
 */
function Navbar() {
  return (
    <nav className="navbar" aria-label="Sayfa içi gezinme">
      {/* Monogram: logo yerine zarif bir kişisel imza */}
      <a href="#top" className="navbar__brand" aria-label="Sayfa başına dön">
        aa<span className="navbar__brand-dot">.</span>
      </a>

      <div className="navbar__links">
        {navLinks.map((link) => (
          <a key={link.id} href={link.href} className="navbar__link">
            {link.label}
          </a>
        ))}
      </div>

      <ThemeToggle />
    </nav>
  )
}

export default Navbar
