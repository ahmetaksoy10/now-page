import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Otomatik geçişin bekleme süresi (ms)
const OTOMATIK_GECIS_SURESI = 3000

/**
 * GalleryViewer — Ana sahne + küçük resim şeridi + klavye desteğiyle galeri.
 *
 * Hem proje detay modalında hem Roma fotoğraf lightbox'ında kullanılır
 * (tek sorumluluk: görsel gezdirmek — nerede durduğunu bilmez).
 *
 * Detaylar:
 *  - `key={aktif}` hilesi: görsel değişince React elementi yeniden yaratır,
 *    böylece CSS giriş animasyonu (gallery-fade) her karede tekrar oynar.
 *  - Ok tuşları ile gezinme; sayaç ekran okuyucuya da durum bildirir.
 *  - Döngüsel gezinme: son kareden ileri = ilk kare.
 *  - `autoAdvance` açıkken kareler 3 sn'de bir kendiliğinden ilerler;
 *    kullanıcı elle gezinince ya da fareyi sahnenin üstüne getirince durur.
 */
function GalleryViewer({ images, startIndex = 0, autoAdvance = false }) {
  const [aktif, setAktif] = useState(startIndex)
  // Fare sahnenin üstündeyken otomatik geçiş duraklar (kullanıcı inceliyordur)
  const [duraklat, setDuraklat] = useState(false)
  const toplam = images.length

  const ileri = useCallback(() => setAktif((i) => (i + 1) % toplam), [toplam])
  const geri = useCallback(() => setAktif((i) => (i - 1 + toplam) % toplam), [toplam])

  // Klavye okları: modal açıkken galeriyi gezdirir
  useEffect(() => {
    if (toplam < 2) return
    const tusDinleyici = (olay) => {
      if (olay.key === 'ArrowRight') ileri()
      if (olay.key === 'ArrowLeft') geri()
    }
    document.addEventListener('keydown', tusDinleyici)
    return () => document.removeEventListener('keydown', tusDinleyici)
  }, [ileri, geri, toplam])

  // Otomatik geçiş: `aktif` bağımlılığı sayesinde her kare değişiminde
  // (elle ya da otomatik) zamanlayıcı sıfırlanır — yani elle ilerlettiğinizde
  // sonraki otomatik geçiş yine tam 3 sn sonra olur, "çift atlama" yaşanmaz.
  useEffect(() => {
    if (!autoAdvance || toplam < 2 || duraklat) return
    const zamanlayici = setTimeout(ileri, OTOMATIK_GECIS_SURESI)
    return () => clearTimeout(zamanlayici)
  }, [autoAdvance, toplam, duraklat, aktif, ileri])

  if (toplam === 0) return null
  const gorsel = images[aktif]

  return (
    <figure className="gallery">
      <div
        className="gallery__stage"
        onMouseEnter={() => setDuraklat(true)}
        onMouseLeave={() => setDuraklat(false)}
      >
        {/* key={aktif}: her kare değişiminde giriş animasyonu tekrar oynar */}
        <img
          key={aktif}
          src={gorsel.src}
          alt={gorsel.alt}
          className="gallery__image"
          loading="lazy"
          decoding="async"
        />

        {toplam > 1 && (
          <>
            <button
              type="button"
              className="gallery__nav gallery__nav--prev"
              onClick={geri}
              aria-label="Önceki görsel"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="gallery__nav gallery__nav--next"
              onClick={ileri}
              aria-label="Sonraki görsel"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <span className="gallery__counter" aria-live="polite">
              {aktif + 1} / {toplam}
            </span>

            {/* Otomatik geçiş ilerleme çizgisi: her karede sıfırdan dolar.
                key={aktif} ile animasyon her geçişte yeniden başlar. */}
            {autoAdvance && !duraklat && (
              <span
                key={aktif}
                className="gallery__autobar"
                style={{ '--auto-duration': `${OTOMATIK_GECIS_SURESI}ms` }}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>

      {/* Kare açıklaması: yalnızca künyeli galerilerde (ör. Roma) görünür;
          proje ekran görüntülerinde title/description olmadığı için gizli kalır.
          `aktif` değişince içerik kendiliğinden güncellenir. */}
      {(gorsel.title || gorsel.description || gorsel.location) && (
        <figcaption className="gallery__caption">
          {gorsel.title && <span className="gallery__caption-title">{gorsel.title}</span>}
          {gorsel.description && (
            <span className="gallery__caption-text">{gorsel.description}</span>
          )}
          {gorsel.location && (
            <span className="gallery__caption-loc">📍 {gorsel.location}</span>
          )}
        </figcaption>
      )}

      {toplam > 1 && (
        <div className="gallery__thumbs">
          {images.map((kare, sira) => (
            <button
              key={kare.src}
              type="button"
              className={`gallery__thumb ${sira === aktif ? 'is-active' : ''}`}
              onClick={() => setAktif(sira)}
              aria-label={`${sira + 1}. görsele git`}
              aria-current={sira === aktif}
            >
              <img src={kare.src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </figure>
  )
}

export default GalleryViewer
