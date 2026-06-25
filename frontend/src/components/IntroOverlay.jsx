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
 *  3. SSR/hydration — sunucu ve istemci ilk render'ı AYNI olmalı: ikisi de
 *     perdeyi "açık" çizer (deterministik). Tarayıcıya özel karar (tekrar
 *     gezildi mi / hareket azaltıldı mı) yalnızca mount sonrası effect'te
 *     verilir; window/sessionStorage render sırasında okunmaz (SSR güvenli).
 *
 * Dekoratiftir (aria-hidden): içerik zaten sayfada; ekran okuyucu tekrarlamaz.
 */
function IntroOverlay() {
  // Başlangıç sabit: sunucu + istemci ilk render'ı "açık" → hydration uyumlu.
  const [durum, setDurum] = useState('acik')

  // Mount sonrası (yalnızca istemci): tekrar gezen / reduced-motion kullanıcıda
  // perdeyi hemen kaldır; ilk ziyarette kısa açılış animasyonunu çalıştır.
  useEffect(() => {
    const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gorulmus = sessionStorage.getItem('now-page-intro') === '1'
    if (azalt || gorulmus) {
      // Hydration guard: perde kararı tarayıcıya özeldir (sessionStorage/reduced-motion),
      // yalnızca mount sonrası verilir; ilk render sunucu+istemcide 'acik' olarak eşleşir.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDurum('gizli')
      return
    }
    sessionStorage.setItem('now-page-intro', '1')
    const zamanlayici = setTimeout(() => setDurum('kapaniyor'), 1150)
    return () => clearTimeout(zamanlayici)
  }, [])

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
