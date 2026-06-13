import { useState } from 'react'
import { ArrowUpRight, FolderGit2, Maximize2 } from 'lucide-react'
import { GitHubIcon } from './icons/BrandIcons.jsx'
import { activeProject, otherProjects } from '../data/content.js'
import BentoCard from './BentoCard.jsx'
import ProjectModal from './ProjectModal.jsx'

// Türkçe durum etiketini CSS sınıf adına çevirir ("Tamamlandı" → "tamamlandi").
function durumSinifi(durum) {
  return durum
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, '-')
}

/**
 * ActiveProject — "Projeler" bölgesi: 1 vitrin kartı + 3 raf kartı.
 *
 * Vitrin kartı (12 kolon) iki iç kolona ayrılır: solda hikâye
 * (isim, açıklama, teknolojiler, linkler), sağda mimari kararlar paneli.
 * Raf kartları (4'er kolon) tıklanabilir — her biri ProjectModal'ı açar:
 * tüm ekran görüntüleri, uzun açıklama, özellikler ve GitHub linki.
 */
function ActiveProject() {
  const { name, status, description, architecture, stack, repoUrl, liveUrl } =
    activeProject

  // Açık olan projeyi tutan tek state — null ise modal kapalıdır.
  const [acikProje, setAcikProje] = useState(null)

  return (
    <>
      <BentoCard
        span={12}
        id="projeler"
        label="Projeler — Vitrindeki"
        labelId="proje-baslik"
        className="project-card"
      >
        <div className="project-card__columns">
          <div className="project-card__story">
            <div className="project-card__header">
              <span className="project-card__icon" aria-hidden="true">
                <FolderGit2 size={19} />
              </span>
              <h2 className="project-card__name">{name}</h2>
              <span className="project-card__status">
                <span className="project-card__status-dot" aria-hidden="true" />
                {status}
              </span>
            </div>

            <p className="project-card__description">{description}</p>

            <ul className="chip-row" aria-label="Kullanılan teknolojiler">
              {stack.map((teknoloji) => (
                <li key={teknoloji} className="chip chip--accent">
                  {teknoloji}
                </li>
              ))}
            </ul>

            <div className="project-card__links">
              <a
                href={repoUrl}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon size={14} aria-hidden="true" />
                Kaynak Kod
                <ArrowUpRight size={13} className="text-link__arrow" aria-hidden="true" />
              </a>
              <a
                href={liveUrl}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Canlı Demo
                <ArrowUpRight size={13} className="text-link__arrow" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Mimari kararlar: ayrı panelde — teknik derinlik bir bakışta */}
          <aside className="project-card__architecture-panel">
            <h3 className="project-card__architecture-title">Mimari Kararlar</h3>
            <ul className="project-card__architecture" aria-label="Mimari detaylar">
              {architecture.map((karar) => (
                <li key={karar}>{karar}</li>
              ))}
            </ul>
          </aside>
        </div>
      </BentoCard>

      {/* Proje rafı: her kart tıklanınca detay modalını açar */}
      {otherProjects.map((proje, sira) => (
        <BentoCard
          key={proje.id}
          span={4}
          delay={sira * 70}
          className="mini-project mini-project--clickable"
          labelId={`proje-${proje.id}`}
          onClick={() => setAcikProje(proje)}
          // Karta klavye erişilebilirliği: buton gibi davranır
          role="button"
          tabIndex={0}
          onKeyDown={(olay) => {
            if (olay.key === 'Enter' || olay.key === ' ') {
              olay.preventDefault()
              setAcikProje(proje)
            }
          }}
        >
          {/* Gerçek ekran görüntüleri: tek karelik vitrin ya da üçlü şerit */}
          <div
            className={`mini-project__media ${proje.screenshots.length === 1 ? 'mini-project__media--single' : ''}`}
          >
            {proje.screenshots.map((kare) => (
              <img key={kare.src} src={kare.src} alt={kare.alt} loading="lazy" />
            ))}
            {/* Hover'da beliren "detayları gör" ipucu */}
            <span className="mini-project__expand" aria-hidden="true">
              <Maximize2 size={15} />
              Detayları gör
            </span>
          </div>

          <div className="mini-project__head">
            <h2 className="mini-project__name" id={`proje-${proje.id}`}>
              {proje.name}
            </h2>
            <span
              className={`mini-project__status mini-project__status--${durumSinifi(proje.status)}`}
            >
              {proje.status}
            </span>
          </div>
          <p className="mini-project__description">{proje.description}</p>
          <ul className="chip-row" aria-label="Kullanılan teknolojiler">
            {proje.stack.map((teknoloji) => (
              <li key={teknoloji} className="chip chip--small">
                {teknoloji}
              </li>
            ))}
          </ul>
        </BentoCard>
      ))}

      {/* Detay modalı: açık proje varsa görünür, yoksa hiçbir şey çizmez */}
      <ProjectModal project={acikProje} onClose={() => setAcikProje(null)} />
    </>
  )
}

export default ActiveProject
