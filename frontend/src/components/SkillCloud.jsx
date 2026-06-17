import { skills } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

/**
 * SkillCloud — Hero'nun altındaki yetenek/kişilik bulutu.
 *
 * Eski sonsuz kayan şeridin (marquee) yerini alır. Sürekli hareket yerine
 * sakin, okunabilir bir bulut: etiketler ağırlıklarına (weight 1–3) göre
 * farklı boyutlarda sarılır, hover'da büyüyüp accent rengine geçer.
 * Bulut görünür olunca etiketler kademeli "pop" ile belirir (scroll-reveal).
 *
 * Sunum/içerik ayrımı: hangi yeteneklerin olduğu content.js'te (skills);
 * burada yalnızca bunları çizen mantık var.
 */
function SkillCloud() {
  const ref = useScrollReveal()

  return (
    <section className="skill-cloud-wrap" aria-label="Kullandığım teknolojiler ve ilgi alanlarım">
      {/* useScrollReveal yalnızca is-visible sınıfını ekler; bulut görünür
          olunca çipler tek tek "pop" yapar (görsel giriş çiplerde, ul'de değil) */}
      <ul ref={ref} className="skill-cloud">
        {skills.map((yetenek, sira) => (
          <li
            key={yetenek.label}
            className={`skill-chip skill-chip--w${yetenek.weight} ${
              yetenek.kind === 'fun' ? 'skill-chip--fun' : ''
            }`}
            // Kademeli giriş: her çip biraz daha geç "pop" yapar
            style={{ '--chip-delay': `${sira * 45}ms` }}
          >
            {yetenek.label}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SkillCloud
