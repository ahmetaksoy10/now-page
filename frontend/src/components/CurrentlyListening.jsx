import { useEffect, useState } from 'react'
import { Disc3 } from 'lucide-react'
import { lastfm } from '../data/content.js'
import { goreceliZaman, kapakSec } from '../utils/lastfm.js'
import BentoCard from './BentoCard.jsx'

const API = 'https://ws.audioscrobbler.com/2.0/'

function CurrentlyListening() {
  const [parcalar, setParcalar] = useState([])
  const [durum, setDurum] = useState(lastfm.apiKey ? 'loading' : 'error')

  useEffect(() => {
    if (!lastfm.apiKey) return
    const iptal = new AbortController()

    const getir = async () => {
      try {
        const url =
          `${API}?method=user.getrecenttracks&user=${lastfm.user}` +
          `&api_key=${lastfm.apiKey}&format=json&limit=5`
        const yanit = await fetch(url, { signal: iptal.signal })
        if (!yanit.ok) throw new Error('lastfm')
        const json = await yanit.json()
        const liste = json?.recenttracks?.track ?? []
        setParcalar(Array.isArray(liste) ? liste : [liste])
        setDurum('success')
      } catch (hata) {
        if (hata.name !== 'AbortError') setDurum('error')
      }
    }

    getir()
    const zamanlayici = setInterval(getir, 45000)
    return () => {
      iptal.abort()
      clearInterval(zamanlayici)
    }
  }, [])

  const card = (icerik) => (
    <BentoCard span={5} label={lastfm.label} labelId="muzik-baslik" className="lastfm">
      {icerik}
    </BentoCard>
  )

  if (durum === 'loading') {
    return card(
      <div className="lastfm__now" aria-hidden="true">
        <span className="skeleton skeleton--avatar lastfm__cover" />
        <div className="lastfm__info" style={{ flex: 1 }}>
          <span className="skeleton skeleton--line" style={{ width: '40%' }} />
          <span className="skeleton skeleton--line" style={{ width: '75%' }} />
          <span className="skeleton skeleton--line" style={{ width: '55%' }} />
        </div>
      </div>,
    )
  }

  if (durum === 'error' || parcalar.length === 0) {
    return card(
      <div className="lastfm__fallback">
        <Disc3 size={26} aria-hidden="true" />
        <p>Müzik verisi şu an alınamadı.</p>
        <a href={lastfm.profileUrl} target="_blank" rel="noopener noreferrer">
          Last.fm profilim
        </a>
      </div>,
    )
  }

  const [parca, ...kalan] = parcalar
  const calisiyor = parca['@attr']?.nowplaying === 'true'
  const kapak = kapakSec(parca.image)
  const sanatci = parca.artist?.['#text'] ?? parca.artist?.name ?? ''
  const oncekiler = kalan
    .filter((p) => !(p.name === parca.name && (p.artist?.['#text'] ?? '') === sanatci))
    .slice(0, 3)

  return card(
    <>
      <a className="lastfm__now" href={parca.url} target="_blank" rel="noopener noreferrer">
        <span className={`lastfm__cover ${calisiyor ? 'is-playing' : ''}`}>
          {kapak ? (
            <img src={kapak} alt="" width="64" height="64" loading="lazy" decoding="async" />
          ) : (
            <Disc3 size={24} aria-hidden="true" />
          )}
          {calisiyor && (
            <span className="lastfm__bars" aria-hidden="true">
              <span /><span /><span /><span />
            </span>
          )}
        </span>

        <span className="lastfm__info">
          <span className="lastfm__state">
            {calisiyor ? (
              <>
                <span className="lastfm__pulse" aria-hidden="true" />
                Şu an çalıyor
              </>
            ) : (
              `Son çalınan${parca.date ? ` · ${goreceliZaman(parca.date.uts)}` : ''}`
            )}
          </span>
          <span className="lastfm__track">{parca.name}</span>
          <span className="lastfm__artist">{sanatci}</span>
        </span>
      </a>

      {oncekiler.length > 0 && (
        <ul className="lastfm__recent" aria-label="Öncesinde çalınanlar">
          {oncekiler.map((p, i) => (
            <li key={`${p.name}-${i}`}>
              <span className="lastfm__recent-track">{p.name}</span>
              <span className="lastfm__recent-artist">{p.artist?.['#text'] ?? ''}</span>
            </li>
          ))}
        </ul>
      )}
    </>,
  )
}

export default CurrentlyListening
