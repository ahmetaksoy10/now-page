import { Search } from 'lucide-react'
import { navLinks } from '../data/content.js'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import ThemeToggle from './ThemeToggle.jsx'

// İzlenecek bölüm id'leri, navLinks'ten türetilir (#odak → odak)
const BOLUM_IDLERI = navLinks.map((l) => l.href.replace('#', ''))

// macOS → "⌘", diğerleri → "Ctrl" (kısayol her ikisini de dinler)
const MAC = /Mac|iPhone|iPad/.test(
  navigator.userAgentData?.platform || navigator.platform || navigator.userAgent,
)

/**
 * Navbar — Ekranın üstünde süzülen cam (glass) hap menü.
 *
 * Kısa bir tek-sayfa için tam genişlik menü ağır kaçar; küçük bir hap,
 * sayfaya "ürün" havası verir. Linkler bölüm id'lerine kayar ve scroll-spy
 * ile o an görünen bölüm vurgulanır (kullanıcı sayfada nerede olduğunu bilir).
 */
function Navbar() {
  const aktifBolum = useScrollSpy(BOLUM_IDLERI)

  return (
    <nav className="navbar" aria-label="Sayfa içi gezinme">
      {/* İsim, imza gibi: sayfanın sahibi her an görünür */}
      <a href="#top" className="navbar__brand" aria-label="Sayfa başına dön">
        ahmet aksoy<span className="navbar__brand-dot">.</span>
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

      {/* Komut paletini açar (klavyesi olmayan/dokunmatik kullanıcılar için de) */}
      <button
        type="button"
        className="navbar__cmd"
        onClick={() => window.dispatchEvent(new CustomEvent('command-palette:open'))}
        aria-label="Komut paletini aç"
        title="Komut paleti"
      >
        <Search size={14} aria-hidden="true" />
        <span className="navbar__cmd-hint">{MAC ? '⌘' : 'Ctrl'} K</span>
      </button>

      <ThemeToggle />
    </nav>
  )
}

export default Navbar
