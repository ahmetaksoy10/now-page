import { useEffect, useState } from 'react'

/**
 * useScrollSpy — Ekranda o an okunan bölümün id'sini döndürür.
 *
 * Navbar'da aktif bölümü vurgulamak için kullanılır. Yaklaşım: viewport'un
 * %40 çizgisini referans alır ve bu çizgiyi geçmiş (üstünde kalan) en son
 * bölümü aktif sayar. Kart boyutundan bağımsız, deterministik çalışır —
 * viewport'tan uzun GitHub kartında bile doğru sonuç verir.
 *
 * Ölçüm rAF ile throttle edilir (scroll sırasında frame başına en fazla bir
 * hesap), setState rAF callback'inde yapılır (senkron effect setState'i değil).
 */
export function useScrollSpy(idler) {
  const [aktif, setAktif] = useState(idler[0] ?? null)

  useEffect(() => {
    let rafId = null

    const hesapla = () => {
      rafId = null
      const cizgi = window.innerHeight * 0.4
      let mevcut = idler[0]
      for (const id of idler) {
        const el = document.getElementById(id)
        // Üst kenarı %40 çizgisini geçmiş son bölüm = o an okunan bölüm
        if (el && el.getBoundingClientRect().top <= cizgi) mevcut = id
      }
      setAktif(mevcut)
    }

    const planla = () => {
      if (rafId == null) rafId = requestAnimationFrame(hesapla)
    }

    planla() // ilk durumu hesapla (rAF içinde → senkron setState değil)
    window.addEventListener('scroll', planla, { passive: true })
    window.addEventListener('resize', planla, { passive: true })
    return () => {
      window.removeEventListener('scroll', planla)
      window.removeEventListener('resize', planla)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [idler])

  return aktif
}
