import { ArrowUpRight, Music2 } from 'lucide-react'
import { currentlyListening } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

/**
 * CurrentlyListening — Gerçek, çalınabilir Apple Music çalma listesi kartı.
 *
 * Eski sahte mini-player'ın yerini alır: artık statik/uydurma veri yok,
 * doğrudan Apple Music'in resmi embed player'ı gömülü. Genel dinleme listem
 * (koda özel değil); ziyaretçi sayfayı terk etmeden çalabilir. Tüm içerik
 * content.js'ten gelir (içerik ↔ sunum ayrımı).
 */
function CurrentlyListening() {
  const { label, note, embedUrl, openUrl } = currentlyListening

  return (
    <BentoCard span={5} label={label} labelId="muzik-baslik" className="music">
      <p className="music__note">{note}</p>

      {/* Çerçeve iframe köşelerini güvenle yuvarlar (Safari iframe border-radius) */}
      <div className="music__frame">
        <iframe
          className="music__embed"
          title="Apple Music çalma listesi"
          src={embedUrl}
          allow="autoplay *; encrypted-media *;"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          loading="lazy"
        />
      </div>

      <a
        className="music__open"
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Music2 size={14} aria-hidden="true" />
        Apple Music&rsquo;te aç
        <ArrowUpRight size={13} aria-hidden="true" />
      </a>
    </BentoCard>
  )
}

export default CurrentlyListening
