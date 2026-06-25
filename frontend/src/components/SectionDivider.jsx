import { useScrollReveal } from '../hooks/useScrollReveal.js'

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
