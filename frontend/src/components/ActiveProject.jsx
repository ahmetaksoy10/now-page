import { useState } from 'react'
import { ArrowUpRight, FolderGit2, Maximize2 } from 'lucide-react'
import { GitHubIcon } from './icons/BrandIcons.jsx'
import { activeProject, otherProjects } from '../data/content.js'
import BentoCard from './BentoCard.jsx'
import BlurImage from './BlurImage.jsx'
import ProjectModal from './ProjectModal.jsx'
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

function ActiveProject() {
  const { name, status, description, architecture, stack, repoUrl, liveUrl } =
    activeProject
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
              {repoUrl && (
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
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Canlı Demo
                  <ArrowUpRight size={13} className="text-link__arrow" aria-hidden="true" />
                </a>
              )}
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

      {/* Proje rafı: her kart tıklanınca detay modalını açar.
          Gecikme yok: aynı satırdaki iki kart birlikte, alt satır scroll'la gelir. */}
      {otherProjects.map((proje) => (
        <BentoCard
          key={proje.id}
          span={6}
          className="mini-project mini-project--clickable"
          labelId={`proje-${proje.id}`}
          onClick={() => setAcikProje(proje)}
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
              <BlurImage key={kare.src} src={kare.src} alt={kare.alt} loading="lazy" />
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
