import { Star } from 'lucide-react'
import { currentlyReading } from '../data/content.js'
import BentoCard from './BentoCard.jsx'
import BlurImage from './BlurImage.jsx'

function CurrentlyReading() {
  const {
    title,
    author,
    cover,
    meta,
    quote,
    synopsis,
    reason,
    rating,
    ratingNote,
    nextBook,
    currentPage,
    totalPages,
  } = currentlyReading
  const ilerleme = Math.round((currentPage / totalPages) * 100)

  return (
    <BentoCard span={7} label="Kütüphanem" labelId="kitap-baslik">
      <div className="reading-card__top">
        {/* Gerçek kapak: alt yazı zaten kitabı tanıttığı için dekoratif sayılır */}
        <BlurImage
          src={cover}
          alt={`${title} kitap kapağı`}
          className="reading-card__cover"
          loading="lazy"
        />

        <div className="reading-card__meta">
          <h2 className="reading-card__title">{title}</h2>
          <p className="reading-card__author">{author}</p>

          {/* Kitap künyesi: tür · seri · yıl (sayfa geneliyle aynı chip stili) */}
          <ul className="chip-row reading-card__tags" aria-label="Kitap künyesi">
            {meta.map((etiket) => (
              <li key={etiket} className="chip chip--small">
                {etiket}
              </li>
            ))}
          </ul>

          {/* Kitaptan alıntı: mono, accent — küçük bir epigraf */}
          <p className="reading-card__quote">{quote}</p>

          {/* Konu özeti: objektif, kitabın ne anlattığı */}
          <p className="reading-card__synopsis">{synopsis}</p>

          {/* Okuma sebebi: serif italik editorial alıntı (kişisel) */}
          <blockquote className="reading-card__reason">“{reason}”</blockquote>

          {/* Kişisel değerlendirme: 5 üzerinden yıldız + kısa not */}
          <div className="reading-card__rating">
            <span
              className="reading-card__stars"
              role="img"
              aria-label={`5 üzerinden ${rating} yıldız`}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const dolu = i < rating
                return (
                  <Star
                    key={i}
                    size={15}
                    className={dolu ? '' : 'star--empty'}
                    fill={dolu ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  />
                )
              })}
            </span>
            <p className="reading-card__rating-note">{ratingNote}</p>
          </div>
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
        {/* Sıradaki kitap: ilerleme çubuğunun altında, ince mono satır */}
        <p className="reading-card__next">→ Sırada: {nextBook}</p>
      </div>
    </BentoCard>
  )
}

export default CurrentlyReading
