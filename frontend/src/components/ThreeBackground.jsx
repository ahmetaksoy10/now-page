import { useEffect, useRef } from 'react'
import { initHeroScene } from '../three/heroScene.js'

/**
 * ThreeBackground — Three.js sahnesini sayfaya bağlayan ince React sarmalayıcı.
 *
 * Tek sorumluluğu: canvas'ı mount etmek, sahneyi başlatmak ve component
 * kaldırıldığında `dispose()` ile tüm GPU kaynaklarını + olay dinleyicilerini
 * temizlemek. Tüm 3D mantığı `heroScene.js`'te yaşar (sunum/mantık ayrımı).
 *
 * Sahne fixed konumda, tüm içeriğin arkasında (z-index katmanı CSS'te) durur.
 */
function ThreeBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const dispose = initHeroScene(canvasRef.current)
    // StrictMode çift-mount'una karşı güvenli: cleanup tüm kaynakları bırakır
    return dispose
  }, [])

  return <canvas ref={canvasRef} className="three-bg" aria-hidden="true" />
}

export default ThreeBackground
