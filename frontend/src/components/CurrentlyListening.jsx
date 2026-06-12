import { useState } from 'react'
import { Disc3, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { currentlyListening } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

/**
 * CurrentlyListening — Zarif mini müzik çalar.
 *
 * Gerçek ses çalmaz ama ölü bir görsel de değildir:
 *  - Plak ikonu çalarken döner, equalizer çubukları dans eder.
 *  - Play/Pause gerçek state değiştirir; animasyonlar
 *    `animation-play-state` ile durur/başlar — JS stil hesaplamaz.
 */
function CurrentlyListening() {
  const { track, artist, album, elapsed, duration, progress } = currentlyListening
  const [caliyor, setCaliyor] = useState(true)

  return (
    <BentoCard
      span={5}
      label="Ses Arka Planım"
      labelId="muzik-baslik"
      className={`player ${caliyor ? 'is-playing' : 'is-paused'}`}
    >
      <div className="player__top">
        <div className="player__art" aria-hidden="true">
          <Disc3 size={26} className="player__art-disc" />
        </div>

        <div className="player__info">
          <p className="player__state">{caliyor ? 'Şu an çalıyor' : 'Duraklatıldı'}</p>
          <h2 className="player__track">{track}</h2>
          <p className="player__artist">
            {artist} — {album}
          </p>
        </div>

        <div className="player__equalizer" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </div>

      <div className="player__timeline">
        <span className="player__time">{elapsed}</span>
        <div
          className="progress progress--player"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Parça ilerlemesi"
        >
          <span
            className="progress__fill"
            style={{ '--progress-value': `${progress}%` }}
          />
        </div>
        <span className="player__time">{duration}</span>
      </div>

      <div className="player__controls">
        <button type="button" className="player__button" aria-label="Önceki parça">
          <SkipBack size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="player__button player__button--primary"
          onClick={() => setCaliyor((deger) => !deger)}
          aria-label={caliyor ? 'Duraklat' : 'Çal'}
        >
          {caliyor ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
        <button type="button" className="player__button" aria-label="Sonraki parça">
          <SkipForward size={15} aria-hidden="true" />
        </button>
      </div>
    </BentoCard>
  )
}

export default CurrentlyListening
