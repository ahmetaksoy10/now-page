// ─────────────────────────────────────────────────────────────────────────────
//  Last.fm veri yardımcıları (saf fonksiyonlar)
// ─────────────────────────────────────────────────────────────────────────────
//  CurrentlyListening bileşeninden çıkarıldı: görece zaman biçimleme ve kapak
//  seçimi — ağsız, saf mantık → bağımsız test edilebilir.
// ─────────────────────────────────────────────────────────────────────────────

// Last.fm'in "kapak yok" yıldız görselinin hash'i — gerçek kapak sayılmaz
export const PLACEHOLDER = '2a96cbd8b46e442fc41c2b86b821562f'

// Görece zaman: "az önce", "12 dk önce", "3 saat önce", "dün", "5 gün önce"
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

// image dizisinden en büyük geçerli kapağı seç (placeholder'ı atla)
export function kapakSec(images) {
  if (!Array.isArray(images)) return null
  for (const boyut of ['extralarge', 'large', 'medium', 'small']) {
    const bulunan = images.find((g) => g.size === boyut && g['#text'])
    if (bulunan && !bulunan['#text'].includes(PLACEHOLDER)) return bulunan['#text']
  }
  return null
}
