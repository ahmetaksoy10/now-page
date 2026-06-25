export const PLACEHOLDER = '2a96cbd8b46e442fc41c2b86b821562f'
export function goreceliZaman(uts) {
  const saniye = Math.floor(Date.now() / 1000) - Number(uts)
  if (saniye < 90) return 'az önce'
  const dk = Math.round(saniye / 60)
  if (dk < 60) return `${dk} dk önce`
  const saat = Math.round(dk / 60)
  if (saat < 24) return `${saat} saat önce`
  const gun = Math.round(saat / 24)
  return gun === 1 ? 'dün' : `${gun} gün önce`
}
export function kapakSec(images) {
  if (!Array.isArray(images)) return null
  for (const boyut of ['extralarge', 'large', 'medium', 'small']) {
    const bulunan = images.find((g) => g.size === boyut && g['#text'])
    if (bulunan && !bulunan['#text'].includes(PLACEHOLDER)) return bulunan['#text']
  }
  return null
}
