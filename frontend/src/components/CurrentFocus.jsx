import { useRef } from 'react'
import { Crosshair } from 'lucide-react'
import { currentFocus } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

/**
 * CurrentFocus — Bento'nun amiral kartı: "Şu anki ana odak".
 *
 * "Wow" detayı: fareyi takip eden ışık halesi (spotlight). JS yalnızca
 * koordinatı iki CSS değişkenine yazar; çizim tamamen GPU-dostu CSS'te.
 * State kullanılmadığı için React render tetiklenmez.
 */
function CurrentFocus() {
  const kartRef = useRef(null)

  const fareyiIzle = (olay) => {
    const kart = kartRef.current?.querySelector('.focus-card__surface')
    if (!kart) return
    const kutu = olay.currentTarget.getBoundingClientRect()
    olay.currentTarget.style.setProperty('--mx', `${olay.clientX - kutu.left}px`)
    olay.currentTarget.style.setProperty('--my', `${olay.clientY - kutu.top}px`)
  }

  return (
    <BentoCard
      span={7}
      id="odak"
      label="Ana Odak"
      labelId="odak-baslik"
      className="focus-card"
      sticker={Crosshair}
    >
      <div ref={kartRef} onMouseMove={fareyiIzle} className="focus-card__surface">
        <div className="focus-card__icon" aria-hidden="true">
          <Crosshair size={19} />
        </div>

        <h2 className="focus-card__title">{currentFocus.title}</h2>
        <p className="focus-card__description">{currentFocus.description}</p>

        <ul className="chip-row" aria-label="Odak alanları">
          {currentFocus.tags.map((etiket) => (
            <li key={etiket} className="chip">
              {etiket}
            </li>
          ))}
        </ul>
      </div>
    </BentoCard>
  )
}

export default CurrentFocus
