import { Code2, GraduationCap, MapPin, Smartphone, Target, Trophy } from 'lucide-react'
import { timeline } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
const IKONLAR = {
  school: GraduationCap,
  code: Code2,
  smartphone: Smartphone,
  map: MapPin,
  target: Target,
  trophy: Trophy,
}

function TimelineItem({ olay, sira }) {
  const ref = useScrollReveal()
  const Ikon = IKONLAR[olay.icon] ?? Target

  return (
    <li
      ref={ref}
      className="timeline__item reveal"
      style={{ '--reveal-delay': `${sira * 60}ms` }}
    >
      <span className="timeline__node" aria-hidden="true">
        <Ikon size={15} />
      </span>
      <div className="timeline__content">
        <span className="timeline__date">{olay.date}</span>
        <h3 className="timeline__title">{olay.title}</h3>
        <p className="timeline__text">{olay.text}</p>
      </div>
    </li>
  )
}

function Timeline() {
  return (
    <section className="timeline-section" id="yolculuk" aria-labelledby="yolculuk-baslik">
      <header className="timeline-section__header">
        <p className="card-label" id="yolculuk-baslik">
          Yolculuk
        </p>
        <h2 className="timeline-section__title">
          Buraya nasıl <em>geldim</em>
        </h2>
      </header>

      <ol className="timeline">
        {timeline.map((olay, sira) => (
          <TimelineItem key={olay.id} olay={olay} sira={sira} />
        ))}
      </ol>
    </section>
  )
}

export default Timeline
