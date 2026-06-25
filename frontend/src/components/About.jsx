import { BookOpen, Code2, Coffee, Target } from 'lucide-react'
import { about } from '../data/content.js'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
const IKONLAR = {
  coffee: Coffee,
  code: Code2,
  book: BookOpen,
  target: Target,
}

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
