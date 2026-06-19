import { lastUpdated, profile } from '../data/content.js'

/**
 * Footer — Minimalist kapanış satırı.
 *
 * "Son güncelleme" tarihi content.js'teki gerçek `lastUpdated` değerinden gelir
 * (sayfanın açıldığı an değil, içeriğin son gerçekten değiştirildiği gün) ve
 * `Intl.DateTimeFormat` ile Türkçe yerelleştirilir. <time dateTime="..."> etiketi
 * tarihi makine-okunur kılar (semantik HTML). Hero'daki damga ile aynı kaynak.
 */
function Footer() {
  const guncellemeTarihi = new Date(lastUpdated)
  const biciliTarih = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(guncellemeTarihi)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__credit">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="footer__made">
          Balıkesir&rsquo;de, bolca kahveyle elle yazıldı — React + Vite
        </p>
        <p className="footer__updated">
          Son güncelleme: <time dateTime={lastUpdated}>{biciliTarih}</time>
        </p>
      </div>
    </footer>
  )
}

export default Footer
