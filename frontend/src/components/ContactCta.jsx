import { ArrowUpRight } from 'lucide-react'
import { LinkedInIcon } from './icons/BrandIcons.jsx'
import { contactCta } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import CopyEmailButton from './CopyEmailButton.jsx'

/**
 * ContactCta — Sayfanın finali: işe alımcıya net bir sonraki adım.
 *
 * İyi portfolyolar "peki şimdi ne yapayım?" sorusunu cevapsız bırakmaz.
 * Dev serif italik başlık + tek tıkla kopyalanan e-posta = sürtünmesiz iletişim.
 */
function ContactCta() {
  const ref = useScrollReveal()

  return (
    <section id="iletisim" className="cta reveal" ref={ref} aria-labelledby="cta-baslik">
      <p className="cta__label">{contactCta.label}</p>

      <h2 className="cta__title" id="cta-baslik">
        Birlikte <em>çalışalım</em>
        <span className="cta__title-dot">.</span>
      </h2>

      <p className="cta__note">{contactCta.note}</p>

      <div className="cta__actions">
        <CopyEmailButton variant="primary" />
        <a
          href="https://www.linkedin.com/in/ahmet-aksoy10"
          className="btn btn--ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon size={14} aria-hidden="true" />
          LinkedIn
          <ArrowUpRight size={13} className="btn__arrow" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

export default ContactCta
