import { BookOpen } from 'lucide-react'
import { currentlyReading } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

/**
 * CurrentlyReading — Şu an okunan kitabın editorial kartı.
 *
 * Kitap kapağı harici görsel değildir: gradient, tipografi ve cilt
 * çizgisiyle tamamen CSS'te çizilir. Okuma sebebi serif italik bir
 * alıntı olarak sunulur — dergi sayfası hissi.
 */
function CurrentlyReading() {
  const { title, author, reason, currentPage, totalPages } = currentlyReading
  // İlerleme yüzdesi veriden türetilir — elle yazılmaz
  const ilerleme = Math.round((currentPage / totalPages) * 100)

  return (
    <BentoCard span={7} label="Kütüphanem" labelId="kitap-baslik">
      <div className="reading-card__top">
        {/* CSS ile çizilmiş kitap kapağı */}
        <div className="reading-card__cover" aria-hidden="true">
          <span className="reading-card__cover-spine" />
          <BookOpen size={16} className="reading-card__cover-icon" />
          <span className="reading-card__cover-title">{title}</span>
          <span className="reading-card__cover-author">{author}</span>
        </div>

        <div className="reading-card__meta">
          <h2 className="reading-card__title">{title}</h2>
          <p className="reading-card__author">{author}</p>

          {/* Okuma sebebi: serif italik editorial alıntı */}
          <blockquote className="reading-card__reason">“{reason}”</blockquote>
        </div>
      </div>

      <div className="reading-card__progress">
        <div
          className="progress"
          role="progressbar"
          aria-valuenow={ilerleme}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Okuma ilerlemesi"
        >
          <span
            className="progress__fill"
            style={{ '--progress-value': `${ilerleme}%` }}
          />
        </div>
        <p className="reading-card__progress-text">
          Sayfa {currentPage} / {totalPages} · %{ilerleme}
        </p>
      </div>
    </BentoCard>
  )
}

export default CurrentlyReading
