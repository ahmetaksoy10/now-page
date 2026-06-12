import { useState } from 'react'
import { ArrowUpRight, Clock3, Crosshair, MapPin } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from './icons/BrandIcons.jsx'
import { profile, currentFocus } from '../data/content.js'
import { useLocalTime } from '../hooks/useLocalTime.js'
import CopyEmailButton from './CopyEmailButton.jsx'

/**
 * HeroSection — Açılış sahnesi: iki kolonlu, asimetrik kompozisyon.
 *
 * Sol: dev tipografi (Inter + Instrument Serif italik karışımı),
 *      kısa tanıtım ve aksiyon butonları (e-posta kopyala, GitHub, LinkedIn).
 * Sağ: GitHub avatarı + üzerine iliştirilmiş "staja açık" sticker'ı ve
 *      canlı bilgi paneli (konum, saniye saniye işleyen yerel saat, odak).
 *
 * Giriş animasyonları sayfa yüklenince kademeli çalışır (hero-enter).
 */
function HeroSection() {
  const yerelSaat = useLocalTime()
  // Avatar yüklenemezse (çevrimdışı vb.) monogram devreye girer
  const [avatarHatasi, setAvatarHatasi] = useState(false)

  return (
    <header className="hero" aria-label="Tanıtım">
      <div className="hero__main">
        <p className="hero__eyebrow hero-enter" style={{ '--enter-delay': '0ms' }}>
          Now Page — Haziran 2026
        </p>

        <h1 className="hero__title">
          <span className="hero__title-line hero-enter" style={{ '--enter-delay': '70ms' }}>
            Şu an.
          </span>
          <span
            className="hero__title-line hero__title-line--serif hero-enter"
            style={{ '--enter-delay': '140ms' }}
          >
            bugünün ben&rsquo;i
          </span>
        </h1>

        <p className="hero__intro hero-enter" style={{ '--enter-delay': '220ms' }}>
          Merhaba, ben <strong>{profile.name}</strong> — {profile.role}. {profile.intro}
        </p>

        <div className="hero__actions hero-enter" style={{ '--enter-delay': '300ms' }}>
          <CopyEmailButton variant="primary" />
          <a
            href="https://github.com/ahmetaksoy10"
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon size={15} aria-hidden="true" />
            GitHub
            <ArrowUpRight size={13} className="btn__arrow" aria-hidden="true" />
          </a>
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
      </div>

      <aside className="hero__side hero-enter" style={{ '--enter-delay': '260ms' }}>
        {/* Avatar: doğrudan GitHub'dan gelir — sayfa her zaman güncel kalır */}
        <div className="hero__portrait">
          {avatarHatasi ? (
            <span className="hero__monogram" aria-hidden="true">
              AA
            </span>
          ) : (
            <img
              src={`https://github.com/${profile.githubUsername}.png`}
              alt={`${profile.name} profil fotoğrafı`}
              width="132"
              height="132"
              loading="eager"
              onError={() => setAvatarHatasi(true)}
            />
          )}
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
            <dd>{currentFocus.tags[0]} ile hackathon</dd>
          </div>
        </dl>
      </aside>
    </header>
  )
}

export default HeroSection
