import { useEffect, useState } from 'react'

const KAZANAN_HATLAR = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function kazanan(b) {
  for (const [a, c, d] of KAZANAN_HATLAR) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]
  }
  return null
}

function minimax(b, oyuncu) {
  const k = kazanan(b)
  if (k === 'O') return { skor: 1 }
  if (k === 'X') return { skor: -1 }
  if (b.every(Boolean)) return { skor: 0 }

  let en = oyuncu === 'O' ? { skor: -Infinity } : { skor: Infinity }
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue
    const yeni = b.slice()
    yeni[i] = oyuncu
    const skor = minimax(yeni, oyuncu === 'O' ? 'X' : 'O').skor
    if (oyuncu === 'O' ? skor > en.skor : skor < en.skor) en = { skor, i }
  }
  return en
}

const BASLANGIC_MESAJ = 'Sıra sende (X). 1-9 ile oyna · çıkış: q'

function XoxGame({ onExit }) {
  const [tahta, setTahta] = useState(() => Array(9).fill(''))
  const [durum, setDurum] = useState('oyuncu') 
  const [mesaj, setMesaj] = useState(BASLANGIC_MESAJ)

  useEffect(() => {
    if (durum !== 'dusunuyor') return
    const id = setTimeout(
      () => {
        const yeni = tahta.slice()
        const { i } = minimax(yeni, 'O')
        if (i != null) yeni[i] = 'O'
        setTahta(yeni)
        if (kazanan(yeni) === 'O') {
          setMesaj('Kazandım! Sana beni yenemeyeceğini söylemiştim. Tekrar? (E/H)')
          setDurum('bitti')
        } else if (yeni.every(Boolean)) {
          setMesaj('İyi deneme insan, ama sadece berabere kalabilirsin. Tekrar? (E/H)')
          setDurum('bitti')
        } else {
          setMesaj(BASLANGIC_MESAJ)
          setDurum('oyuncu')
        }
      },
      500 + Math.random() * 500,
    )
    return () => clearTimeout(id)
  }, [durum, tahta])

  useEffect(() => {
    const tus = (e) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault()
        onExit('xox kapatıldı.')
        return
      }
      if (durum === 'bitti') {
        if (e.key === 'e' || e.key === 'E') {
          setTahta(Array(9).fill(''))
          setMesaj(BASLANGIC_MESAJ)
          setDurum('oyuncu')
        } else if (e.key === 'h' || e.key === 'H') {
          e.preventDefault()
          onExit('xox kapatıldı.')
        }
        return
      }
      if (durum !== 'oyuncu') return
      const n = Number(e.key)
      if (!Number.isInteger(n) || n < 1 || n > 9) return
      const idx = n - 1
      if (tahta[idx]) {
        setMesaj('Geçersiz hamle, bu kare dolu.')
        return
      }
      const yeni = tahta.slice()
      yeni[idx] = 'X'
      setTahta(yeni)
      if (kazanan(yeni) === 'X') {
        setMesaj('İnanılmaz, beni yendin! (Bu olmamalıydı 😅) Tekrar? (E/H)')
        setDurum('bitti')
      } else if (yeni.every(Boolean)) {
        setMesaj('Berabere! Tekrar? (E/H)')
        setDurum('bitti')
      } else {
        setMesaj('Yapay Zeka Düşünüyor...')
        setDurum('dusunuyor')
      }
    }
    window.addEventListener('keydown', tus)
    return () => window.removeEventListener('keydown', tus)
  }, [durum, tahta, onExit])

  const renderCell = (i) => {
    const v = tahta[i]
    if (v === 'X') return <span className="term-x">X</span>
    if (v === 'O') return <span className="term-o">O</span>
    return <span className="term-empty">{i + 1}</span>
  }

  return (
    <div className="term-game">
      <div className="term-game__screen term-game__screen--xox xox-board" aria-hidden="true">
        <div className="xox-row">  {renderCell(0)} <span className="sep">|</span> {renderCell(1)} <span className="sep">|</span> {renderCell(2)}</div>
        <div className="xox-sep"> ---+---+---</div>
        <div className="xox-row">  {renderCell(3)} <span className="sep">|</span> {renderCell(4)} <span className="sep">|</span> {renderCell(5)}</div>
        <div className="xox-sep"> ---+---+---</div>
        <div className="xox-row">  {renderCell(6)} <span className="sep">|</span> {renderCell(7)} <span className="sep">|</span> {renderCell(8)}</div>
      </div>
      <p className="term-game__status">{mesaj}</p>
    </div>
  )
}

export default XoxGame
