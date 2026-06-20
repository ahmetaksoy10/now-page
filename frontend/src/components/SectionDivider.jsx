import { useScrollReveal } from '../hooks/useScrollReveal.js'

/**
 * SectionDivider — Bölümler arası ince, ortadan açılan gradient ayraç.
 *
 * Görünür olunca iki çizgi merkezden dışa doğru çizilir, ortadaki ✦ süsü
 * yumuşakça belirir — sayfaya "dergi" ritmi katar. Tamamen dekoratif
 * (aria-hidden); animasyon CSS'te, reduced-motion'da anında görünür.
 */
function SectionDivider() {
  const ref = useScrollReveal()

  return (
    <div ref={ref} className="section-divider" aria-hidden="true">
      <span className="section-divider__line section-divider__line--left" />
      <span className="section-divider__mark">✦</span>
      <span className="section-divider__line section-divider__line--right" />
    </div>
  )
}

export default SectionDivider
