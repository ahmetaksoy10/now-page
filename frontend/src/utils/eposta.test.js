import { describe, it, expect } from 'vitest'
import { epostaHatasi } from './eposta.js'

describe('epostaHatasi', () => {
  it('boş girdide uyarı verir', () => {
    expect(epostaHatasi('')).toBe('E-posta adresinizi girin.')
    expect(epostaHatasi('   ')).toBe('E-posta adresinizi girin.')
  })

  it('geçerli adres için null döndürür (hata yok)', () => {
    expect(epostaHatasi('ahmet@gmail.com')).toBeNull()
    expect(epostaHatasi('a.aksoy_17@sirket.co.uk')).toBeNull()
  })

  it('bozuk formatı reddeder', () => {
    expect(epostaHatasi('notanemail')).toBe('Geçerli bir e-posta adresi girin.')
    expect(epostaHatasi('a@b')).toBe('Geçerli bir e-posta adresi girin.')
    expect(epostaHatasi('a..b@x.com')).toBe('Geçerli bir e-posta adresi girin.')
  })

  it('yaygın uzantı hatasını yakalar ve doğrusunu önerir (gmail.co → gmail.com)', () => {
    const mesaj = epostaHatasi('ahmet@gmail.co')
    expect(mesaj).toContain('ahmet@gmail.com')
  })

  it('tam alan adı yazım hatasını yakalar (gmial.com → gmail.com)', () => {
    const mesaj = epostaHatasi('ahmet@gmial.com')
    expect(mesaj).toContain('ahmet@gmail.com')
  })
})
