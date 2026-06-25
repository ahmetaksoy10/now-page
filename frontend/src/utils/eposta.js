// ─────────────────────────────────────────────────────────────────────────────
//  E-posta doğrulama yardımcıları (saf fonksiyonlar)
// ─────────────────────────────────────────────────────────────────────────────
//  ContactCta formundan çıkarıldı: senkron format + yaygın yazım/uzantı hatası
//  kontrolü. Ağ gerektiren DNS/MX kontrolü (alanAdiMailAlir) bileşende kalır.
// ─────────────────────────────────────────────────────────────────────────────

// Bilinen sağlayıcı + doğru uzantısı. "gmail.co", "gmail.con", "gmail.cm"
// gibi yaygın uzantı hataları buradan yakalanır (HTML type=email yakalamaz).
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

// Tam alan adı yazım hataları (gmial.com → gmail.com)
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

// Katı (RFC-5322'ye yakın) format: yerel kısım + geçerli alan adı etiketleri +
// en az 2 harfli TLD. Ardışık nokta, baş/son tire gibi bozuklukları reddeder.
export const EPOSTA_REGEX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i

/**
 * epostaHatasi — Senkron e-posta kontrolü: format + yaygın yazım/uzantı hataları.
 * Hata varsa kullanıcıya gösterilecek Türkçe mesajı, yoksa null döndürür.
 * (Alan adının gerçekten mail alıp almadığı ayrıca DNS ile kontrol edilir.)
 */
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
