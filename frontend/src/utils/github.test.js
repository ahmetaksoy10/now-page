import { describe, it, expect } from 'vitest'
import { dilRengi, haftalaraBol, guncelSeri } from './github.js'

describe('dilRengi', () => {
  it('bilinen dil için resmi rengi döndürür', () => {
    expect(dilRengi('Python')).toBe('#3572A5')
    expect(dilRengi('JavaScript')).toBe('#f1e05a')
  })

  it('bilinmeyen dil için accent değişkenine düşer', () => {
    expect(dilRengi('Brainfuck')).toBe('var(--accent)')
    expect(dilRengi(undefined)).toBe('var(--accent)')
  })
})

describe('haftalaraBol', () => {
  const gunlerUret = (n, baslangic = '2025-01-01') => {
    const out = []
    const d = new Date(baslangic)
    for (let i = 0; i < n; i++) {
      const t = new Date(d)
      t.setDate(d.getDate() + i)
      out.push({ date: t.toISOString().slice(0, 10), count: i % 3, level: i % 5 })
    }
    return out
  }

  it('ilk haftaya, ilk günün haftanın gününe göre baştan boşluk ekler', () => {
    const gunler = gunlerUret(10)
    const haftalar = haftalaraBol(gunler)
    const lead = new Date(gunler[0].date).getDay() // 0=Pazar
    for (let i = 0; i < lead; i++) expect(haftalar[0][i]).toBeNull()
    expect(haftalar[0][lead]).toEqual(gunler[0])
  })

  it('her haftayı tam 7 güne tamamlar (son hafta null ile doldurulur)', () => {
    const haftalar = haftalaraBol(gunlerUret(10))
    haftalar.forEach((hafta) => expect(hafta).toHaveLength(7))
  })
})

describe('guncelSeri', () => {
  it('sondan başa ardışık katkılı günleri sayar', () => {
    expect(guncelSeri([{ count: 1 }, { count: 0 }, { count: 2 }, { count: 3 }])).toBe(2)
  })

  it('bugün (son gün) 0 ise seriyi bozmaz, dünden geriye sayar', () => {
    expect(guncelSeri([{ count: 1 }, { count: 1 }, { count: 1 }, { count: 0 }])).toBe(3)
  })

  it('hiç katkı yoksa 0 döndürür', () => {
    expect(guncelSeri([{ count: 0 }, { count: 0 }, { count: 0 }])).toBe(0)
  })
})
