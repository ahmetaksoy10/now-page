import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { goreceliZaman, kapakSec, PLACEHOLDER } from './lastfm.js'

describe('goreceliZaman', () => {
  // Zamanı sabitle → testler "şu an"dan bağımsız, deterministik olsun
  const SIMDI = new Date('2025-06-01T12:00:00Z')
  const simdiSn = Math.floor(SIMDI.getTime() / 1000)

  beforeEach(() => vi.useFakeTimers().setSystemTime(SIMDI))
  afterEach(() => vi.useRealTimers())

  it('90 sn altını "az önce" sayar', () => {
    expect(goreceliZaman(simdiSn - 30)).toBe('az önce')
  })
  it('dakikaları gösterir', () => {
    expect(goreceliZaman(simdiSn - 600)).toBe('10 dk önce')
  })
  it('saatleri gösterir', () => {
    expect(goreceliZaman(simdiSn - 7200)).toBe('2 saat önce')
  })
  it('tam bir günü "dün" der', () => {
    expect(goreceliZaman(simdiSn - 86400)).toBe('dün')
  })
  it('çok günü "N gün önce" der', () => {
    expect(goreceliZaman(simdiSn - 3 * 86400)).toBe('3 gün önce')
  })
})

describe('kapakSec', () => {
  it('en büyük geçerli kapağı seçer', () => {
    const images = [
      { size: 'small', '#text': 'https://img/s.jpg' },
      { size: 'extralarge', '#text': 'https://img/xl.jpg' },
    ]
    expect(kapakSec(images)).toBe('https://img/xl.jpg')
  })

  it('placeholder (kapak yok) görselini atlar, bir sonraki gerçek kapağı seçer', () => {
    const images = [
      { size: 'extralarge', '#text': `https://lastfm/${PLACEHOLDER}.png` },
      { size: 'large', '#text': 'https://img/l.jpg' },
    ]
    expect(kapakSec(images)).toBe('https://img/l.jpg')
  })

  it('dizi değilse veya geçerli kapak yoksa null döndürür', () => {
    expect(kapakSec(null)).toBeNull()
    expect(kapakSec(undefined)).toBeNull()
    expect(kapakSec([{ size: 'medium', '#text': '' }])).toBeNull()
  })
})
