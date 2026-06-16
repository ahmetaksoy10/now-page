import { useEffect, useRef, useState } from 'react'

/**
 * useCountUp — Bir sayıyı, element görünüm alanına girdiğinde 0'dan hedef
 * değere doğru animasyonlu sayar (counting-up efekti).
 *
 * Neden hook? GitHub istatistikleri, ilerleme yüzdeleri gibi "canlı veri"
 * hissi veren her yerde tekrar kullanılır. IntersectionObserver ile yalnızca
 * görünür olunca tetiklenir; ease-out eğrisiyle doğal yavaşlar.
 *
 *  hedef    — varış değeri (sayı)
 *  sure     — animasyon süresi (ms)
 *  baslat   — false ise (örn. veri henüz gelmediyse) animasyon beklemede kalır
 */
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

          // Hareketi azalt tercihinde animasyon yok — değer anında hedefe atlar.
          if (azalt) {
            setDeger(hedef)
            return
          }

          const baslangic = performance.now()
          const adim = (simdi) => {
            const ilerleme = Math.min((simdi - baslangic) / sure, 1)
            // ease-out cubic: hızlı başlar, yumuşak biter
            const egri = 1 - Math.pow(1 - ilerleme, 3)
            setDeger(Math.round(hedef * egri))
            if (ilerleme < 1) requestAnimationFrame(adim)
          }
          requestAnimationFrame(adim)
        }
      },
      // threshold 0: tek piksel görünür olunca tetikle. Inline sarmalayıcılarda
      // yüksek threshold kararsız olabildiği için en güvenilir eşik budur.
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )

    gozlemci.observe(element)
    return () => gozlemci.disconnect()
  }, [hedef, sure, baslat])

  return { ref, deger }
}
