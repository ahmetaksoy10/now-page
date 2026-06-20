import { useState } from 'react'
import { ArrowUpRight, Send } from 'lucide-react'
import { LinkedInIcon } from './icons/BrandIcons.jsx'
import { contactCta } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

/**
 * ContactCta — Sayfanın finali: işe alımcıya net bir sonraki adım.
 *
 * İyi portfolyolar "peki şimdi ne yapayım?" sorusunu cevapsız bırakmaz.
 * Dev serif italik başlık + doğrudan sayfada doldurulan bir iletişim formu =
 * sürtünmesiz iletişim. Form Formspree'ye `fetch` ile POST edilir (sayfa
 * yenilenmez); durum kullanıcıya kibarca bildirilir.
 */
function ContactCta() {
  const ref = useScrollReveal()
  // 'idle' | 'gonderiliyor' | 'basarili' | 'hata'
  const [durum, setDurum] = useState('idle')

  const gonder = async (olay) => {
    olay.preventDefault()
    const form = olay.currentTarget
    setDurum('gonderiliyor')
    try {
      const yanit = await fetch(contactCta.formAction, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (yanit.ok) {
        setDurum('basarili')
        form.reset()
      } else {
        setDurum('hata')
      }
    } catch {
      setDurum('hata')
    }
  }

  return (
    <section id="iletisim" className="cta reveal" ref={ref} aria-labelledby="cta-baslik">
      <p className="cta__label">{contactCta.label}</p>

      <h2 className="cta__title" id="cta-baslik">
        Birlikte <em>çalışalım</em>
        <span className="cta__title-dot">.</span>
      </h2>

      <p className="cta__note">{contactCta.note}</p>

      <form className="contact-form" onSubmit={gonder}>
        <div className="contact-form__row">
          <label className="contact-form__field">
            <span className="contact-form__label">İsim</span>
            <input
              type="text"
              name="name"
              className="contact-form__input"
              placeholder="Adınız"
              required
              autoComplete="name"
            />
          </label>
          <label className="contact-form__field">
            <span className="contact-form__label">E-posta</span>
            <input
              type="email"
              name="email"
              className="contact-form__input"
              placeholder="ornek@eposta.com"
              required
              autoComplete="email"
            />
          </label>
        </div>

        <label className="contact-form__field">
          <span className="contact-form__label">Mesaj</span>
          <textarea
            name="message"
            className="contact-form__input contact-form__textarea"
            placeholder="Birkaç satır yeter — neyle ilgili konuşalım?"
            rows={4}
            required
          />
        </label>

        <div className="contact-form__footer">
          <button type="submit" className="btn btn--primary" disabled={durum === 'gonderiliyor'}>
            <Send size={15} aria-hidden="true" />
            {durum === 'gonderiliyor' ? 'Gönderiliyor…' : 'Gönder'}
          </button>

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

          {/* Durum geri bildirimi: ekran okuyucuya da duyurulur */}
          <p className="contact-form__status" role="status" aria-live="polite">
            {durum === 'basarili' && (
              <span className="contact-form__status--ok">Mesajınız gönderildi ✓</span>
            )}
            {durum === 'hata' && (
              <span className="contact-form__status--error">
                Bir sorun oluştu, tekrar deneyin.
              </span>
            )}
          </p>
        </div>
      </form>
    </section>
  )
}

export default ContactCta
