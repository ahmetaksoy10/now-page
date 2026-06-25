export const SAGLAYICILAR = {
  gmail: 'com',
  googlemail: 'com',
  hotmail: 'com',
  outlook: 'com',
  live: 'com',
  yahoo: 'com',
  icloud: 'com',
  me: 'com',
  yandex: 'com',
  proton: 'me',
  protonmail: 'com',
}
export const YAZIM_HATASI = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'yhaoo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'iclod.com': 'icloud.com',
}
export const EPOSTA_REGEX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i

export function epostaHatasi(deger) {
  const e = deger.trim().toLowerCase()
  if (!e) return 'E-posta adresinizi girin.'
  if (e.includes('..') || !EPOSTA_REGEX.test(e)) return 'Geçerli bir e-posta adresi girin.'

  const [yerel, domain] = e.split('@')
  const nokta = domain.indexOf('.')
  const ad = domain.slice(0, nokta)
  const uzanti = domain.slice(nokta + 1)

  if (SAGLAYICILAR[ad] && uzanti !== SAGLAYICILAR[ad]) {
    return `Şunu mu demek istediniz: ${yerel}@${ad}.${SAGLAYICILAR[ad]} ?`
  }
  if (YAZIM_HATASI[domain]) {
    return `Şunu mu demek istediniz: ${yerel}@${YAZIM_HATASI[domain]} ?`
  }
  return null
}
