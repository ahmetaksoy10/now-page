import { Plane } from 'lucide-react'
import { lifeHighlight } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

/**
 * LifeHighlight — "Hayattan Bir Kare": kartpostal estetiğinde anı kartı.
 *
 * Now Page felsefesinin kalbi: sayfa sadece koddan ibaret değil.
 * Kesikli çerçeve + köşedeki "pul" (uçak ikonu) + serif başlık,
 * karta gerçek bir seyahat kartpostalı havası verir.
 */
function LifeHighlight() {
  const { date, category, title, description } = lifeHighlight

  return (
    <BentoCard
      span={5}
      label="Hayattan Bir Kare"
      labelId="ani-baslik"
      delay={80}
      className="postcard"
    >
      <div className="postcard__frame">
        {/* Köşedeki pul: kesikli çerçeveli mini uçak */}
        <span className="postcard__stamp" aria-hidden="true">
          <Plane size={16} />
        </span>

        <p className="postcard__meta">
          {date} · {category}
        </p>
        <h2 className="postcard__title">{title}</h2>
        <p className="postcard__description">{description}</p>
      </div>
    </BentoCard>
  )
}

export default LifeHighlight
