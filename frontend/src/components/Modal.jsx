import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * Modal — Tüm pencerelerin (proje detayı, fotoğraf galerisi) ortak iskeleti.
 *
 * Profesyonel modal davranışının üç şartı burada toplanır:
 *  1. ESC tuşu ve arka plana tıklama ile kapanır.
 *  2. Açıkken sayfa kaydırması kilitlenir (body scroll lock).
 *  3. createPortal ile <body>'ye render edilir — z-index ve overflow
 *     sorunlarından tamamen bağımsızdır.
 *
 * Açılış animasyonları CSS'tedir: arka plan blur ile kararır,
 * panel yaylanarak yükselir (bkz. App.css → modal-* keyframe'leri).
 */
function Modal({ open, onClose, labelledBy, variant = '', children }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return

    // Modal açılmadan önce odakta olan öğeyi sakla — kapanınca geri verilecek
    const oncekiOdak = document.activeElement

    const tusDinleyici = (olay) => {
      if (olay.key === 'Escape') {
        onClose()
        return
      }
      // Focus trap: Tab ile odak panel içinde döner, arkadaki sayfaya kaçmaz.
      if (olay.key === 'Tab') {
        const odaklanabilir = panelRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        )
        if (!odaklanabilir || odaklanabilir.length === 0) return
        const ilk = odaklanabilir[0]
        const son = odaklanabilir[odaklanabilir.length - 1]
        if (olay.shiftKey && document.activeElement === ilk) {
          olay.preventDefault()
          son.focus()
        } else if (!olay.shiftKey && document.activeElement === son) {
          olay.preventDefault()
          ilk.focus()
        }
      }
    }

    document.addEventListener('keydown', tusDinleyici)
    // Scroll kilidi: modal açıkken arkadaki sayfa kaymaz
    const eskiOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Klavye kullanıcısı için odağı panele taşı
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', tusDinleyici)
      document.body.style.overflow = eskiOverflow
      // Odağı modalı açan öğeye geri ver (klavye kullanıcısı kaybolmaz)
      if (oncekiOdak instanceof HTMLElement) oncekiOdak.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={`modal ${variant}`.trim()} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      {/* Arka plan: tıklayınca kapanır (dekoratif, ekran okuyucu görmez) */}
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="modal__panel" ref={panelRef} tabIndex={-1}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Pencereyi kapat"
        >
          <X size={18} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
