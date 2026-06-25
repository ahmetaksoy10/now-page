import { useCallback, useEffect, useRef, useState } from 'react'
import SnakeGame from './terminal/SnakeGame.jsx'
import DinoGame from './terminal/DinoGame.jsx'
import XoxGame from './terminal/XoxGame.jsx'

/**
 * HackerTerminal — Gizli "hacker terminali" easter egg'i.
 *
 * Açılış yolları:
 *  1. Konami kodu (↑↑↓↓←→←→BA) — sayfanın herhangi bir yerinde.
 *  2. Navbar'daki ipucu butonundaki "Terminali Aç" (custom event ile).
 *
 * Açıkken arka plan kilitlenir (body scroll lock) ve oyunlardaki ok/space
 * tuşları preventDefault edilir → sayfa ASLA kaymaz. Üç mini oyun barındırır:
 * snake · dino · xox (yenilmez minimax). SSR güvenli: kapalıyken null döner,
 * tüm tarayıcı erişimi effect içinde.
 */
const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
]
const TEMALAR = ['yesil', 'amber', 'mavi']
const PROMPT = 'ahmet@now-page:~$'

const BANNER = `███╗   ██╗ ██████╗ ██╗    ██╗
████╗  ██║██╔═══██╗██║    ██║
██╔██╗ ██║██║   ██║██║ █╗ ██║
██║╚██╗██║██║   ██║██║███╗██║
██║ ╚████║╚██████╔╝╚███╔███╔╝
╚═╝  ╚═══╝ ╚═════╝  ╚══╝╚══╝`

const YARDIM = `kullanılabilir komutlar:
  help      bu listeyi gösterir
  whoami    sahte hacker profilini basar
  neofetch  sistem bilgisi + logo
  ls        dizini listeler
  readme    gizli notu açar
  hack      sızma simülasyonu (şaka)
  theme     terminal rengini değiştirir
  reboot    terminali yeniden başlatır
  clear     ekranı temizler
  exit      terminali kapatır
  ── oyunlar ──
  snake     yılan oyunu
  dino      sonsuz koşu
  xox       yenilmez tic-tac-toe`

const WHOAMI = `ahmet_aksoy  ·  rütbe: junior dev (gizli ajan)
konum: balıkesir   ·  uzmanlık: swiftui / react / kahve
durum: staja açık  ·  tehdit seviyesi: düşük ama kararlı
parola: ********** (denemeyin, çok güçlü)
> "kodla, boz, yeniden yap."`

const LS = `dino.exe    snake.sh    xox.ai    readme.txt
gizli/      projeler/   .sirlar     kahve.log`

const README = `bu terminale denk geldiysen, sayfanın detaylarına
bakacak kadar meraklısın demektir — tam aradığım insan :)
oyunları dene → snake · dino · xox
çıkış için 'exit' veya Esc.`

const HACK_LOGLARI = [
  { metin: '[*] hedef belirleniyor: now-page.local', sinif: 'sis' },
  { metin: '[*] port taraması... 22/ssh 80/http 443/https → açık', sinif: 'sis' },
  { metin: '[*] zafiyet aranıyor: 192.168.1.42 ...', sinif: 'sis' },
  { metin: '[*] şifre kırma (sözlük saldırısı): deneme 1.482.913', sinif: 'sis' },
  { metin: '[*] güvenlik duvarı atlatılıyor... %37 ... %68 ... %91 ...', sinif: 'sis' },
  { metin: '[!] HACK BAŞARISIZ! SİTE GÜVENLİĞİ ÇOK YÜKSEK,', sinif: 'hata' },
  { metin: "[!] AHMET'İN GÜVENLİK DUVARI AŞILAMADI. 🛡️", sinif: 'hata' },
]

function neofetch(tema) {
  return `   ▄█▀▀▀█▄
  █  ◉ ◉  █     now//os neofetch
  █    ▽   █    ──────────────────────
   ▀█▄▄▄█▀      kullanıcı : ahmet@now-page
                kabuk     : vite 8 · react 19
                tema      : ${tema}
                çalışma   : 13g 3sa 12dk
                diller    : swift · js · python`
}

