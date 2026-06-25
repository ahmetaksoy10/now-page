import { useEffect, useState } from 'react'

/**
 * DinoGame — Terminal içinde metin tabanlı sonsuz koşu.
 *
 * Sabit boyutlu karakter ızgarası (<pre>) üzerine çizilir. Fizik (yerçekimi +
 * zıplama) sabit zaman adımıyla (accumulator) ilerler → ekran tazeleme hızından
 * bağımsız tutarlı. Engeller sağdan sola kayar, hız zamanla yavaşça artar.
 * Space/↑ zıplatır (havadayken tekrar zıplanamaz). Space ve ok tuşlarında
 * preventDefault → sayfa kaymaz. Durum state'te, her kare YENİ nesneyle güncellenir.
 */
const GENISLIK = 50
const YUKSEKLIK = 9
const ZEMIN = YUKSEKLIK - 2 // dino'nun durduğu satır; son satır zemin çizgisi
const DINO_X = 6
const ADIM = 24 // ms sabit fizik adımı
const YERCEKIMI = 0.05
const ZIPLA = -0.62

function yeniOyun() {
  return {
    dinoY: ZEMIN,
    vy: 0,
    yerde: true,
    engeller: [{ x: GENISLIK + 6 }],
    hiz: 0.45, // kolon / adım
    mesafe: 0,
    skor: 0,
    bitti: false,
  }
}

// Tek fizik adımı — YENİ durum döndürür (saf)
function adim(onceki) {
  const s = { ...onceki, engeller: onceki.engeller.map((e) => ({ ...e })) }
  s.hiz = onceki.hiz + 0.0007 // zamanla hızlan
  // Dikey fizik
  s.dinoY = onceki.dinoY + onceki.vy
  s.vy = onceki.vy + YERCEKIMI
  if (s.dinoY >= ZEMIN) {
    s.dinoY = ZEMIN
    s.vy = 0
    s.yerde = true
  }
  // Engeller: kayma + çarpışma (kolonu geçtiği adımda yakala; hız >1 olsa da kaçmaz)
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
  for (let x = 0; x < GENISLIK; x++) grid[YUKSEKLIK - 1][x] = '─' // zemin
  for (const e of s.engeller) {
    const x = Math.round(e.x)
    if (x >= 0 && x < GENISLIK) grid[ZEMIN][x] = 'Ψ' // kaktüs
  }
  const dy = Math.round(s.dinoY)
  if (dy >= 0 && dy < YUKSEKLIK) grid[dy][DINO_X] = '█' // dino
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
      birikim = Math.min(birikim + (t - sonZaman), 200) // sekme arka plandayken patlamasın
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
      <pre className="term-game__screen" aria-hidden="true">
        {ciz(oyun)}
      </pre>
      <p className="term-game__status">
        {oyun.bitti
          ? `GAME OVER — Skorun: ${oyun.skor} — Tekrar için R · çıkış: q`
          : `Skor: ${oyun.skor}  ·  Zıpla: Space / ↑  ·  çıkış: q`}
      </p>
    </div>
  )
}

export default DinoGame
