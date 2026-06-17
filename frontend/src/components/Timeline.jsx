import { Code2, GraduationCap, MapPin, Smartphone, Target } from 'lucide-react'
import { timeline } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

// İçerikteki "icon" anahtarını lucide bileşenine eşler (içerik ↔ sunum ayrımı).
const IKONLAR = {
  school: GraduationCap,
  code: Code2,
  smartphone: Smartphone,
  map: MapPin,
  target: Target,
}

/**
 * TimelineItem — Tek bir kilometre taşı. Kendi scroll-reveal'ını yönetir
 * (her madde viewport'a girince tek tek, soldan sağa belirir). Bu yüzden
 * ayrı bir bileşen: useScrollReveal her örnek için bağımsız bir ref verir.
 */
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

/**
 * Timeline — "Yolculuk": üniversiteden bugüne dikey zaman çizelgesi.
 *
 * Bento grid'in CV'nin anlatamadığı "anlık kesit"ini tamamlar: nereden
 * geldiğimi gösteren kronolojik bir hikâye. Dikey ray + duran noktalar;
 * her madde scroll'la kademeli belirir. Navbar'daki "Yolculuk" linki
 * #yolculuk id'sine kayar (scroll-spy otomatik vurgular).
 */
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
