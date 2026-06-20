import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { mevcutTema, temaCevir } from '../utils/tema.js'

/**
 * ThemeToggle — Sağ üst köşede sabit duran dark/light tema anahtarı.
 *
 * Tema değişimi `temaCevir` ile yapılır: View Transitions destekleyen
 * tarayıcılarda tıklanan noktadan açılan dairesel bir geçiş oynar.
 * İkonlar zaten [data-theme] ile CSS üzerinden döner; buradaki küçük state
 * yalnızca aria-label'ı güncel tutmak (erişilebilirlik) içindir.
 */
function ThemeToggle() {
  const [tema, setTema] = useState(mevcutTema)
  const isDark = tema === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={(olay) => setTema(temaCevir({ x: olay.clientX, y: olay.clientY }))}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      {/* İki ikon da DOM'da durur; aktif olan CSS ile döndürülerek gösterilir. */}
      <Sun className="theme-toggle__icon theme-toggle__icon--sun" size={17} aria-hidden="true" />
      <Moon className="theme-toggle__icon theme-toggle__icon--moon" size={17} aria-hidden="true" />
    </button>
  )
}

export default ThemeToggle
