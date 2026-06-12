import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { profile } from '../data/content.js'

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

    // Arka arkaya tıklamalarda zamanlayıcıyı sıfırla
    clearTimeout(zamanlayici.current)
    setKopyalandi(true)
    zamanlayici.current = setTimeout(() => setKopyalandi(false), 2000)
  }

  return (
    <button
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
