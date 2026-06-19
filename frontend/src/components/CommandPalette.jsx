import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUp,
  Copy,
  CornerDownLeft,
  Hash,
  Mail,
  MoonStar,
  Search,
} from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from './icons/BrandIcons.jsx'
import { navLinks, profile, socialLinks } from '../data/content.js'

// Platform tespiti: macOS'ta "⌘", diğerlerinde (Windows/Linux) "Ctrl" gösterilir.
// Kısayolun kendisi her iki tuşu da dinler (Cmd+K ve Ctrl+K) — bkz. keydown.
const MAC = /Mac|iPhone|iPad/.test(
  navigator.userAgentData?.platform || navigator.platform || navigator.userAgent,
)

// Türkçe karakterleri sadeleştirip küçük harfe çevirir (arama dostu eşleşme).
const sadelestir = (metin) =>
  metin
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')

// data-theme'i doğrudan çevirir (ThemeToggle ikonu attribute-driven olduğu için
// her yer otomatik senkron kalır — ayrı bir React state'e gerek yok).
function temayiCevir() {
  const koyu = document.documentElement.getAttribute('data-theme') !== 'light'
  const yeni = koyu ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', yeni)
  try {
    localStorage.setItem('now-page-theme', yeni)
  } catch {
    // localStorage kapalıysa sessizce devam
  }
}

const sosyalIkon = { github: GitHubIcon, linkedin: LinkedInIcon, mail: Mail }

/**
 * CommandPalette — ⌘K / Ctrl+K ile açılan hızlı komut menüsü.
 *
 * Linear/Raycast hissi: yaz-filtrele, ok tuşlarıyla gez, Enter ile çalıştır.
 * Bölümlere atlar, bağlantıları açar, e-postayı kopyalar, temayı değiştirir.
 * Açılış iki yolla: klavye kısayolu veya navbar'daki tetik butonunun
 * yaydığı 'command-palette:open' özel olayı (prop drilling yok).
 */
