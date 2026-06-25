import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

function Modal({ open, onClose, labelledBy, variant = '', children }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const oncekiOdak = document.activeElement

    const tusDinleyici = (olay) => {
      if (olay.key === 'Escape') {
        onClose()
        return
      }
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
    const eskiOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', tusDinleyici)
      document.body.style.overflow = eskiOverflow
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
