import { Clock3, Crosshair, MapPin } from 'lucide-react'
import { profile, lastUpdated } from '../data/content.js'
import { useLocalTime } from '../hooks/useLocalTime.js'
import CopyEmailButton from './CopyEmailButton.jsx'

// "Son güncelleme" damgası için kısa Türkçe tarih (ör. "17 Haziran")
const guncellemeKisa = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
}).format(new Date(lastUpdated))

/**
 * HeroSection — Açılış sahnesi: iki kolonlu, asimetrik kompozisyon.
 *
 * Sol: İSİM manşette (işe alımcı ilk bakışta kimin sayfası olduğunu görür),
 *      altında serif italik "now page" mottosu, tanıtım ve aksiyon butonları.
 * Sağ: gerçek profil fotoğrafı + "staja açık" sticker'ı ve canlı bilgi
 *      paneli (konum, saniye saniye işleyen yerel saat, odak).
 *
 * Giriş animasyonları sayfa yüklenince kademeli çalışır (hero-enter).
 */
function HeroSection() {
  const yerelSaat = useLocalTime()

  return (
    <header className="hero" aria-label="Tanıtım">
      <div className="hero__main">
        <div className="hero__eyebrow-row hero-enter" style={{ '--enter-delay': '0ms' }}>
          <p className="hero__eyebrow">Now Page — Haziran 2026</p>
          {/* Now-page'in canlı olduğunu gösteren damga: nabız atan nokta + tarih */}
          <span className="hero__stamp" title={`İçerik en son ${guncellemeKisa} güncellendi`}>
            <span className="hero__stamp-dot" aria-hidden="true" />
            Son güncelleme · {guncellemeKisa}
          </span>
        </div>

        {/* İsim manşette: sayfanın kime ait olduğu ilk saniyede netleşir */}
        <h1 className="hero__title">
          <span className="hero__title-line hero-enter" style={{ '--enter-delay': '70ms' }}>
            {/* İç span: üzerinden periyodik/hover'da altın ışık süpürmesi geçer */}
            <span className="hero__title-name">Ahmet AKSOY</span>
            <span className="hero__title-dot">.</span>
          </span>
          <span
            className="hero__title-line hero__title-line--serif hero-enter"
            style={{ '--enter-delay': '140ms' }}
          >
            şu an — bugünkü ben
          </span>
        </h1>

        <p className="hero__intro hero-enter" style={{ '--enter-delay': '220ms' }}>
          Merhaba! <strong>{profile.role}yim.</strong> {profile.intro}
        </p>

        <div className="hero__actions hero-enter" style={{ '--enter-delay': '300ms' }}>
          <CopyEmailButton variant="primary" />
        </div>
      </div>

      <aside className="hero__side hero-enter" style={{ '--enter-delay': '260ms' }}>
        {/* Gerçek profil fotoğrafı: kimlik bir bakışta */}
        <div className="hero__portrait">
          <img
            src={profile.photo}
            alt={`${profile.name} profil fotoğrafı`}
            width="148"
            height="148"
            loading="eager"
          />
          {/* Hafif eğik sticker: insan eli değmiş hissi veren detay */}
          <span className="hero__sticker">
            <span className="hero__sticker-dot" aria-hidden="true" />
            {profile.status}
          </span>
        </div>

        {/* Canlı bilgi paneli */}
        <dl className="hero__facts">
          <div className="hero__fact">
            <dt>
              <MapPin size={13} aria-hidden="true" /> Konum
            </dt>
            <dd>{profile.location}</dd>
          </div>
          <div className="hero__fact">
            <dt>
              <Clock3 size={13} aria-hidden="true" /> Yerel saat
            </dt>
            {/* Saniyede bir işleyen canlı saat — sayfa "yaşıyor" */}
            <dd className="hero__fact-clock">{yerelSaat}</dd>
          </div>
          <div className="hero__fact">
            <dt>
              <Crosshair size={13} aria-hidden="true" /> Şu anki odak
            </dt>
            <dd>Travio · iOS geliştirme</dd>
          </div>
        </dl>
      </aside>
    </header>
  )
}

export default HeroSection
