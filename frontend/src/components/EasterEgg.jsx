import { useEffect, useState } from 'react'

// Klasik Konami kodu: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

const RENKLER = ['#e8a33c', '#e1734e', '#f0b65c', '#c8771a', '#fff7e8']

// Konfeti zerrelerini üretir. Math.random içerir → SADECE olay handler'ında
// (render dışında) çağrılır, böylece React "saf render" kuralı bozulmaz.
function zerreUret(azalt) {
  return Array.from({ length: azalt ? 0 : 90 }, () => ({
    sol: Math.random() * 100,
    sure: 2.4 + Math.random() * 2.4,
    gecikme: Math.random() * 0.9,
    renk: RENKLER[Math.floor(Math.random() * RENKLER.length)],
    donme: Math.random() * 720 - 360,
  }))
}

/**
 * EasterEgg — Gizli Konami kodu sürprizi (↑↑↓↓←→←→BA).
 *
 * Klavyede diziyi girince ekrana kısa süreliğine amber bir konfeti yağmuru
 * iner + küçük bir "gizli mod" mesajı belirir. Tamamen dekoratif ve olay
 * tabanlı (sürekli maliyeti yok). "Hareketi azalt" tercihinde konfeti atlanır,
 * yalnızca mesaj gösterilir. Konfeti pointer-events almaz → sayfayı engellemez.
 */
function EasterEgg() {
  // null = kapalı; dizi = açık (içinde üretilmiş zerreler)
  const [zerreler, setZerreler] = useState(null)

  // Diziyi dinle: son N tuşu kayan pencerede tut, Konami ile eşleşince tetikle
  useEffect(() => {
    let girilen = []
    const dinle = (olay) => {
      girilen = [...girilen, olay.key].slice(-KONAMI.length)
      const eslesti =
        girilen.length === KONAMI.length &&
        KONAMI.every((tus, i) => girilen[i].toLowerCase() === tus.toLowerCase())
      if (eslesti) {
        girilen = []
        const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setZerreler(zerreUret(azalt)) // rastgele üretim render dışında
      }
    }
    window.addEventListener('keydown', dinle)
    return () => window.removeEventListener('keydown', dinle)
  }, [])

  // Birkaç saniye sonra kendiliğinden kapan
  useEffect(() => {
    if (!zerreler) return
    const zamanlayici = setTimeout(() => setZerreler(null), 5000)
    return () => clearTimeout(zamanlayici)
  }, [zerreler])

  if (!zerreler) return null

  return (
    <div className="konami" aria-hidden="true">
      {zerreler.map((z, i) => (
        <span
          key={i}
          className="konami__bit"
          style={{
            left: `${z.sol}%`,
            background: z.renk,
            animationDuration: `${z.sure}s`,
            animationDelay: `${z.gecikme}s`,
            '--konami-rot': `${z.donme}deg`,
          }}
        />
      ))}
      <p className="konami__toast">✦ Gizli mod açıldı — iyi keşifler! ✦</p>
    </div>
  )
}

export default EasterEgg
