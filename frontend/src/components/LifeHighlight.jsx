import { useState } from 'react'
import { Maximize2, MapPin, Plane } from 'lucide-react'
import { lifeHighlight, romaGaleri } from '../data/content.js'
const galeriIndex = (src) => {
  const idx = romaGaleri.findIndex((g) => g.src === src)
  return idx >= 0 ? idx : 0
}
import BentoCard from './BentoCard.jsx'
import BlurImage from './BlurImage.jsx'
import Modal from './Modal.jsx'
import GalleryViewer from './GalleryViewer.jsx'

function LifeHighlight() {
  const { date, category, title, description, photo, photoAlt, gallery } = lifeHighlight
  const [galeriBaslangic, setGaleriBaslangic] = useState(null)

  return (
    <BentoCard
      span={5}
      label="Hayattan Bir Kare"
      labelId="ani-baslik"
      className="postcard"
    >
      <div className="postcard__frame">
        {/* Köşedeki pul: kesikli çerçeveli mini uçak */}
        <span className="postcard__stamp" aria-hidden="true">
          <Plane size={16} />
        </span>

        {/* Ana kare: tıklayınca tüm galeriyi (slayt gösterisi) açar */}
        <button
          type="button"
          className="postcard__photo-button"
          onClick={() => setGaleriBaslangic(galeriIndex(photo))}
          aria-label="Roma fotoğraf galerisini aç"
        >
          <BlurImage src={photo} alt={photoAlt} className="postcard__photo" loading="lazy" />
          {/* Hover'da beliren "detaylar için tıkla" ipucu (projelerdeki gibi) */}
          <span className="postcard__photo-hint" aria-hidden="true">
            <Maximize2 size={15} />
            Detayları gör
          </span>
        </button>

        {/* Mini film şeridi: her kare de aynı galeriyi açar */}
        <div className="postcard__strip">
          {gallery.map((kare) => (
            <button
              key={kare.src}
              type="button"
              className="postcard__strip-button"
              onClick={() => setGaleriBaslangic(galeriIndex(kare.src))}
              aria-label={`${kare.alt} — galeride aç`}
            >
              <BlurImage
                src={kare.src}
                alt={kare.alt}
                className="postcard__strip-photo"
                loading="lazy"
              />
              {/* Hover'da beliren büyüteç: kare de tıklanabilir */}
              <span className="postcard__strip-hint" aria-hidden="true">
                <Maximize2 size={14} />
              </span>
            </button>
          ))}
        </div>

        <p className="postcard__meta">
          {date} · {category}
        </p>
        <h2 className="postcard__title">
          <MapPin size={17} className="postcard__title-pin" aria-hidden="true" />
          {title}
        </h2>
        <p className="postcard__description">{description}</p>
      </div>

      {/* Tam ekran lightbox: Roma'nın 9 karesi, 1. kareden başlar + otomatik geçiş */}
      <Modal
        open={galeriBaslangic !== null}
        onClose={() => setGaleriBaslangic(null)}
        labelledBy="roma-lightbox-baslik"
        variant="modal--lightbox"
      >
        <h2 id="roma-lightbox-baslik" className="visually-hidden">
          Roma seyahati fotoğraf galerisi
        </h2>
        {galeriBaslangic !== null && (
          <GalleryViewer images={romaGaleri} startIndex={galeriBaslangic} autoAdvance />
        )}
      </Modal>
    </BentoCard>
  )
}

export default LifeHighlight
