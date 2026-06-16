import { useCountUp } from '../hooks/useCountUp.js'

/**
 * Counter — Görünür olunca 0'dan hedefe sayan küçük sayı bileşeni.
 *
 * GitHub istatistikleri gibi "canlı veri" rakamlarını sarmalar. Veri async
 * geldiği için `baslat` ile animasyonun ne zaman başlayacağı kontrol edilir
 * (veri henüz yoksa 0'da bekler, gelince sayar).
 */
function Counter({ value, duration = 1400, start = true }) {
  const { ref, deger } = useCountUp(value, { sure: duration, baslat: start })
  // inline-block: IntersectionObserver'ın güvenilir ölçebilmesi için
  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {deger}
    </span>
  )
}

export default Counter
