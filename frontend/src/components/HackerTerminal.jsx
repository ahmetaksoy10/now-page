import { useCallback, useEffect, useRef, useState } from 'react'
import SnakeGame from './terminal/SnakeGame.jsx'
import DinoGame from './terminal/DinoGame.jsx'
import XoxGame from './terminal/XoxGame.jsx'

/**
 * HackerTerminal — Gizli "hacker terminali" easter egg'i.
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

const COMMANDS = ['help', 'whoami', 'neofetch', 'ls', 'readme', 'hack', 'theme', 'reboot', 'clear', 'exit', 'snake', 'dino', 'xox']

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

const WHOAMI = `[+] HEDEF PROFİL: AHMET AKSOY
──────────────────────────────────────────────────
[ kimlik ]     => Full-Stack Developer & Tech Enthusiast
[ konum ]      => Balıkesir / Dünya
[ statü ]      => Intern / Junior
[ diller ]     => JavaScript, TypeScript, Swift, Python
[ silahlar ]   => React, Next.js, SwiftUI, Node.js
[ motivasyon ] => Sürekli öğren, boz, daha iyisini yap.
[ not ]        => "Eğer bir sistem çalışıyorsa, onu daha
                  iyi çalışacak şekilde tekrar kurarım."
──────────────────────────────────────────────────`

const LS = `dino.exe    snake.sh    xox.ai    readme.txt
gizli/      projeler/   .sirlar     kahve.log`

const README = `bu terminale denk geldiysen, sayfanın detaylarına
bakacak kadar meraklısın demektir — tam aradığım insan :)
oyunları dene → snake · dino · xox
çıkış için 'exit' veya Esc.`

function neofetch(tema) {
  return `    █████╗      now//os neofetch
   ██╔══██╗     ──────────────────────
   ███████║     kullanıcı : ahmet@now-page
   ██╔══██║     kabuk     : vite 8 · react 19
   ██║  ██║     tema      : ${tema}
   ╚═╝  ╚═╝     çalışma   : 13g 3sa 12dk
                diller    : swift · js · python`
}

// Matrix yağmuru componenti
const MatrixRain = ({ tema }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const parent = canvas.parentElement

    const resize = () => {
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン'
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nums = '0123456789'

    const alphabet = katakana + latin + nums

    const fontSize = 18
    let columns = canvas.width / fontSize
    let rainDrops = []

    const initRain = () => {
      columns = canvas.width / fontSize
      rainDrops = []
      for (let x = 0; x < columns; x++) {
        // Start randomly above the screen so it falls/slides organically
        rainDrops[x] = Math.floor(Math.random() * -60)
      }
    }
    initRain()

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = tema === 'mavi' ? '#87d9ff' : tema === 'amber' ? '#ffc673' : '#0F0'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize)

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }
    }

    const interval = setInterval(draw, 35)

    const observer = new ResizeObserver(() => {
      resize()
      initRain()
    })
    observer.observe(parent)

    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [tema])

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.35, pointerEvents: 'none' }} />
}

function HackerTerminal() {
  const [acik, setAcik] = useState(false)
  const [mod, setMod] = useState('komut') // 'komut' | 'boot' | 'hack' | 'snake' | 'dino' | 'xox'
  const [girisEkrani, setGirisEkrani] = useState(false)
  const [satirlar, setSatirlar] = useState([])
  const [girdi, setGirdi] = useState('')
  const [tema, setTema] = useState('yesil')

  // Draggable window state
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const draggingInfo = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 })

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
    setSatirlar((s) => [...s, { metin, sinif, id: Date.now() + Math.random() }])
  }, [])

  // Boot animasyonu
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
        setSatirlar((s) => [...s, { ...a, id: Date.now() + i }])
        if (i === adimlar.length - 1) setMod('komut')
      }, 100 * (i + 1)) // Daha hızlı açılış
      zamanlayicilar.current.push(id)
    })
  }, [temizleZamanlayicilar])

  const ac = useCallback(() => {
    setGirisEkrani(true)
    setTimeout(() => {
      setGirisEkrani(false)
      setAcik(true)
      setPos({ x: 0, y: 0 })
      botBaslat()
    }, 1200)
  }, [botBaslat])

  const kapat = useCallback(() => {
    temizleZamanlayicilar()
    setAcik(false)
    setGirisEkrani(false)
    setMod('komut')
    setSatirlar([])
    setGirdi('')
  }, [temizleZamanlayicilar])

  // ── Açılış: Konami + custom event
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

  // Body scroll lock
  useEffect(() => {
    if (!acik && !girisEkrani) return
    const eski = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = eski
    }
  }, [acik, girisEkrani])

  // Esc ile kapat
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

  // Scroll
  useEffect(() => {
    if (ciktiRef.current) ciktiRef.current.scrollTop = ciktiRef.current.scrollHeight
  }, [satirlar, mod])

  // Auto focus
  const handleWrapperClick = useCallback(() => {
    if (window.getSelection().toString().length === 0 && mod === 'komut') {
      inputRef.current?.focus()
    }
  }, [mod])

  useEffect(() => {
    if (acik && mod === 'komut') inputRef.current?.focus()
  }, [acik, mod])

  useEffect(() => () => temizleZamanlayicilar(), [temizleZamanlayicilar])

  const oyunCik = useCallback(
    (mesaj) => {
      setMod('komut')
      setGirdi('')
      if (mesaj) yaz(mesaj, 'sis')
    },
    [yaz],
  )

  const isle = (ham) => {
    const giris = ham.trim()
    setSatirlar((s) => [...s, { metin: `${PROMPT} ${ham}`, sinif: 'komut', id: Date.now() }])
    setGirdi('')
    if (giris) gecmis.current.push(giris)
    gecmisIdx.current = null

    const [komut] = giris.toLowerCase().split(/\s+/)
    switch (komut) {
      case '': break
      case 'help': yaz(YARDIM, 'art'); break
      case 'clear': setSatirlar([]); break
      case 'exit': kapat(); break
      case 'theme': {
        const yeni = TEMALAR[(TEMALAR.indexOf(tema) + 1) % TEMALAR.length]
        setTema(yeni)
        yaz(`tema değişti → ${yeni}`, 'basari')
        break
      }
      case 'whoami': yaz(WHOAMI, 'art'); break
      case 'sudo': yaz('yetkisiz erişim! bu olay raporlandı 🚨', 'hata'); break
      case 'reboot': botBaslat(); break
      case 'neofetch':
        yaz(neofetch(tema), 'art')
        break
      case 'ls': yaz(LS, 'art'); break
      case 'readme': yaz(README, ''); break
      case 'hack': {
        const mesajlar = [
          { m: '[*] Hedef belirleniyor: now-page.local...', s: 'sis' },
          { m: '[*] Port taraması başlatıldı (Nmap 7.92)...', s: 'sis' },
          { m: '[+] Açık portlar: 22/tcp (ssh), 80/tcp (http), 443/tcp (https)', s: 'sis' },
          { m: '[*] SSH servisi analiz ediliyor: OpenSSH 8.4p1 Debian', s: 'sis' },
          { m: '[*] Brute-force saldırısı başlatıldı (sözlük: rockyou.txt)', s: 'sis' },
          { m: '[!] Parola denemesi: 14.502 başarısız...', s: 'sis' },
          { m: '[!] Parola denemesi: 39.108 başarısız...', s: 'sis' },
          { m: '[*] Güvenlik duvarı (WAF) tespit edildi. Evasion taktikleri devrede.', s: 'sis' },
          { m: '[*] Payload enjekte ediliyor: buffer_overflow_x86.sh', s: 'sis' },
          { m: '[+] Root erişimi bekleniyor...', s: 'sis' },
          { m: '...', s: 'sis' },
          { m: '...', s: 'sis' },
          { m: '[!] HATA: TERSİNE MÜHENDİSLİK TESPİT EDİLDİ!', s: 'hata' },
          { m: "[!] BAĞLANTI KESİLDİ. AHMET'İN GÜVENLİK DUVARI AŞILAMADI. 🛡️", s: 'hata' },
        ]
        mesajlar.forEach((msj, idx) => {
          zamanlayicilar.current.push(
            setTimeout(() => yaz(msj.m, msj.s), 600 * (idx + 1))
          )
        })
        break
      }
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
    if (e.key === 'Tab') {
      e.preventDefault()
      const match = COMMANDS.find(c => c.startsWith(girdi.toLowerCase()))
      if (match) setGirdi(match)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (gecmis.current.length === 0) return
      gecmisIdx.current = gecmisIdx.current == null ? gecmis.current.length - 1 : Math.max(0, gecmisIdx.current - 1)
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

  // Draggable logic
  const handlePointerDown = (e) => {
    draggingInfo.current.isDragging = true
    draggingInfo.current.startX = e.clientX || e.touches?.[0]?.clientX
    draggingInfo.current.startY = e.clientY || e.touches?.[0]?.clientY
    draggingInfo.current.initialX = pos.x
    draggingInfo.current.initialY = pos.y
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e) => {
    if (!draggingInfo.current.isDragging) return
    const currentX = e.clientX || e.touches?.[0]?.clientX
    const currentY = e.clientY || e.touches?.[0]?.clientY
    const dx = currentX - draggingInfo.current.startX
    const dy = currentY - draggingInfo.current.startY
    setPos({
      x: draggingInfo.current.initialX + dx,
      y: draggingInfo.current.initialY + dy
    })
  }

  const handlePointerUp = () => {
    draggingInfo.current.isDragging = false
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  if (!acik && !girisEkrani) return null

  return (
    <div className={`terminal-overlay terminal--${tema}`} onClick={handleWrapperClick}>
      <MatrixRain tema={tema} />
      <div
        id="terminal-screen"
        className={`terminal terminal--${tema}`}
        role="dialog"
        aria-modal="true"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="terminal__scanlines" aria-hidden="true" />
        <div className="crt-curve" />

        {girisEkrani ? (
          <div className="hacker-transition-content">
            <h2>GİZLİ MOD AKTİF</h2>
            <p>SİSTEME SIZILIYOR...</p>
          </div>
        ) : (
          <>
            <div className="terminal__bar" onPointerDown={handlePointerDown} style={{ touchAction: 'none' }}>
              <span className="terminal__dots" aria-hidden="true">
                <button className="mac-btn mac-btn--close" onClick={kapat} />
                <button className="mac-btn mac-btn--minimize" />
                <button className="mac-btn mac-btn--maximize" />
              </span>
              <span className="terminal__title">now//os — gizli terminal</span>
            </div>

            <div className="terminal__output chromatic-aberration" ref={ciktiRef} onClick={handleWrapperClick}>
              {satirlar.map((l) => (
                <div key={l.id} className={`term__line ${l.sinif ? `term__line--${l.sinif}` : ''}`}>
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
                <span className="typewriter-cursor" style={{ display: 'none' }}></span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HackerTerminal
