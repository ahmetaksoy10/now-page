import { Circle, CircleCheck } from 'lucide-react'
import { learningBacklog } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

/**
 * LearningBacklog — Öğrenme bekleme listesi (sıradaki hedefler).
 *
 * Tamamlananlar yeşil onay + üstü çizili, bekleyenler boş daire.
 * Üstteki ilerleme oranı elle yazılmaz, veriden türetilir —
 * liste güncellenince çubuk da kendiliğinden güncellenir.
 */
function LearningBacklog() {
  const tamamlanan = learningBacklog.filter((oge) => oge.done).length
  const oran = Math.round((tamamlanan / learningBacklog.length) * 100)

  return (
    <BentoCard span={7} label="Öğrenme Listesi" labelId="backlog-baslik">
      <div className="backlog-card__summary">
        <p className="backlog-card__count">
          {tamamlanan} / {learningBacklog.length} tamamlandı
        </p>
        <div
          className="progress progress--backlog"
          role="progressbar"
          aria-valuenow={oran}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Öğrenme listesi ilerlemesi"
        >
          <span
            className="progress__fill"
            style={{ '--progress-value': `${oran}%` }}
          />
        </div>
      </div>

      {/* Geniş kartta liste iki kolona akar (CSS columns) — dengeli durur */}
      <ul className="backlog-list backlog-list--columns">
        {learningBacklog.map((oge) => (
          <li
            key={oge.id}
            className={`backlog-item ${oge.done ? 'backlog-item--done' : ''}`}
          >
            {oge.done ? (
              <CircleCheck size={16} className="backlog-item__icon" aria-hidden="true" />
            ) : (
              <Circle size={16} className="backlog-item__icon" aria-hidden="true" />
            )}
            <span className="backlog-item__label">
              {oge.label}
              <span className="visually-hidden">
                {oge.done ? ' (tamamlandı)' : ' (sırada)'}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </BentoCard>
  )
}

export default LearningBacklog
