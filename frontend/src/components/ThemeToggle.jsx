import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { mevcutTema, temaCevir } from '../utils/tema.js'

function ThemeToggle() {
  const [tema, setTema] = useState('dark')
  const isDark = tema === 'dark'

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTema(mevcutTema())
  }, [])

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
