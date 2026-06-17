import { useEffect, useState } from 'react'
import { profile } from '../data/content.js'

/**
 * IntroOverlay — Kısa, zarif sayfa açılış perdesi.
 *
 * İlk yüklemede isim çizilir, ardından perde yukarı kayıp sayfayı açar
 * (~1.9sn toplam). Sinematik bir "giriş" hissi verir ama yolu tıkamaz.
 *
 * Üç ince denge:
 *  1. Oturumda bir kez — sessionStorage ile; aynı sekmede tekrar gezerken
 *     kullanıcıyı her seferinde bekletmez.
 *  2. Hareketi azalt — `prefers-reduced-motion` varsa perde hiç gösterilmez.
 *  3. FOUC yok — başlangıç durumu senkron (lazy initializer) belirlenir,
 *     gerekiyorsa hiç render edilmez (boş bir flaş oluşmaz).
 *
 * Dekoratiftir (aria-hidden): içerik zaten sayfada; ekran okuyucu tekrarlamaz.
 */
function IntroOverlay() {
  const [durum, setDurum] = useState(() => {
    const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gorulmus = sessionStorage.getItem('now-page-intro') === '1'
    return azalt || gorulmus ? 'gizli' : 'acik'
  })

  // Açık → kısa bekleme sonrası perdeyi kapatmaya başla
  useEffect(() => {
    if (durum !== 'acik') return
    sessionStorage.setItem('now-page-intro', '1')
    const zamanlayici = setTimeout(() => setDurum('kapaniyor'), 1150)
    return () => clearTimeout(zamanlayici)
  }, [durum])

  // Kapanış (perde kayma) animasyonu bitince DOM'dan tamamen kaldır
  useEffect(() => {
    if (durum !== 'kapaniyor') return
    const zamanlayici = setTimeout(() => setDurum('gizli'), 800)
    return () => clearTimeout(zamanlayici)
  }, [durum])

  if (durum === 'gizli') return null

  return (
    <div className={`intro ${durum === 'kapaniyor' ? 'intro--leaving' : ''}`} aria-hidden="true">
      <div className="intro__inner">
        <span className="intro__name">{profile.name}</span>
        <span className="intro__tag">şu an — bugünkü ben</span>
        <span className="intro__line" />
      </div>
    </div>
  )
}

export default IntroOverlay
