import { Coffee, Zap } from 'lucide-react'
import { energyStatus } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

function EnergyStatus() {
  const { level, context, note } = energyStatus

  return (
    <BentoCard span={5} label="Sistem Durumu" labelId="enerji-baslik">
      <div className="energy-card__head">
        <p className="energy-card__context">{context}</p>
        <p className="energy-card__percent">
          <Zap size={15} aria-hidden="true" />%{level}
        </p>
      </div>

      <div
        className="battery"
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Enerji seviyesi"
      >
        <span className="battery__fill" style={{ '--battery-value': `${level}%` }} />
      </div>

      <p className="energy-card__note">
        <Coffee size={15} aria-hidden="true" />
        {note}
      </p>
    </BentoCard>
  )
}

export default EnergyStatus
