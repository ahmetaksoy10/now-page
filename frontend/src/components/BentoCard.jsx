import { useScrollReveal } from '../hooks/useScrollReveal.js'

/**
 * kartFareHareketi — İmleç parıltısı için kartın yerel imleç konumunu
 * (--card-x / --card-y) CSS değişkenine yazar. Saf stil mutasyonu →
 * React re-render'ı yok; .card__glow bu değişkenleri okuyup imleci izler.
 */
function kartFareHareketi(olay) {
  const kart = olay.currentTarget
  const r = kart.getBoundingClientRect()
  kart.style.setProperty('--card-x', `${olay.clientX - r.left}px`)
  kart.style.setProperty('--card-y', `${olay.clientY - r.top}px`)
}

/**
 * BentoCard — Bento grid'in ortak kart iskeleti.
 *
 * Tek Sorumluluk: grid'deki yerleşim (span), scroll-reveal girişi, imleç
 * parıltısı ve kart üstündeki küçük etiket (card-label) burada yaşar; içerik
 * component'leri yalnızca kendi içeriğine odaklanır.
 *
 *  span  → 12 kolonluk grid'de kaç kolon kaplayacağı (4, 5, 7, 12)
 *  label → kartın sol üstündeki küçük mono etiket ("ANA ODAK" gibi)
 *  delay → kademeli giriş için ms cinsinden gecikme
 */
function BentoCard({
  span = 12,
  label,
  labelId,
  delay = 0,
  id,
  className = '',
  sticker: Sticker, // karta dair temayı fısıldayan, isteğe bağlı köşe filigranı (lucide/marka ikonu)
  children,
  ...rest // onClick gibi ek davranışlar karta dışarıdan eklenebilir
}) {
  const ref = useScrollReveal()

  return (
    <article
      id={id}
      ref={ref}
      className={`card bento bento--${span} reveal ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
      aria-labelledby={labelId}
      onMouseMove={kartFareHareketi}
      {...rest}
    >
      {/* İmleci izleyen sıcak iç parıltı (hover'da belirir, dekoratif) */}
      <span className="card__glow" aria-hidden="true" />
      {/* Köşe filigranı: karta dair temayı sessizce fısıldar (dekoratif) */}
      {Sticker && (
        <span className="card__sticker" aria-hidden="true">
          <Sticker />
        </span>
      )}
      {label && (
        <p className="card-label" id={labelId}>
          {label}
        </p>
      )}
      {children}
    </article>
  )
}

export default BentoCard
