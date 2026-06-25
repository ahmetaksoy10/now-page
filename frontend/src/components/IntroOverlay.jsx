import { useEffect, useState } from 'react'
import { profile } from '../data/content.js'

// Açılış perdesinin terminal satırları — UI'a özel dekoratif metin (içerik değil),
// bu yüzden content.js'te değil burada sabit dizi olarak tutulur.
const TERMINAL_SATIRLARI = [
  '> yükleniyor: projeler...',
  '> github: bağlandı ✓',
  '> durum: staja açık',
  '> hoş geldiniz.',
]

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
  // Kaç terminal satırının göründüğü (0'dan başlar, sırayla artar)
  const [gorunenSatir, setGorunenSatir] = useState(0)

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

    // Terminal satırları: isim animasyonundan sonra (600ms) 180ms arayla sırayla belirir.
    // (setState'ler setTimeout içinde → asenkron, "effect içinde senkron setState" değil.)
    const satirZamanlayicilari = TERMINAL_SATIRLARI.map((_, i) =>
      setTimeout(() => setGorunenSatir((n) => Math.max(n, i + 1)), 600 + i * 180),
    )
    // Son satır (~1140ms) görününce perde kapanmaya başlar (en geç 1400ms).
    const kapatma = setTimeout(() => setDurum('kapaniyor'), 1400)

    return () => {
      satirZamanlayicilari.forEach(clearTimeout)
      clearTimeout(kapatma)
    }
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

        {/* Terminal satırları: isim + çizgiden sonra, altında sırayla belirir */}
        <div className="intro__terminal">
          {TERMINAL_SATIRLARI.map((satir, i) => (
            <span
              key={satir}
              className={`intro__term-line ${i < gorunenSatir ? 'is-visible' : ''}`}
            >
              {satir}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IntroOverlay
