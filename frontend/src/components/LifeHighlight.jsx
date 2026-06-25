import { useState } from 'react'
import { Maximize2, MapPin, Plane } from 'lucide-react'
import { lifeHighlight, romaGaleri } from '../data/content.js'
import BentoCard from './BentoCard.jsx'
import BlurImage from './BlurImage.jsx'
import Modal from './Modal.jsx'
import GalleryViewer from './GalleryViewer.jsx'

/**
 * LifeHighlight — "Hayattan Bir Kare": gerçek fotoğraflı kartpostal.
 *
 * Ana kare (Kolezyum önünde selfie) + üç karelik mini film şeridi.
 * Herhangi bir fotoğrafa tıklayınca, Roma gezisinin 9 karesinin tamamı tam ekran
 * lightbox galeride açılır: 1. kareden başlar ve projelerdeki gibi kendi kendine
 * (3 sn'de bir) ilerler — fareyle üstüne gelince durur.
 */
function LifeHighlight() {
  const { date, category, title, description, photo, photoAlt, gallery } = lifeHighlight

  // Galeri açık mı? Lightbox her zaman 1. kareden, slayt gösterisi gibi başlar.
  const [galeriAcik, setGaleriAcik] = useState(false)

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
          onClick={() => setGaleriAcik(true)}
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
              onClick={() => setGaleriAcik(true)}
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
        open={galeriAcik}
        onClose={() => setGaleriAcik(false)}
        labelledBy="roma-lightbox-baslik"
        variant="modal--lightbox"
      >
        <h2 id="roma-lightbox-baslik" className="visually-hidden">
          Roma seyahati fotoğraf galerisi
        </h2>
        {galeriAcik && (
          <GalleryViewer images={romaGaleri} startIndex={0} autoAdvance />
        )}
      </Modal>
    </BentoCard>
  )
}

export default LifeHighlight
