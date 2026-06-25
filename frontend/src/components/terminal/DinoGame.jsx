import { useEffect, useState } from 'react'

const GENISLIK = 50
const YUKSEKLIK = 9
const ZEMIN = YUKSEKLIK - 2
const DINO_X = 6
const ADIM = 24 
const YERCEKIMI = 0.08
const ZIPLA = -0.75

function yeniOyun() {
  return {
    dinoY: ZEMIN,
    vy: 0,
    yerde: true,
    engeller: [{ x: GENISLIK + 6 }],
    hiz: 0.45, 
    mesafe: 0,
    skor: 0,
    bitti: false,
  }
}

function adim(onceki) {
  const s = { ...onceki, engeller: onceki.engeller.map((e) => ({ ...e })) }
  s.hiz = onceki.hiz + 0.0015 
  s.dinoY = onceki.dinoY + onceki.vy
  s.vy = onceki.vy + YERCEKIMI
  if (s.dinoY >= ZEMIN) {
    s.dinoY = ZEMIN
    s.vy = 0
    s.yerde = true
  }
  for (const e of s.engeller) {
    const onc = e.x
    e.x -= s.hiz
    if (onc >= DINO_X && e.x <= DINO_X && Math.round(s.dinoY) >= ZEMIN) {
      s.bitti = true
    }
  }
  s.engeller = s.engeller.filter((e) => e.x > -2)
  const sonuncu = s.engeller[s.engeller.length - 1]
  if (!sonuncu || sonuncu.x < GENISLIK - (16 + Math.random() * 18)) {
    s.engeller.push({ x: GENISLIK + 2 })
  }
  s.mesafe = onceki.mesafe + s.hiz
  s.skor = Math.floor(s.mesafe)
  return s
}

function ciz(s) {
  const grid = Array.from({ length: YUKSEKLIK }, () => Array(GENISLIK).fill(' '))
  for (let x = 0; x < GENISLIK; x++) grid[YUKSEKLIK - 1][x] = '▓' // Kalın zemin
  for (const e of s.engeller) {
    const x = Math.round(e.x)
    if (x >= 0 && x < GENISLIK) grid[ZEMIN][x] = '█' // Engeller kalın blok
  }
  const dy = Math.round(s.dinoY)
  if (dy >= 0 && dy < YUKSEKLIK) grid[dy][DINO_X] = '☻' // Dino'ya tatlı bir ikon
  return grid.map((r) => r.join('')).join('\n')
}

function DinoGame({ onExit }) {
  const [oyun, setOyun] = useState(yeniOyun)

  useEffect(() => {
    let raf
    let sonZaman = null
    let birikim = 0
    const dongu = (t) => {
      if (sonZaman == null) sonZaman = t
      birikim = Math.min(birikim + (t - sonZaman), 200) 
      sonZaman = t
      let adimSayisi = 0
      while (birikim >= ADIM) {
        adimSayisi++
        birikim -= ADIM
      }
      if (adimSayisi > 0) {
        setOyun((s) => {
          if (s.bitti) return s
          let ns = s
          for (let k = 0; k < adimSayisi && !ns.bitti; k++) ns = adim(ns)
          return ns
        })
      }
      raf = requestAnimationFrame(dongu)
    }
    raf = requestAnimationFrame(dongu)

    const tus = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault()
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault()
        onExit('dino kapatıldı.')
        return
      }
      setOyun((s) => {
        if (s.bitti) {
          return e.key === 'r' || e.key === 'R' ? yeniOyun() : s
        }
        if ((e.key === ' ' || e.key === 'ArrowUp') && s.yerde) {
          return { ...s, vy: ZIPLA, yerde: false }
        }
        return s
      })
    }
    window.addEventListener('keydown', tus)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', tus)
    }
  }, [onExit])



  return (
    <div className="term-game">
      <pre className="term-game__screen" aria-hidden="true" style={{ color: 'var(--t-accent)', textShadow: '0 0 5px var(--t-accent)' }}>
        {ciz(oyun)}
      </pre>
      <p className="term-game__status">
        {oyun.bitti
          ? `GAME OVER — Skorun: ${oyun.skor} — Tekrar için R · çıkış: q`
          : `Skor: ${oyun.skor} (Hız: ${Math.round(oyun.hiz * 100)}x)  ·  Zıpla: Space / ↑  ·  çıkış: q`}
      </p>
    </div>
  )
}

export default DinoGame
