import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * ScrollToTop — Bir ekran aşağı inildiğinde sağ altta beliren "yukarı dön"
 * butonu. Uzun tek-sayfada hızlı dönüş sağlar (UX kolaylığı).
 *
 * Görünürlük scroll'a bağlı; tıklayınca yumuşak kaydırma (smooth scroll).
 * 44×44px dokunma hedefi, görünür klavye odağı ve aria-label ile erişilebilir.
 */
function ScrollToTop() {
  const [gorunur, setGorunur] = useState(false)

  useEffect(() => {
    const kontrol = () => setGorunur(window.scrollY > window.innerHeight * 0.8)
    kontrol()
    window.addEventListener('scroll', kontrol, { passive: true })
    return () => window.removeEventListener('scroll', kontrol)
  }, [])

  const yukariCik = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className={`scroll-top ${gorunur ? 'is-visible' : ''}`}
      onClick={yukariCik}
      aria-label="Sayfanın başına dön"
      // Görünmezken klavye/odak sırasından çıkar
      tabIndex={gorunur ? 0 : -1}
      aria-hidden={!gorunur}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  )
}

export default ScrollToTop
