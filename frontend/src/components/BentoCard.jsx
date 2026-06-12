import { useScrollReveal } from '../hooks/useScrollReveal.js'

/**
 * BentoCard — Bento grid'in ortak kart iskeleti.
 *
 * Tek Sorumluluk: grid'deki yerleşim (span), scroll-reveal girişi ve
 * kart üstündeki küçük etiket (card-label) burada yaşar; içerik
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
  children,
}) {
  const ref = useScrollReveal()

  return (
    <article
      id={id}
      ref={ref}
      className={`card bento bento--${span} reveal ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
      aria-labelledby={labelId}
    >
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
