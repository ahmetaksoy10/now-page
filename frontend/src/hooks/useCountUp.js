import { useEffect, useRef, useState } from 'react'

export function useCountUp(hedef, { sure = 1400, baslat = true } = {}) {
  const [deger, setDeger] = useState(0)
  const ref = useRef(null)
  const oynadi = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element || !baslat) return

    const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const gozlemci = new IntersectionObserver(
      (girisler) => {
        if (girisler[0].isIntersecting && !oynadi.current) {
          oynadi.current = true // tek seferlik
          gozlemci.unobserve(element)
          if (azalt) {
            setDeger(hedef)
            return
          }

          const baslangic = performance.now()
          const adim = (simdi) => {
            const ilerleme = Math.min((simdi - baslangic) / sure, 1)
            const egri = 1 - Math.pow(1 - ilerleme, 3)
            setDeger(Math.round(hedef * egri))
            if (ilerleme < 1) requestAnimationFrame(adim)
          }
          requestAnimationFrame(adim)
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )

    gozlemci.observe(element)
    return () => gozlemci.disconnect()
  }, [hedef, sure, baslat])

  return { ref, deger }
}
