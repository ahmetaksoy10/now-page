import { useEffect, useRef, useState } from 'react'
import { Lightbulb } from 'lucide-react'

const TUSLAR = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A']

function HintButton() {
  const [acik, setAcik] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!acik) return
    const disTik = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAcik(false)
    }
    const esc = (e) => {
      if (e.key === 'Escape') setAcik(false)
    }
    document.addEventListener('mousedown', disTik)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', disTik)
      document.removeEventListener('keydown', esc)
    }
  }, [acik])

  const terminaliAc = () => {
    setAcik(false)
    window.dispatchEvent(new CustomEvent('hacker-terminal:ac'))
  }

  return (
    <div className="hint" ref={ref}>
      <button
        type="button"
        className="hint__btn"
        aria-label="İpucu"
        aria-expanded={acik}
        title="İpucu"
        onClick={() => setAcik((v) => !v)}
      >
        <Lightbulb size={17} aria-hidden="true" />
      </button>

      {acik && (
        <div className="hint__popover" role="dialog" aria-label="Gizli mod ipucu">
          <p className="hint__title">✦ Gizli bir şey var…</p>
          <p className="hint__text">
            Klavyede şu kombinasyonu dene — gizli bir terminal açılır:
          </p>
          <div className="hint__keys">
            {TUSLAR.map((t, i) => (
              <kbd key={i} className="hint__key">
                {t}
              </kbd>
            ))}
          </div>
          <button type="button" className="hint__fallback" onClick={terminaliAc}>
            Beceremedim, terminali aç →
          </button>
        </div>
      )}
    </div>
  )
}

export default HintButton
