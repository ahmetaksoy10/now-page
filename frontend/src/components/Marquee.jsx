import { marqueeItems } from '../data/content.js'

/**
 * Marquee — Hero'nun altında sonsuz kayan teknoloji + kişilik şeridi.
 *
 * Sonsuz döngü hilesi: liste DOM'a iki kez basılır, CSS animasyonu
 * şeridi tam %50 kaydırınca ikinci kopya birincinin yerini almış olur —
 * göz hiçbir "zıplama" görmez. Hover'da durur (okunabilirlik).
 * aria-hidden: dekoratif içerik, ekran okuyucuya iki kez okutulmaz.
 */
function Marquee() {
  // Kusursuz döngü için listenin iki kopyası art arda akar
  const seritOgeleri = [...marqueeItems, ...marqueeItems]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {seritOgeleri.map((oge, sira) => (
          <span key={`${oge}-${sira}`} className="marquee__item">
            {oge}
            <span className="marquee__star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
