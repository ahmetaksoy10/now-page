import { lastUpdated, profile } from '../data/content.js'

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
          Balıkesir&rsquo;de geliştirildi — React + Vite
        </p>
        <p className="footer__updated">
          Son güncelleme: <time dateTime={lastUpdated}>{biciliTarih}</time>
        </p>
      </div>
    </footer>
  )
}

export default Footer
