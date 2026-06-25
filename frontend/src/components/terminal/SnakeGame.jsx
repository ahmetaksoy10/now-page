import { useEffect, useState, useRef } from 'react'

const GENISLIK = 26
const YUKSEKLIK = 16
const BASLANGIC_TICK = 130 // ms

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
    tick: BASLANGIC_TICK,
  }
}

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
    s.tick = Math.max(40, s.tick - 3) // Progressive difficulty
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
      else if (s.yem.x === x && s.yem.y === y) satir += '★'
      else satir += ' '
    }
    satirlar.push(satir + '│')
  }
  satirlar.push('└' + '─'.repeat(GENISLIK) + '┘')
  return satirlar.join('\n')
}

function SnakeGame({ onExit }) {
  const [oyun, setOyun] = useState(yeniOyun)
  const touchStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const oyunTuslari = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ']
    const tus = (e) => {
      if (oyunTuslari.includes(e.key)) e.preventDefault()
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault()
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
          if (e.key === 'r' || e.key === 'R') return yeniOyun()
          return s
        }
        const y = yonler[e.key]
        if (y && !(y.x === -s.yon.x && y.y === -s.yon.y)) return { ...s, sonraki: y }
        return s
      })
    }
    window.addEventListener('keydown', tus)
    return () => window.removeEventListener('keydown', tus)
  }, [onExit])

  useEffect(() => {
    if (oyun.bitti) return
    const id = setInterval(() => {
      setOyun((s) => (s.bitti ? s : adim(s)))
    }, oyun.tick)
    return () => clearInterval(id)
  }, [oyun.bitti, oyun.tick])

  const handleTouchStart = (e) => {
    touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    }
  }

  const handleTouchEnd = (e) => {
    if (oyun.bitti) {
       setOyun(yeniOyun())
       return
    }
    const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
    }
    const dx = touchEnd.x - touchStart.current.x
    const dy = touchEnd.y - touchStart.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (Math.max(absDx, absDy) > 30) {
        setOyun(s => {
            const y = absDx > absDy 
                ? (dx > 0 ? {x: 1, y: 0} : {x: -1, y: 0}) 
                : (dy > 0 ? {x: 0, y: 1} : {x: 0, y: -1})
            if (y && !(y.x === -s.yon.x && y.y === -s.yon.y)) return { ...s, sonraki: y }
            return s
        })
    }
  }

  return (
    <div className="term-game" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ touchAction: 'none' }}>
      <pre className="term-game__screen" aria-hidden="true" style={{ color: 'var(--t-accent)', textShadow: '0 0 5px var(--t-accent)' }}>
        {ciz(oyun).split('★').map((part, index, arr) => (
          <span key={index}>
            {part}
            {index < arr.length - 1 && <span className="term-o">★</span>}
          </span>
        ))}
      </pre>
      <p className="term-game__status">
        {oyun.bitti
          ? `Yılan oyununu bitirdin! Skor: ${oyun.skor} — Tekrar için R · çıkış: q`
          : `Skor: ${oyun.skor} (Hız: ${Math.round(1000/oyun.tick)}x) · Yön: kaydır/ok tuşları · çıkış: q`}
      </p>
    </div>
  )
}

export default SnakeGame
