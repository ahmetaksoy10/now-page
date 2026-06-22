import { useState } from 'react'
import { lastUpdated, profile } from '../data/content.js'

/**
 * Footer — Minimalist kapanış satırı.
 *
 * "Son güncelleme" tarihi content.js'teki gerçek `lastUpdated` değerinden gelir
 * (sayfanın açıldığı an değil, içeriğin son gerçekten değiştirildiği gün) ve
 * `Intl.DateTimeFormat` ile Türkçe yerelleştirilir. <time dateTime="..."> etiketi
 * tarihi makine-okunur kılar (semantik HTML). Hero'daki damga ile aynı kaynak.
 *
 * Easter egg: "elle yazıldı" satırına her tıklamada bir kahve eklenir; 5'ten
 * sonra "Yeter artık!" der, bir tık daha sıfırlar. (role=button + klavye erişimi.)
 */
function Footer() {
  const [kahve, setKahve] = useState(0)

  const guncellemeTarihi = new Date(lastUpdated)
  const biciliTarih = new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(guncellemeTarihi)

  // 6. tıklamada "yeter" mesajı, 7.'de baştan
  const kahveEkle = () => setKahve((sayi) => (sayi >= 6 ? 0 : sayi + 1))

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__credit">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p
          className="footer__made"
          role="button"
          tabIndex={0}
          title="Bir kahve daha?"
          onClick={kahveEkle}
          onKeyDown={(olay) => {
            if (olay.key === 'Enter' || olay.key === ' ') {
              olay.preventDefault()
              kahveEkle()
            }
          }}
        >
          Balıkesir&rsquo;de, bolca kahveyle elle yazıldı — React + Vite
          {kahve > 0 && (
            <span className="footer__coffee">
              {kahve < 6 ? '☕'.repeat(kahve) : 'Yeter artık! 🫠'}
            </span>
          )}
        </p>
        <p className="footer__updated">
          Son güncelleme: <time dateTime={lastUpdated}>{biciliTarih}</time>
        </p>
      </div>
    </footer>
  )
}

export default Footer
