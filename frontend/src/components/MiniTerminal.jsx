import { useEffect, useRef, useState } from 'react'
import {
  activeProject,
  otherProjects,
  profile,
  skills,
  socialLinks,
} from '../data/content.js'
import BentoCard from './BentoCard.jsx'

// data-theme'i doğrudan çevirir (CommandPalette ile aynı yaklaşım).
function temayiCevir() {
  const koyu = document.documentElement.getAttribute('data-theme') !== 'light'
  const yeni = koyu ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', yeni)
  try {
    localStorage.setItem('now-page-theme', yeni)
  } catch {
    // sessizce geç
  }
}

// Kullanılabilir komutlar (yardım çıktısı ve geçerlilik kontrolü için tek kaynak)
const KOMUT_LISTESI = [
  ['help', 'kullanılabilir komutları listeler'],
  ['about', 'kısaca kim olduğum'],
  ['projeler', 'üzerinde çalıştığım projeler'],
  ['yetenekler', 'kullandığım teknolojiler'],
  ['sosyal', 'bağlantılarım'],
  ['tema', 'koyu/açık temayı değiştirir'],
  ['clear', 'ekranı temizler'],
]

// Komutu çalıştırır, çıktı satırlarını (string[]) döndürür.
// Bazı komutların takma adları vardır (Türkçe + İngilizce).
function komutCalistir(ham) {
  const komut = ham.trim().toLocaleLowerCase('tr')
  if (!komut) return []

  switch (komut) {
    case 'help':
    case 'yardim':
    case 'yardım':
      return [
        'Kullanılabilir komutlar:',
        ...KOMUT_LISTESI.map(([ad, aciklama]) => `  ${ad.padEnd(12)}${aciklama}`),
      ]

    case 'about':
    case 'hakkimda':
    case 'hakkımda':
    case 'whoami':
      return [
        profile.name,
        profile.role + '.',
        '',
        'Kod yazmayı, öğrenmeyi ve yeni şeyler denemeyi seven biri.',
        `Konum: ${profile.location}  ·  Durum: ${profile.status}`,
      ]

    case 'projeler':
    case 'projects':
      return [
        'Projeler:',
        `  • ${activeProject.name} — ${activeProject.status}`,
        ...otherProjects.map((p) => `  • ${p.name} — ${p.tagline}`),
        '',
        "Detaylar için yukarıdaki 'Projeler' bölümüne göz at.",
      ]

    case 'yetenekler':
    case 'skills':
    case 'stack':
      return ['Teknolojiler:', '  ' + skills.map((y) => y.label).join('  ·  ')]

    case 'sosyal':
    case 'iletisim':
    case 'iletişim':
    case 'contact':
      return ['Bağlantılar:', ...socialLinks.map((s) => `  ${s.label}: ${s.url}`)]

    case 'tema':
    case 'theme':
      temayiCevir()
      return ['Tema değiştirildi. ✦']

    case 'sudo':
      return ['Üzgünüm, burada root sensin zaten. 😎']

    case 'ls':
      return ['odak  projeler  github  yolculuk  iletisim  gizli-bir-dosya.txt']

    case 'neofetch':
      return [
        `${profile.name}@now-page`,
        '-----------------',
        'OS: Web (React + Vite)',
        'Shell: bolca-kahve.sh',
        `Tema: ${document.documentElement.getAttribute('data-theme')}`,
        'Uptime: sürekli öğreniyor',
      ]

    case 'clear':
    case 'temizle':
      return null // null = ekranı temizle sinyali

    default:
      return [`komut bulunamadı: ${komut}`, "Yardım için 'help' yazın."]
  }
}

const HOSGELDIN = [
  "Merhaba! Bu mini bir terminal. 'help' yazıp Enter'a bas.",
  "Dene: about · projeler · yetenekler · tema",
]

/**
 * MiniTerminal — Ziyaretçinin komut yazabildiği interaktif terminal kartı.
 *
 * Portfolyoya geliştirici ruhu katan, akılda kalıcı bir dokunuş: gerçek bir
 * komut satırı gibi davranır (komut geçmişi, prompt, blink eden imleç).
 * Tüm içerik content.js'ten beslenir (tek doğruluk noktası). Salt ön yüz;
 * hiçbir şeyi gerçekten çalıştırmaz, güvenli bir "oyun alanı".
 */
function MiniTerminal() {
  const [gecmis, setGecmis] = useState([{ komut: null, cikti: HOSGELDIN }])
  const [girdi, setGirdi] = useState('')
  const govdeRef = useRef(null)
  const girdiRef = useRef(null)

  // Her yeni satırda en alta kaydır (gerçek terminal gibi)
  useEffect(() => {
    const g = govdeRef.current
    if (g) g.scrollTop = g.scrollHeight
  }, [gecmis])

  const gonder = (olay) => {
    olay.preventDefault()
    const komut = girdi
    setGirdi('')
    const cikti = komutCalistir(komut)
    if (cikti === null) {
      setGecmis([]) // clear
      return
    }
    setGecmis((eski) => [...eski, { komut, cikti }])
  }

  return (
    <BentoCard
      span={12}
      label="Terminal — Benimle Konuş"
      labelId="terminal-baslik"
      className="terminal-card"
    >
      <div className="terminal" onClick={() => girdiRef.current?.focus()}>
        <div className="terminal__bar" aria-hidden="true">
          <span className="terminal__dot terminal__dot--red" />
          <span className="terminal__dot terminal__dot--yellow" />
          <span className="terminal__dot terminal__dot--green" />
          <span className="terminal__title">visitor@ahmet-aksoy — bash</span>
        </div>

        <div className="terminal__body" ref={govdeRef}>
          {gecmis.map((blok, i) => (
            <div key={i} className="terminal__block">
              {blok.komut !== null && (
                <p className="terminal__line terminal__line--cmd">
                  <span className="terminal__prompt">visitor@ahmet-aksoy:~$</span> {blok.komut}
                </p>
              )}
              {blok.cikti.map((satir, j) => (
                <p key={j} className="terminal__line">
                  {satir || ' '}
                </p>
              ))}
            </div>
          ))}

          {/* Aktif giriş satırı */}
          <form className="terminal__input-row" onSubmit={gonder}>
            <span className="terminal__prompt">visitor@ahmet-aksoy:~$</span>
            <input
              ref={girdiRef}
              type="text"
              className="terminal__input"
              value={girdi}
              onChange={(o) => setGirdi(o.target.value)}
              aria-label="Terminal komutu"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </BentoCard>
  )
}

export default MiniTerminal
