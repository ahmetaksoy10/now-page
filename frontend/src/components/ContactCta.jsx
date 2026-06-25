import { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from './icons/BrandIcons.jsx'
import { contactCta, socialLinks } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { epostaHatasi } from '../utils/eposta.js'
import CopyEmailButton from './CopyEmailButton.jsx'
const githubUrl = socialLinks.find((l) => l.id === 'github').url
const linkedinUrl = socialLinks.find((l) => l.id === 'linkedin').url
async function alanAdiMailAlir(domain) {
  const sor = async (tip) => {
    const r = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${tip}`,
      { headers: { accept: 'application/dns-json' } },
    )
    if (!r.ok) return null
    const j = await r.json()
    return Array.isArray(j.Answer) && j.Answer.length > 0
  }
  try {
    const mx = await sor('MX')
    if (mx === true) return true
    if (mx === null) return true // belirsiz → engelleme
    const a = await sor('A') // MX yoksa implicit MX (A kaydı) kontrolü
    return a === null ? true : a
  } catch {
    return true // ağ hatası → engelleme
  }
}

function dogrula({ name, email, message }) {
  const hata = {}
  if (!name.trim()) hata.name = 'Adınızı girin.'
  const eHata = epostaHatasi(email)
  if (eHata) hata.email = eHata
  if (message.trim().length < 10) hata.message = 'Lütfen birkaç cümle yazın (en az 10 karakter).'
  return hata
}

function ContactCta() {
  const ref = useScrollReveal()
  const [deger, setDeger] = useState({ name: '', email: '', message: '' })
  const [hatalar, setHatalar] = useState({})
  const [durum, setDurum] = useState('idle') // 'idle' | 'gonderiliyor' | 'basarili' | 'hata'
  useEffect(() => {
    if (durum !== 'basarili') return
    const zamanlayici = setTimeout(() => setDurum('idle'), 4200)
    return () => clearTimeout(zamanlayici)
  }, [durum])

  const guncelle = (alan) => (olay) => {
    const v = olay.target.value
    setDeger((d) => ({ ...d, [alan]: v }))
    if (hatalar[alan]) setHatalar((h) => ({ ...h, [alan]: undefined }))
  }

  const gonder = async (olay) => {
    olay.preventDefault()
    const yeniHatalar = dogrula(deger)
    if (Object.keys(yeniHatalar).length > 0) {
      setHatalar(yeniHatalar)
      return
    }
    setHatalar({})
    setDurum('gonderiliyor')
    const domain = deger.email.trim().toLowerCase().split('@')[1]
    if (!(await alanAdiMailAlir(domain))) {
      setHatalar({ email: 'Bu alan adı e-posta alamıyor gibi görünüyor.' })
      setDurum('idle')
      return
    }

    try {
      const yanit = await fetch(contactCta.formAction, {
        method: 'POST',
        body: JSON.stringify(deger),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })
      if (yanit.ok) {
        setDurum('basarili')
        setDeger({ name: '', email: '', message: '' })
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

      <form className="contact-form" onSubmit={gonder} noValidate>
        <div className="contact-form__row">
          <label className="contact-form__field">
            <span className="contact-form__label">İsim</span>
            <input
              type="text"
              name="name"
              className={`contact-form__input ${hatalar.name ? 'is-error' : ''}`}
              placeholder="Adınız"
              value={deger.name}
              onChange={guncelle('name')}
              autoComplete="name"
            />
            {hatalar.name && <span className="contact-form__error">{hatalar.name}</span>}
          </label>

          <label className="contact-form__field">
            <span className="contact-form__label">E-posta</span>
            <input
              type="email"
              name="email"
              className={`contact-form__input ${hatalar.email ? 'is-error' : ''}`}
              placeholder="ornek@eposta.com"
              value={deger.email}
              onChange={guncelle('email')}
              autoComplete="email"
            />
            {hatalar.email && <span className="contact-form__error">{hatalar.email}</span>}
          </label>
        </div>

        <label className="contact-form__field">
          <span className="contact-form__label">Mesaj</span>
          <textarea
            name="message"
            className={`contact-form__input contact-form__textarea ${hatalar.message ? 'is-error' : ''}`}
            placeholder="Birkaç satır yeter — neyle ilgili konuşalım?"
            rows={4}
            value={deger.message}
            onChange={guncelle('message')}
          />
          {hatalar.message && <span className="contact-form__error">{hatalar.message}</span>}
        </label>

        {/* Gönder butonu: kartın ortasında */}
        <div className="contact-form__submit">
          <button type="submit" className="btn btn--primary" disabled={durum === 'gonderiliyor'}>
            <Send size={15} aria-hidden="true" />
            {durum === 'gonderiliyor' ? 'Gönderiliyor…' : 'Gönder'}
          </button>
        </div>

        {/* Durum: başarı mesajı belirir ve birkaç saniye sonra kaybolur */}
        <div className="contact-form__status" role="status" aria-live="polite">
          {durum === 'basarili' && (
            <span className="contact-form__toast contact-form__toast--ok">
              Mesajınız gönderildi ✓
            </span>
          )}
          {durum === 'hata' && (
            <span className="contact-form__toast contact-form__toast--error">
              Bir sorun oluştu, tekrar deneyin.
            </span>
          )}
        </div>
      </form>

      {/* Kart dışında, altta ortalı, yan yana: e-posta kopyala + GitHub + LinkedIn */}
      <div className="cta__links">
        <CopyEmailButton variant="ghost" />
        <a
          href={githubUrl}
          className="btn btn--ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon size={15} aria-hidden="true" />
          GitHub
        </a>
        <a
          href={linkedinUrl}
          className="btn btn--ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon size={14} aria-hidden="true" />
          LinkedIn
        </a>
      </div>
    </section>
  )
}

export default ContactCta
