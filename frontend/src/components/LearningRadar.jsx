import { Atom, Container, Database, GitBranch, Server, Smartphone } from 'lucide-react'
import { learningRadar } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

// content.js'teki "icon" anahtarını gerçek lucide ikonuna çevirir.
const RADAR_IKONLARI = {
  atom: Atom,
  server: Server,
  smartphone: Smartphone,
  git: GitBranch,
  database: Database,
  container: Container,
}

/**
 * LearningRadar — Şu an öğrenilen teknolojilerin kompakt radarı.
 *
 * Tek kart içinde iki kolonlu satır düzeni: ikon + isim + durum rozeti
 * ve altında ince yoğunluk çubuğu. Çubuk dolumları kart görünür olunca
 * tetiklenir (scroll koreografisi) — liste değil, gösterge paneli hissi.
 */
function LearningRadar() {
  return (
    <BentoCard span={7} label="Öğrenim Radarı" labelId="radar-baslik" delay={80}>
      <ul className="radar-list">
        {learningRadar.map((oge) => {
          const Ikon = RADAR_IKONLARI[oge.icon]
          return (
            <li key={oge.id} className="radar-row">
              <span className="radar-row__icon" aria-hidden="true">
                <Ikon size={16} />
              </span>

              <div className="radar-row__body">
                <div className="radar-row__top">
                  <h3 className="radar-row__name">{oge.name}</h3>
                  <span
                    className={`radar-row__stage radar-row__stage--${oge.stage
                      .toLowerCase()
                      .replace(/ş/g, 's')
                      .replace(/ı/g, 'i')}`}
                  >
                    {oge.stage}
                  </span>
                </div>

                <div
                  className="radar-row__meter"
                  role="meter"
                  aria-valuenow={oge.level}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${oge.name} öğrenme yoğunluğu`}
                >
                  <span
                    className="radar-row__meter-fill"
                    style={{ '--meter-value': `${oge.level}%` }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </BentoCard>
  )
}

export default LearningRadar