function CommandPalette() {
  const [acik, setAcik] = useState(false)
  const [sorgu, setSorgu] = useState('')
  const [aktif, setAktif] = useState(0)
  const girdiRef = useRef(null)
  const listeRef = useRef(null)

  // ── Tüm komutlar (sabit) ───────────────────────────────────────────────────
  const komutlar = useMemo(() => {
    const kapat = () => setAcik(false)
    const bolumler = navLinks.map((l) => ({
      id: `bolum-${l.id}`,
      grup: 'Bölümler',
      etiket: l.label,
      ikon: Hash,
      calistir: () => {
        kapat()
        document.getElementById(l.href.replace('#', ''))?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      },
    }))

    const baglantilar = socialLinks.map((s) => ({
      id: `link-${s.id}`,
      grup: 'Bağlantılar',
      etiket: s.label,
      ikon: sosyalIkon[s.id] ?? Mail,
      calistir: () => {
        kapat()
        window.open(s.url, s.id === 'mail' ? '_self' : '_blank', 'noopener,noreferrer')
      },
    }))

    const eylemler = [
      {
        id: 'eylem-eposta',
        grup: 'Eylemler',
        etiket: 'E-postayı kopyala',
        ikon: Copy,
        calistir: async () => {
          kapat()
          try {
            await navigator.clipboard.writeText(profile.email)
          } catch {
            // sessizce geç — kritik değil
          }
        },
      },
      {
        id: 'eylem-tema',
        grup: 'Eylemler',
        etiket: 'Temayı değiştir',
        ikon: MoonStar,
        calistir: () => {
          temayiCevir()
          kapat()
        },
      },
      {
        id: 'eylem-yukari',
        grup: 'Eylemler',
        etiket: 'En üste çık',
        ikon: ArrowUp,
        calistir: () => {
          kapat()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        },
      },
    ]

    return [...bolumler, ...baglantilar, ...eylemler]
  }, [])

  // Filtre: sorguyu komut etiketlerinde ara (Türkçe sadeleştirilmiş)
  const filtreli = useMemo(() => {
    const q = sadelestir(sorgu.trim())
    if (!q) return komutlar
    return komutlar.filter((k) => sadelestir(k.etiket).includes(q))
  }, [sorgu, komutlar])

  // ── Aç/kapa: klavye kısayolu (Cmd+K / Ctrl+K) + özel olay ──────────────────
  useEffect(() => {
    const kisayol = (olay) => {
      if ((olay.metaKey || olay.ctrlKey) && olay.key.toLowerCase() === 'k') {
        olay.preventDefault()
        setAcik((a) => !a)
      }
    }
    const olayIleAc = () => setAcik(true)
    window.addEventListener('keydown', kisayol)
    window.addEventListener('command-palette:open', olayIleAc)
    return () => {
      window.removeEventListener('keydown', kisayol)
      window.removeEventListener('command-palette:open', olayIleAc)
    }
  }, [])

  // Açılınca girdiye odaklan ve durumu sıfırla
  useEffect(() => {
    if (acik) {
      setSorgu('')
      setAktif(0)
      // Bir sonraki frame'de odaklan (panel DOM'a girince)
      requestAnimationFrame(() => girdiRef.current?.focus())
    }
  }, [acik])

  // Filtre değişince aktif seçimi başa al
  useEffect(() => setAktif(0), [sorgu])

  if (!acik) return null

  const panelKlavye = (olay) => {
    if (olay.key === 'Escape') {
      olay.preventDefault()
      setAcik(false)
    } else if (olay.key === 'ArrowDown') {
      olay.preventDefault()
      setAktif((i) => Math.min(i + 1, filtreli.length - 1))
    } else if (olay.key === 'ArrowUp') {
      olay.preventDefault()
      setAktif((i) => Math.max(i - 1, 0))
    } else if (olay.key === 'Enter') {
      olay.preventDefault()
      filtreli[aktif]?.calistir()
    }
  }

  return (
    <div
      className="cmdk"
      role="dialog"
      aria-modal="true"
      aria-label="Komut paleti"
      onMouseDown={(o) => {
        if (o.target === o.currentTarget) setAcik(false)
      }}
    >
      <div className="cmdk__panel" onKeyDown={panelKlavye}>
        <div className="cmdk__search">
          <Search size={17} className="cmdk__search-icon" aria-hidden="true" />
          <input
            ref={girdiRef}
            type="text"
            className="cmdk__input"
            placeholder="Bir komut yaz ya da ara…"
            value={sorgu}
            onChange={(o) => setSorgu(o.target.value)}
            aria-label="Komut ara"
            autoComplete="off"
            spellCheck="false"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <kbd className="cmdk__esc">esc</kbd>
        </div>

        <ul className="cmdk__list" ref={listeRef} role="listbox" aria-label="Komutlar">
          {filtreli.length === 0 && (
            <li className="cmdk__empty">Sonuç yok — başka bir şey dene.</li>
          )}
          {filtreli.map((komut, sira) => {
            const Ikon = komut.ikon
            const oncekiGrupFarkli = sira === 0 || filtreli[sira - 1].grup !== komut.grup
            return (
              <li key={komut.id} role="presentation">
                {oncekiGrupFarkli && <p className="cmdk__group">{komut.grup}</p>}
                <button
                  type="button"
                  role="option"
                  aria-selected={sira === aktif}
                  className={`cmdk__item ${sira === aktif ? 'is-active' : ''}`}
                  onMouseMove={() => setAktif(sira)}
                  onClick={() => komut.calistir()}
                >
                  <Ikon size={16} className="cmdk__item-icon" aria-hidden="true" />
                  <span className="cmdk__item-label">{komut.etiket}</span>
                  {sira === aktif && (
                    <CornerDownLeft size={14} className="cmdk__item-enter" aria-hidden="true" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="cmdk__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> gez</span>
          <span><kbd>↵</kbd> seç</span>
          <span><kbd>{MAC ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd> aç/kapat</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
