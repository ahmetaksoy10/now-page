import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { profile } from '../data/content.js'

/**
 * konfetiPatlat — Verilen elementin merkezinden küçük bir konfeti patlaması.
 *
 * Saf DOM + CSS: gövdeye geçici, fixed konumlu zerreler eklenir, dışa doğru
 * uçup solar ve animasyon bitince temizlenir. Kütüphane yok, kalıcı DOM yok.
 * "Hareketi azalt" tercihinde hiç çağrılmaz (çağıran taraf kontrol eder).
 */
function konfetiPatlat(kaynak) {
  const r = kaynak.getBoundingClientRect()
  const renkler = ['#e8a33c', '#e1734e', '#f0b65c', '#c8771a']
  const kap = document.createElement('div')
  kap.className = 'confetti'
  kap.style.left = `${r.left + r.width / 2}px`
  kap.style.top = `${r.top + r.height / 2}px`

  for (let i = 0; i < 16; i++) {
    const bit = document.createElement('span')
    bit.className = 'confetti__bit'
    const aci = (Math.PI * 2 * i) / 16 + Math.random() * 0.5
    const uzaklik = 34 + Math.random() * 48
    bit.style.setProperty('--dx', `${Math.cos(aci) * uzaklik}px`)
    bit.style.setProperty('--dy', `${Math.sin(aci) * uzaklik}px`)
    bit.style.setProperty('--rot', `${Math.random() * 600 - 300}deg`)
    bit.style.background = renkler[i % renkler.length]
    kap.appendChild(bit)
  }

  document.body.appendChild(kap)
  setTimeout(() => kap.remove(), 950)
}

/**
 * CopyEmailButton — Tek tıkla e-postayı panoya kopyalayan buton.
 *
 * İşe alımcı dostu detay: "mailto" yerine kopyalama — kimse tarayıcının
 * mail uygulaması açmasını istemez. Modern Clipboard API başarısız olursa
 * (eski tarayıcı / izin yok) gizli input ile execCommand fallback'i devreye
 * girer: her koşulda çalışır (graceful degradation).
 */
function CopyEmailButton({ variant = 'primary' }) {
  const [kopyalandi, setKopyalandi] = useState(false)
  const zamanlayici = useRef(null)
  const butonRef = useRef(null)

  const epostayiKopyala = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // Fallback: görünmez bir input üzerinden eski usul kopyalama
      const girdi = document.createElement('input')
      girdi.value = profile.email
      document.body.appendChild(girdi)
      girdi.select()
      document.execCommand('copy')
      girdi.remove()
    }

    // Küçük bir ödül: kopyalama başarılıysa konfeti (hareketi azalt'ta atla)
    const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!azalt && butonRef.current) konfetiPatlat(butonRef.current)

    // Arka arkaya tıklamalarda zamanlayıcıyı sıfırla
    clearTimeout(zamanlayici.current)
    setKopyalandi(true)
    zamanlayici.current = setTimeout(() => setKopyalandi(false), 2000)
  }

  return (
    <button
      ref={butonRef}
      type="button"
      className={`btn btn--${variant} ${kopyalandi ? 'btn--copied' : ''}`}
      onClick={epostayiKopyala}
      // aria-live: durum değişikliği ekran okuyucuya da duyurulur
      aria-live="polite"
    >
      {kopyalandi ? (
        <>
          <Check size={15} aria-hidden="true" />
          Kopyalandı!
        </>
      ) : (
        <>
          <Copy size={15} aria-hidden="true" />
          {profile.email}
        </>
      )}
    </button>
  )
}

export default CopyEmailButton
