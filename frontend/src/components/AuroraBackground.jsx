import { useEffect, useRef } from 'react'

/**
 * AuroraBackground — Sayfanın yaşayan arka planı (saf CSS küreler + hafif canvas).
 *
 * Üç katmanlı hareket, tek bir rAF döngüsünde:
 *  1. Aurora küreleri (CSS keyframe drift) → `.aurora__field` içinde durur.
 *  2. Fare takibi + scroll parallax → `field`'a JS ile tek transform uygulanır
 *     (lerp ile yumuşak; küre drift'iyle çakışmaz çünkü ayrı katman).
 *  3. Parçacıklar → küçük süzülen zerreler, scroll/fare ile farklı hızda kayar
 *     (derinlik hissi), tema rengine uyar, hafifçe twinkle eder.
 *
 * Performans/erişilebilirlik: reduced-motion'da hareket yok (statik küreler,
 * parçacık yok). Gizli sekmede döngü durur. Mobilde parçacık azalır, fare
 * takibi kapanır. Unmount'ta tüm dinleyiciler + rAF temizlenir.
 */
function AuroraBackground() {
  const fieldRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const hareketAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (hareketAzalt) return // statik küreler yeterli; hiçbir döngü/dinleyici kurma

    const mobil = window.matchMedia('(max-width: 768px)').matches
    const field = fieldRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // ── Tema rengini oku (parçacık rengi) — data-theme değişince güncellenir ──
    const koyuMu = () => document.documentElement.getAttribute('data-theme') !== 'light'
    let parcacikRengi = koyuMu() ? '232, 163, 60' : '150, 90, 20'
    const temaGozlemci = new MutationObserver(() => {
      parcacikRengi = koyuMu() ? '232, 163, 60' : '150, 90, 20'
    })
    temaGozlemci.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // ── Canvas boyutu (DPR duyarlı) ──────────────────────────────────────────
    let g = window.innerWidth
    let y = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const boyutla = () => {
      g = window.innerWidth
      y = window.innerHeight
      canvas.width = g * dpr
      canvas.height = y * dpr
      canvas.style.width = `${g}px`
      canvas.style.height = `${y}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    boyutla()

    // ── Parçacıklar ──────────────────────────────────────────────────────────
    const SAYI = mobil ? 28 : 56
    const parcaciklar = Array.from({ length: SAYI }, () => ({
      x: Math.random() * g,
      y: Math.random() * y,
      r: Math.random() * 1.6 + 0.6, // yarıçap
      hiz: Math.random() * 0.18 + 0.05, // yukarı süzülme hızı
      kayma: (Math.random() - 0.5) * 0.12, // yatay sallanma
      faz: Math.random() * Math.PI * 2, // twinkle fazı
      derinlik: Math.random() * 0.6 + 0.4, // parallax/fare katsayısı
    }))

    // ── Etkileşim durumu ─────────────────────────────────────────────────────
    let fareHedefX = 0
    let fareHedefY = 0
    let fareX = 0
    let fareY = 0
    let scrollY = window.scrollY

    const fareHareketi = (olay) => {
      fareHedefX = (olay.clientX / g) * 2 - 1 // -1..1
      fareHedefY = (olay.clientY / y) * 2 - 1
    }
    const scrollGuncelle = () => {
      scrollY = window.scrollY
    }

    if (!mobil) window.addEventListener('mousemove', fareHareketi, { passive: true })
    window.addEventListener('scroll', scrollGuncelle, { passive: true })
    window.addEventListener('resize', boyutla)

    // ── Döngü ────────────────────────────────────────────────────────────────
    let cerceve = null
    let calisiyor = true
    let t = 0

    const cizdir = () => {
      t += 0.016

      // Fareyi yumuşakça takip et (lerp) — ani sıçrama yok
      fareX += (fareHedefX - fareX) * 0.05
      fareY += (fareHedefY - fareY) * 0.05

      // Küre alanı: fare + scroll parallax (scroll'da yukarı doğru hafif kayar)
      const alanX = fareX * 22
      const alanY = fareY * 22 - scrollY * 0.03
      field.style.transform = `translate3d(${alanX.toFixed(1)}px, ${alanY.toFixed(1)}px, 0)`

      // Parçacıklar
      ctx.clearRect(0, 0, g, y)
      for (const p of parcaciklar) {
        // Süzülme: yukarı + hafif yatay sallanma
        p.y -= p.hiz
        p.x += p.kayma + Math.sin(t + p.faz) * 0.08
        // Ekrandan çıkınca alttan geri gir (sarma)
        if (p.y < -4) {
          p.y = y + 4
          p.x = Math.random() * g
        }
        if (p.x < -4) p.x = g + 4
        else if (p.x > g + 4) p.x = -4

        // Parallax + fare: derin parçacıklar daha çok kayar (katmanlı his)
        const ox = fareX * 14 * p.derinlik
        const oy = -scrollY * 0.06 * p.derinlik + fareY * 14 * p.derinlik
        // Twinkle: alfa yavaşça nefes alır
        const alfa = (0.28 + Math.sin(t * 1.3 + p.faz) * 0.22) * p.derinlik
        ctx.beginPath()
        ctx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${parcacikRengi}, ${Math.max(0, alfa).toFixed(3)})`
        ctx.fill()
      }

      if (calisiyor) cerceve = requestAnimationFrame(cizdir)
    }

    // Gizli sekmede durdur (pil/CPU dostu)
    const gorunurluk = () => {
      if (document.hidden) {
        calisiyor = false
        if (cerceve) cancelAnimationFrame(cerceve)
      } else if (!calisiyor) {
        calisiyor = true
        cerceve = requestAnimationFrame(cizdir)
      }
    }
    document.addEventListener('visibilitychange', gorunurluk)

    cizdir()

    return () => {
      calisiyor = false
      if (cerceve) cancelAnimationFrame(cerceve)
      window.removeEventListener('mousemove', fareHareketi)
      window.removeEventListener('scroll', scrollGuncelle)
      window.removeEventListener('resize', boyutla)
      document.removeEventListener('visibilitychange', gorunurluk)
      temaGozlemci.disconnect()
    }
  }, [])

  return (
    <div className="aurora" aria-hidden="true">
      {/* Küre alanı: fare + scroll parallax JS ile buraya uygulanır */}
      <div className="aurora__field" ref={fieldRef}>
        <span className="aurora__blob aurora__blob--1" />
        <span className="aurora__blob aurora__blob--2" />
        <span className="aurora__blob aurora__blob--3" />
        <span className="aurora__blob aurora__blob--4" />
      </div>
      {/* Süzülen parçacıklar */}
      <canvas className="aurora__particles" ref={canvasRef} />
    </div>
  )
}

export default AuroraBackground
