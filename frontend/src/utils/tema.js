
const STORAGE_KEY = 'now-page-theme' // index.html önyükleme script'i ile aynı

function uygula(yeni) {
  document.documentElement.setAttribute('data-theme', yeni)
  try {
    localStorage.setItem(STORAGE_KEY, yeni)
  } catch {
    // Ignore quota/privacy errors
  }
}

export function mevcutTema() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export function temaCevir(origin) {
  const yeni = mevcutTema() === 'dark' ? 'light' : 'dark'
  const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || azalt) {
    uygula(yeni)
    return yeni
  }

  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? window.innerHeight / 2
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const kok = document.documentElement.style
  kok.setProperty('--vt-x', `${x}px`)
  kok.setProperty('--vt-y', `${y}px`)
  kok.setProperty('--vt-r', `${r}px`)

  document.startViewTransition(() => uygula(yeni))
  return yeni
}
