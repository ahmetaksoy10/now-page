import { useEffect, useState } from 'react'
import { Disc3 } from 'lucide-react'
import { lastfm } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

const API = 'https://ws.audioscrobbler.com/2.0/'
// Last.fm'in "kapak yok" yıldız görselinin hash'i — gerçek kapak sayılmaz
const PLACEHOLDER = '2a96cbd8b46e442fc41c2b86b821562f'

// Görece zaman: "az önce", "12 dk önce", "3 saat önce", "dün", "5 gün önce"
function goreceliZaman(uts) {
  const saniye = Math.floor(Date.now() / 1000) - Number(uts)
  if (saniye < 90) return 'az önce'
  const dk = Math.round(saniye / 60)
  if (dk < 60) return `${dk} dk önce`
  const saat = Math.round(dk / 60)
  if (saat < 24) return `${saat} saat önce`
  const gun = Math.round(saat / 24)
  return gun === 1 ? 'dün' : `${gun} gün önce`
}

// image dizisinden en büyük geçerli kapağı seç (placeholder'ı atla)
function kapakSec(images) {
  if (!Array.isArray(images)) return null
  for (const boyut of ['extralarge', 'large', 'medium', 'small']) {
    const bulunan = images.find((g) => g.size === boyut && g['#text'])
    if (bulunan && !bulunan['#text'].includes(PLACEHOLDER)) return bulunan['#text']
  }
  return null
}

/**
 * CurrentlyListening — Last.fm'den GERÇEK "şu an çalıyor / son çalınan" kartı.
 *
 * Apple Music çalışlarım NepTunes ile Last.fm'e scrobble ediliyor; bu kart o
 * veriyi canlı çeker ve 45 sn'de bir yeniler. Bir şey çalıyorsa kapakta dans
 * eden equalizer + "Şu an çalıyor", yoksa "Son çalınan · 3 saat önce" gösterir.
 * Altında son birkaç parça listelenir. Hata/anahtar yoksa kart kibarca bir
 * Last.fm linkine düşer (sayfa bozulmaz). İçerik content.js'ten gelir.
 */
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
    // "Şu an çalıyor" tazeliği için periyodik yenile (sayfa açıkken)
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
  // Çalan parça ayrıca scrobble olarak da dönebilir → "öncekiler"de tekrarını çıkar
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
