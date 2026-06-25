import { useEffect, useState } from 'react'

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
