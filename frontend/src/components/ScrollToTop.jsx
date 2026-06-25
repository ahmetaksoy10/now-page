import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

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
      tabIndex={gorunur ? 0 : -1}
      aria-hidden={!gorunur}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  )
}

export default ScrollToTop
