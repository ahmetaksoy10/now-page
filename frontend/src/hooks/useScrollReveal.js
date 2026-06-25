import { useEffect, useRef } from 'react'

/**
 * useScrollReveal — Element görünüm alanına (viewport) girdiğinde
 * ".is-visible" sınıfını ekleyen custom hook.
 *
 * Tasarım kararı: Scroll animasyonları için harici kütüphane (AOS, framer-motion)
 * yerine tarayıcının yerleşik IntersectionObserver API'si kullanıldı.
 * Bu yaklaşım sıfır bağımlılık maliyetiyle gelir ve scroll event dinlemediği
 * için ana thread'i yormaz — 60fps akıcılığın garantisi budur.
 * Animasyonun kendisi tamamen CSS'tedir (bkz. App.css → .reveal).
 */
export function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Kullanıcı "hareketi azalt" tercihi yaptıysa animasyonu tamamen atla (a11y).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Animasyon tek seferliktir; görünen elementi izlemeyi bırakarak
            // gereksiz observer maliyetinden kurtuluruz.
            observer.unobserve(entry.target)
          }
        })
      },
      // Element üst kenarı ekranın altından ~110px içeri girince tetiklenir.
      // threshold:0 (oran değil, ilk temas) → aynı satırdaki kartlar (üst kenarları
      // ortak) yükseklik farkından bağımsız AYNI scroll anında, birlikte açılır.
      { threshold: 0, rootMargin: '0px 0px -110px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}
