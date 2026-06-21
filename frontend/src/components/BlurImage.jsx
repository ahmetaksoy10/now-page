import { useEffect, useRef, useState } from 'react'

/**
 * BlurImage — Yüklenirken bulanık başlayıp netleşerek beliren görsel.
 *
 * Sıradan bir <img>'in yerine geçer: tüm prop'ları (src, alt, loading,
 * width, height, className…) olduğu gibi aktarır, üstüne bir "blur-up"
 * geçişi ekler. Görsel inerken alan boş/sert görünmez; yüklenince
 * bulanıklıktan netliğe yumuşakça oturur (Medium tarzı).
 *
 * Sağlamlık: önbellekten anında gelen görseller `load` olayını
 * tetiklemeyebilir; mount'ta `complete` ise hemen "yüklendi" sayılır —
 * böylece hiçbir görsel bulanık takılı kalmaz. Geçişin kendisi CSS'tedir
 * (.blur-img); "hareketi azalt" tercihinde anında net görünür.
 */
function BlurImage({ className = '', onLoad, ...rest }) {
  const [yuklendi, setYuklendi] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current?.complete) setYuklendi(true)
  }, [])

  return (
    <img
      ref={ref}
      className={`blur-img ${yuklendi ? 'is-loaded' : ''} ${className}`.trim()}
      // decoding="async": kod çözme ana thread'i bloklamaz (caller override edebilir)
      decoding="async"
      onLoad={(olay) => {
        setYuklendi(true)
        onLoad?.(olay)
      }}
      {...rest}
    />
  )
}

export default BlurImage
