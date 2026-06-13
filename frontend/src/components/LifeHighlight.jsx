import { useState } from 'react'
import { Images, Plane } from 'lucide-react'
import { lifeHighlight, romaGaleri } from '../data/content.js'
import BentoCard from './BentoCard.jsx'
import Modal from './Modal.jsx'
import GalleryViewer from './GalleryViewer.jsx'

/**
 * LifeHighlight — "Hayattan Bir Kare": gerçek fotoğraflı kartpostal.
 *
 * Ana kare (Kolezyum önünde selfie) + üç karelik mini film şeridi.
 * Herhangi bir fotoğrafa tıklayınca, Roma gezisinin 9 karesinin tamamı
 * tam ekran lightbox galeride açılır (o kareden başlayarak).
 */
function LifeHighlight() {
  const { date, category, title, description, photo, photoAlt, gallery } = lifeHighlight

  // Lightbox'ın hangi kareden açılacağını tutar; null ise kapalı.
  const [acikIndex, setAcikIndex] = useState(null)

  // Ana fotoğraf galerinin 1. karesi (roma2); şerit kareleri sırasıyla devam eder.
  // Tıklanan görselin tüm galerideki konumunu bularak lightbox'ı oradan başlatırız.
  const lightboxAc = (kaynak) => {
    const bulunan = romaGaleri.findIndex((kare) => kare.src === kaynak)
    setAcikIndex(bulunan === -1 ? 0 : bulunan)
  }

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

        {/* Ana kare: tıklayınca tüm galeriyi açar */}
        <button
          type="button"
          className="postcard__photo-button"
          onClick={() => lightboxAc(photo)}
          aria-label="Roma fotoğraf galerisini aç"
        >
          <img src={photo} alt={photoAlt} className="postcard__photo" loading="lazy" />
          {/* Hover'da beliren galeri ipucu */}
          <span className="postcard__photo-hint" aria-hidden="true">
            <Images size={15} />
            {romaGaleri.length} fotoğraf
          </span>
        </button>

        {/* Mini film şeridi: her kare kendi konumundan galeriyi açar */}
        <div className="postcard__strip">
          {gallery.map((kare) => (
            <button
              key={kare.src}
              type="button"
              className="postcard__strip-button"
              onClick={() => lightboxAc(kare.src)}
              aria-label={`${kare.alt} — galeride aç`}
            >
              <img
                src={kare.src}
                alt={kare.alt}
                className="postcard__strip-photo"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <p className="postcard__meta">
          {date} · {category}
        </p>
        <h2 className="postcard__title">{title}</h2>
        <p className="postcard__description">{description}</p>
      </div>

      {/* Tam ekran lightbox: Roma'nın 9 karesi, tıklanan kareden başlar */}
      <Modal
        open={acikIndex !== null}
        onClose={() => setAcikIndex(null)}
        labelledBy="roma-lightbox-baslik"
        variant="modal--lightbox"
      >
        <h2 id="roma-lightbox-baslik" className="visually-hidden">
          Roma seyahati fotoğraf galerisi
        </h2>
        {acikIndex !== null && (
          <GalleryViewer images={romaGaleri} startIndex={acikIndex} />
        )}
      </Modal>
    </BentoCard>
  )
}

export default LifeHighlight
