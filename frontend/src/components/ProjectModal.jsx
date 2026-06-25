import { ArrowUpRight, Lock } from 'lucide-react'
import { GitHubIcon } from './icons/BrandIcons.jsx'
import Modal from './Modal.jsx'
import GalleryViewer from './GalleryViewer.jsx'
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

function ProjectModal({ project, onClose }) {
  if (!project) return null
  const galeriKareleri = project.gallery.map((kare) => {
    const vitrin = project.screenshots.find((s) => s.src === kare.src)
    return vitrin ? { ...kare, title: vitrin.alt } : kare
  })

  return (
    <Modal
      open={!!project}
      onClose={onClose}
      labelledBy="proje-modal-baslik"
      variant="modal--project"
    >
      <div className="project-modal">
        <header className="project-modal__header">
          <p className="project-modal__eyebrow">Proje Detayı</p>
          <div className="project-modal__title-row">
            <h2 className="project-modal__name" id="proje-modal-baslik">
              {project.name}
            </h2>
            <span
              className={`mini-project__status mini-project__status--${durumSinifi(project.status)}`}
            >
              {project.status}
            </span>
          </div>
          <p className="project-modal__tagline">{project.tagline}</p>
        </header>

        {/* Tüm ekran görüntüleri: 3 sn'de bir otomatik geçer; oklar, küçük
            resimler ve klavye ile de gezilir (fareyle üstüne gelince durur) */}
        <GalleryViewer images={galeriKareleri} autoAdvance />

        <div className="project-modal__body">
          <div className="project-modal__story">
            <h3 className="project-modal__section-title">Proje Hakkında</h3>
            <p className="project-modal__description">{project.longDescription}</p>

            <h3 className="project-modal__section-title">Teknolojiler</h3>
            <ul className="chip-row" aria-label="Kullanılan teknolojiler">
              {project.stack.map((teknoloji) => (
                <li key={teknoloji} className="chip chip--accent">
                  {teknoloji}
                </li>
              ))}
            </ul>

            <div className="project-modal__links">
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  className="btn btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon size={15} aria-hidden="true" />
                  GitHub&rsquo;da İncele
                  <ArrowUpRight size={13} className="btn__arrow" aria-hidden="true" />
                </a>
              ) : (
                <p className="project-modal__private">
                  <Lock size={13} aria-hidden="true" />
                  Kod tabanı şimdilik özel — yayınlandığında burada olacak.
                </p>
              )}
            </div>
          </div>

          <aside className="project-modal__features">
            <h3 className="project-modal__section-title">Öne Çıkanlar</h3>
            <ul className="project-modal__feature-list">
              {project.features.map((ozellik) => (
                <li key={ozellik}>{ozellik}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </Modal>
  )
}

export default ProjectModal
