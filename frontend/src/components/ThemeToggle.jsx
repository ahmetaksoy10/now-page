import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'

/**
 * ThemeToggle — Sağ üst köşede sabit duran dark/light tema anahtarı.
 *
 * Erişilebilirlik: Buton ikonu görseldir; ekran okuyucular için durumun
 * ne yapacağını anlatan dinamik bir aria-label sağlanır.
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      {/* İki ikon da DOM'da durur; aktif olan CSS ile döndürülerek gösterilir.
          Bu sayede geçiş anında ikon "pop" etmez, yumuşakça döner. */}
      <Sun className="theme-toggle__icon theme-toggle__icon--sun" size={17} aria-hidden="true" />
      <Moon className="theme-toggle__icon theme-toggle__icon--moon" size={17} aria-hidden="true" />
    </button>
  )
}

export default ThemeToggle
