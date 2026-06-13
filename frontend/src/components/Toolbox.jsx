import { AppWindow, Code2, Cpu, Database, GitBranch, Laptop, PenTool } from 'lucide-react'
import { toolbox } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

// content.js'teki "icon" anahtarını gerçek lucide ikonuna çevirir.
const ARAC_IKONLARI = {
  code: Code2,
  app: AppWindow,
  pen: PenTool,
  git: GitBranch,
  database: Database,
  cpu: Cpu,
  laptop: Laptop,
}

/**
 * Toolbox — "Araç Kutum": günlük geliştirme rutininde kullanılan araçlar.
 *
 * Öğrenme Listesi'nin ("yarın ne öğreneceğim") yanında durur ve onu tamamlar:
 * bu kart "bugün neyle çalışıyorum"u anlatır. Her araç; ikon, kategori etiketi
 * ve araç adıyla kompakt bir satır olarak sunulur.
 */
function Toolbox() {
  return (
    <BentoCard span={5} label="Araç Kutum" labelId="arac-baslik">
      <ul className="toolbox-grid">
        {toolbox.map((arac) => {
          const Ikon = ARAC_IKONLARI[arac.icon]
          return (
            <li key={arac.id} className="toolbox-item">
              <span className="toolbox-item__icon" aria-hidden="true">
                <Ikon size={16} />
              </span>
              <span className="toolbox-item__text">
                <span className="toolbox-item__label">{arac.label}</span>
                <span className="toolbox-item__tool">{arac.tool}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </BentoCard>
  )
}

export default Toolbox
