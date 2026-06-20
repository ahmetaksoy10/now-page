/**
 * tema — Dark/Light tema geçişini yöneten tek kaynak.
 *
 * Tema bilgisi React state'inde değil, <html data-theme="..."> attribute'ünde
 * tutulur; tüm renkler CSS değişkenleriyle döner (gereksiz re-render yok).
 *
 * Geçiş: View Transitions API destekleniyorsa (ve "hareketi azalt" kapalıysa)
 * yeni tema, tıklanan noktadan açılan bir daireyle belirir — şık bir an.
 * Desteklenmiyorsa sessizce, anında geçilir (graceful degradation).
 */

const STORAGE_KEY = 'now-page-theme' // index.html önyükleme script'i ile aynı

function uygula(yeni) {
  document.documentElement.setAttribute('data-theme', yeni)
  try {
    localStorage.setItem(STORAGE_KEY, yeni)
  } catch {
    // localStorage kapalıysa (gizli sekme vb.) sessizce devam — kritik değil
  }
}

export function mevcutTema() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

/**
 * Temayı çevirir ve yeni temayı döndürür.
 * @param {{x:number,y:number}} [origin] dairesel geçişin başlangıç noktası
 *        (genelde tıklama koordinatı); verilmezse ekran ortası.
 */
export function temaCevir(origin) {
  const yeni = mevcutTema() === 'dark' ? 'light' : 'dark'
  const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Desteklenmiyor ya da hareket azaltılmışsa: düz geçiş
  if (!document.startViewTransition || azalt) {
    uygula(yeni)
    return yeni
  }

  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? window.innerHeight / 2
  // Dairenin bitiş yarıçapı = noktadan en uzak köşeye olan mesafe (tam kaplar)
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const kok = document.documentElement.style
  kok.setProperty('--vt-x', `${x}px`)
  kok.setProperty('--vt-y', `${y}px`)
  kok.setProperty('--vt-r', `${r}px`)

  document.startViewTransition(() => uygula(yeni))
  return yeni
}
