import { currentlyReading } from '../data/content.js'
import BentoCard from './BentoCard.jsx'
import BlurImage from './BlurImage.jsx'

/**
 * CurrentlyReading — Şu an okunan kitabın editorial kartı.
 *
 * Gerçek kitap kapağı + serif italik okuma notu = dergi sayfası hissi.
 * İlerleme yüzdesi sayfa sayısından türetilir, elle yazılmaz.
 */
function CurrentlyReading() {
  const { title, author, cover, meta, synopsis, reason, currentPage, totalPages } =
    currentlyReading
  // İlerleme yüzdesi veriden türetilir — elle yazılmaz
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

          {/* Konu özeti: objektif, kitabın ne anlattığı */}
          <p className="reading-card__synopsis">{synopsis}</p>

          {/* Okuma sebebi: serif italik editorial alıntı (kişisel) */}
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