function HackerTerminal() {
  const [acik, setAcik] = useState(false)
  const [mod, setMod] = useState('komut') // 'komut' | 'boot' | 'hack' | 'snake' | 'dino' | 'xox'
  const [satirlar, setSatirlar] = useState([])
  const [girdi, setGirdi] = useState('')
  const [tema, setTema] = useState('yesil')

  const acikRef = useRef(false)
  const zamanlayicilar = useRef([])
  const gecmis = useRef([])
  const gecmisIdx = useRef(null)
  const ciktiRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    acikRef.current = acik
  }, [acik])

  const temizleZamanlayicilar = useCallback(() => {
    zamanlayicilar.current.forEach(clearTimeout)
    zamanlayicilar.current = []
  }, [])

  const yaz = useCallback((metin, sinif = '') => {
    setSatirlar((s) => [...s, { metin, sinif }])
  }, [])

  // Boot animasyonu: satırları kademeli yazıp sonunda komut moduna geçer
  const botBaslat = useCallback(() => {
    temizleZamanlayicilar()
    setMod('boot')
    setSatirlar([])
    setGirdi('')
    const adimlar = [
      { metin: '[ boot: now//os 2.6 başlatılıyor... ]', sinif: 'sis' },
      { metin: '[ çekirdek modülleri yükleniyor ✓ ]', sinif: 'sis' },
      { metin: '[ ağ arayüzü hazır ✓ ]', sinif: 'sis' },
      { metin: BANNER, sinif: 'art' },
      { metin: '>> GİZLİ MOD AÇILDI — SİSTEME GİRİŞ YAPILDI <<', sinif: 'basari' },
      { metin: "komutları görmek için 'help' yazıp Enter'a bas.", sinif: '' },
    ]
    adimlar.forEach((a, i) => {
      const id = setTimeout(() => {
        setSatirlar((s) => [...s, a])
        if (i === adimlar.length - 1) setMod('komut')
      }, 240 * (i + 1))
      zamanlayicilar.current.push(id)
    })
  }, [temizleZamanlayicilar])

  const ac = useCallback(() => {
    setAcik(true)
    botBaslat()
  }, [botBaslat])

  const kapat = useCallback(() => {
    temizleZamanlayicilar()
    setAcik(false)
    setMod('komut')
    setSatirlar([])
    setGirdi('')
  }, [temizleZamanlayicilar])

  // hack simülasyonu: logları akıt, sonunda komut moduna dön
  const hackBaslat = useCallback(() => {
    setMod('hack')
    HACK_LOGLARI.forEach((l, i) => {
      const id = setTimeout(() => {
        setSatirlar((s) => [...s, l])
        if (i === HACK_LOGLARI.length - 1) setMod('komut')
      }, 420 * (i + 1))
      zamanlayicilar.current.push(id)
    })
  }, [])

  // ── Açılış: Konami + custom event ──────────────────────────────────────────
  useEffect(() => {
    let girilen = []
    const konami = (e) => {
      if (acikRef.current) return
      girilen = [...girilen, e.key].slice(-KONAMI.length)
      const eslesti =
        girilen.length === KONAMI.length &&
        KONAMI.every((t, i) => girilen[i].toLowerCase() === t.toLowerCase())
      if (eslesti) {
        girilen = []
        ac()
      }
    }
    const acEvent = () => {
      if (!acikRef.current) ac()
    }
    window.addEventListener('keydown', konami)
    window.addEventListener('hacker-terminal:ac', acEvent)
    return () => {
      window.removeEventListener('keydown', konami)
      window.removeEventListener('hacker-terminal:ac', acEvent)
    }
  }, [ac])

  // Body scroll lock (terminal açıkken arka plan kaymaz)
  useEffect(() => {
    if (!acik) return
    const eski = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = eski
    }
  }, [acik])

  // Esc ile kapat (oyun modlarında oyun kendi Esc'ini yönetir)
  useEffect(() => {
    if (!acik) return
    const esc = (e) => {
      if (e.key === 'Escape' && mod !== 'snake' && mod !== 'dino' && mod !== 'xox') {
        kapat()
      }
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [acik, mod, kapat])

  // Çıktı geldikçe en alta kaydır
  useEffect(() => {
    if (ciktiRef.current) ciktiRef.current.scrollTop = ciktiRef.current.scrollHeight
  }, [satirlar, mod])

  // Komut modunda input'a odaklan
  useEffect(() => {
    if (acik && mod === 'komut') inputRef.current?.focus()
  }, [acik, mod])

  // Açılışta tüm zamanlayıcıları temizle (unmount güvenliği)
  useEffect(() => () => temizleZamanlayicilar(), [temizleZamanlayicilar])

  const oyunCik = useCallback(
    (mesaj) => {
      setMod('komut')
      if (mesaj) yaz(mesaj, 'sis')
    },
    [yaz],
  )

  const isle = (ham) => {
    const giris = ham.trim()
    setSatirlar((s) => [...s, { metin: `${PROMPT} ${ham}`, sinif: 'komut' }])
    setGirdi('')
    if (giris) gecmis.current.push(giris)
    gecmisIdx.current = null

    const [komut] = giris.toLowerCase().split(/\s+/)
    switch (komut) {
      case '':
        break
      case 'help':
        yaz(YARDIM, 'art')
        break
      case 'clear':
        setSatirlar([])
        break
      case 'exit':
        kapat()
        break
      case 'theme': {
        const yeni = TEMALAR[(TEMALAR.indexOf(tema) + 1) % TEMALAR.length]
        setTema(yeni)
        yaz(`tema değişti → ${yeni}`, 'basari')
        break
      }
      case 'whoami':
        yaz(WHOAMI, 'art')
        break
      case 'sudo':
        yaz('yetkisiz erişim! bu olay raporlandı 🚨 (IP adresin not edildi 😏)', 'hata')
        break
      case 'reboot':
        botBaslat()
        break
      case 'neofetch':
        yaz(neofetch(tema), 'art')
        break
      case 'ls':
        yaz(LS, 'art')
        break
      case 'readme':
        yaz(README)
        break
      case 'hack':
        hackBaslat()
        break
      case 'snake':
      case 'dino':
      case 'xox':
        yaz(`${komut} başlatılıyor... (çıkış: q)`, 'sis')
        setMod(komut)
        break
      default:
        yaz(`komut bulunamadı: ${komut} — 'help' yazıp dene`, 'hata')
    }
  }

  const inputTus = (e) => {
    if (e.key === 'Enter') {
      isle(girdi)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (gecmis.current.length === 0) return
      gecmisIdx.current =
        gecmisIdx.current == null
          ? gecmis.current.length - 1
          : Math.max(0, gecmisIdx.current - 1)
      setGirdi(gecmis.current[gecmisIdx.current])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (gecmisIdx.current == null) return
      if (gecmisIdx.current < gecmis.current.length - 1) {
        gecmisIdx.current += 1
        setGirdi(gecmis.current[gecmisIdx.current])
      } else {
        gecmisIdx.current = null
        setGirdi('')
      }
    }
  }

  if (!acik) return null

  return (
    <div
      id="terminal-screen"
      className={`terminal terminal--${tema}`}
      role="dialog"
      aria-modal="true"
      aria-label="Gizli hacker terminali"
    >
      <div className="terminal__scanlines" aria-hidden="true" />

      <div className="terminal__bar">
        <span className="terminal__dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="terminal__title">now//os — gizli terminal</span>
        <button
          type="button"
          className="terminal__close"
          onClick={kapat}
          aria-label="Terminali kapat"
        >
          ✕
        </button>
      </div>

      <div className="terminal__output" ref={ciktiRef}>
        {satirlar.map((l, i) => (
          <div key={i} className={`term__line ${l.sinif ? `term__line--${l.sinif}` : ''}`}>
            {l.metin}
          </div>
        ))}

        {mod === 'snake' && <SnakeGame onExit={oyunCik} />}
        {mod === 'dino' && <DinoGame onExit={oyunCik} />}
        {mod === 'xox' && <XoxGame onExit={oyunCik} />}
      </div>

      {mod === 'komut' && (
        <div className="terminal__promptrow">
          <span className="terminal__prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="terminal__input"
            value={girdi}
            onChange={(e) => setGirdi(e.target.value)}
            onKeyDown={inputTus}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Komut girişi"
          />
        </div>
      )}
    </div>
  )
}

export default HackerTerminal
