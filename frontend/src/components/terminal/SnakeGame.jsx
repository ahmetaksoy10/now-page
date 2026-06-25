import { useEffect, useState } from 'react'

/**
 * SnakeGame — Terminal içinde ASCII yılan oyunu.
 *
 * Oyun durumu state'te tutulur; her tick'te fonksiyonel setState ile YENİ bir
 * durum üretilir (immutability → güvenilir re-render, ref'siz). Ok tuşları
 * sayfayı kaydırmasın diye preventDefault edilir.
 */
const GENISLIK = 26
const YUKSEKLIK = 16
const TICK = 110 // ms

function rastgeleYem(yilan) {
  let p
  do {
    p = { x: Math.floor(Math.random() * GENISLIK), y: Math.floor(Math.random() * YUKSEKLIK) }
  } while (yilan.some((s) => s.x === p.x && s.y === p.y))
  return p
}

function yeniOyun() {
  const yilan = [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]
  return {
    yilan,
    yon: { x: 1, y: 0 },
    sonraki: { x: 1, y: 0 },
    yem: rastgeleYem(yilan),
    skor: 0,
    bitti: false,
  }
}

// Bir adım ilerlet — YENİ durum nesnesi döndürür (saf; state'i mutasyona uğratmaz)
function adim(onceki) {
  const s = {
    ...onceki,
    yon: onceki.sonraki,
    yilan: onceki.yilan.map((p) => ({ ...p })),
  }
  const bas = { x: s.yilan[0].x + s.yon.x, y: s.yilan[0].y + s.yon.y }
  if (bas.x < 0 || bas.x >= GENISLIK || bas.y < 0 || bas.y >= YUKSEKLIK) {
    return { ...s, bitti: true }
  }
  if (s.yilan.some((p) => p.x === bas.x && p.y === bas.y)) {
    return { ...s, bitti: true }
  }
  s.yilan.unshift(bas)
  if (bas.x === s.yem.x && bas.y === s.yem.y) {
    s.skor = onceki.skor + 10
    s.yem = rastgeleYem(s.yilan)
  } else {
    s.yilan.pop()
  }
  return s
}

function ciz(s) {
  const satirlar = ['┌' + '─'.repeat(GENISLIK) + '┐']
  for (let y = 0; y < YUKSEKLIK; y++) {
    let satir = '│'
    for (let x = 0; x < GENISLIK; x++) {
      if (s.yilan[0].x === x && s.yilan[0].y === y) satir += '█'
      else if (s.yilan.some((p) => p.x === x && p.y === y)) satir += '▓'
      else if (s.yem.x === x && s.yem.y === y) satir += '◆'
      else satir += ' '
    }
    satirlar.push(satir + '│')
  }
  satirlar.push('└' + '─'.repeat(GENISLIK) + '┘')
  return satirlar.join('\n')
}

function SnakeGame({ onExit }) {
  const [oyun, setOyun] = useState(yeniOyun)

  useEffect(() => {
    const oyunTuslari = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']
    const tus = (e) => {
      if (oyunTuslari.includes(e.key)) e.preventDefault() // sayfa kaymasın
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        onExit('snake kapatıldı.')
        return
      }
      const yonler = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      }
      setOyun((s) => {
        if (s.bitti) {
          return e.key === 'r' || e.key === 'R' ? yeniOyun() : s
        }
        const y = yonler[e.key]
        // 180° geri dönüş engellenir (kendine anında çarpmasın)
        if (y && !(y.x === -s.yon.x && y.y === -s.yon.y)) return { ...s, sonraki: y }
        return s
      })
    }
    window.addEventListener('keydown', tus)
    const id = setInterval(() => {
      setOyun((s) => (s.bitti ? s : adim(s)))
    }, TICK)
    return () => {
      window.removeEventListener('keydown', tus)
      clearInterval(id)
    }
  }, [onExit])

  return (
    <div className="term-game">
      <pre className="term-game__screen" aria-hidden="true">
        {ciz(oyun)}
      </pre>
      <p className="term-game__status">
        {oyun.bitti
          ? `Yılan oyununu bitirdin! Skor: ${oyun.skor} — Tekrar için R · çıkış: q`
          : `Skor: ${oyun.skor}  ·  Yön: ok tuşları  ·  çıkış: q`}
      </p>
    </div>
  )
}

export default SnakeGame
