import { profile } from '../data/content.js'

/**
 * Footer — Minimalist kapanış satırı.
 *
 * "Son güncelleme" tarihi elle yazılmaz: `new Date()` ile dinamik üretilir
 * ve `Intl.DateTimeFormat` ile Türkçe yerelleştirilir. <time dateTime="...">
 * etiketi tarihi makine-okunur kılar (semantik HTML).
 */
function Footer() {
  const simdi = new Date()
  const biciliTarih = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(simdi)

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__credit">
          © {simdi.getFullYear()} {profile.name}
        </p>
        <p className="footer__made">
          Balıkesir&rsquo;de, bolca kahveyle elle yazıldı — React + Vite
        </p>
        <p className="footer__updated">
          Son güncelleme: <time dateTime={simdi.toISOString()}>{biciliTarih}</time>
        </p>
      </div>
    </footer>
  )
}

export default Footer
