import { BookOpen, Code2, Coffee, Target } from 'lucide-react'
import { about } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'

// İçerikteki "icon" anahtarını lucide bileşenine eşler (içerik ↔ sunum ayrımı).
const IKONLAR = {
  coffee: Coffee,
  code: Code2,
  book: BookOpen,
  target: Target,
}

/**
 * About — "Hakkımda": hero'nun kısa tanıtımının ötesinde, kim olduğumu ve
 * nasıl çalıştığımı anlatan editoryal bölüm.
 *
 * Bento'daki "şu an" kartları ile zaman çizelgesinin arasında durur: önce
 * kim olduğum (Hakkımda), sonra buraya nasıl geldiğim (Yolculuk). Solda serif
 * vurgulu prose, sağda küçük "gerçekler" paneli. İçerik content.js'ten gelir.
 */
function About() {
  const ref = useScrollReveal()

  return (
    <section
      id="hakkimda"
      className="about reveal"
      ref={ref}
      aria-labelledby="hakkimda-baslik"
    >
      <header className="about__header">
        <p className="card-label" id="hakkimda-baslik">
          Hakkımda
        </p>
        <p className="about__lead">{about.lead}</p>
      </header>

      <div className="about__body">
        <div className="about__prose">
          {about.paragraphs.map((paragraf, sira) => (
            <p key={sira} className="about__paragraph">
              {paragraf}
            </p>
          ))}
        </div>

        <ul className="about__facts" aria-label="Kısaca">
          {about.facts.map((gercek) => {
            const Ikon = IKONLAR[gercek.icon] ?? Target
            return (
              <li key={gercek.id} className="about__fact">
                <span className="about__fact-icon" aria-hidden="true">
                  <Ikon size={16} />
                </span>
                {gercek.text}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default About
