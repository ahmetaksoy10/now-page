import { useScrollReveal } from '../hooks/useScrollReveal.js'

function kartFareHareketi(olay) {
  const kart = olay.currentTarget
  const r = kart.getBoundingClientRect()
  kart.style.setProperty('--card-x', `${olay.clientX - r.left}px`)
  kart.style.setProperty('--card-y', `${olay.clientY - r.top}px`)
}

function BentoCard({
  span = 12,
  label,
  labelId,
  delay = 0,
  id,
  className = '',
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
