import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * ErrorBoundary — Render sırasında oluşan JS hatalarını yakalayan sınır.
 *
 * Hook'larla Error Boundary YAZILAMAZ (React kısıtı); bu yüzden class
 * component: `getDerivedStateFromError` durumu hata moduna alır,
 * `componentDidCatch` hatayı loglar (ileride Sentry gibi bir servise
 * gönderilebilir). Hata olunca tüm sayfa beyaz ekrana düşmez; tasarım diline
 * uygun (glassmorphism kart, amber accent) şık bir fallback gösterilir.
 *
 * Props:
 *  - children : korunan ağaç
 *  - title    : fallback başlığı (opsiyonel)
 *  - message  : fallback açıklaması (opsiyonel)
 *  - compact  : kart içi küçük varyant (true) — bento grid'e oturur
 *  - span     : compact fallback'in grid'de kaplayacağı kolon (4/5/7/12)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hata: false }
  }

  static getDerivedStateFromError() {
    return { hata: true }
  }

  componentDidCatch(hata, bilgi) {
    // İleride Sentry/LogRocket gibi bir servise gönderilebilir
    console.error('ErrorBoundary bir hata yakaladı:', hata, bilgi)
  }

  render() {
    // Hata yoksa hiçbir sarmalayıcı eklemeden çocukları olduğu gibi döndür
    // (DOM'a fazladan düğüm girmez → bento grid yerleşimi korunur).
    if (!this.state.hata) return this.props.children

    const {
      title = 'Bir şeyler ters gitti',
      message = 'Bu bölüm beklenmedik bir hatayla karşılaştı. Sayfayı yenilemek genelde çözer.',
      compact = false,
      span = 12,
    } = this.props

    // Compact: bento grid hücresi olarak (kart stili + doğru span). Tam:
    // bento-grid'in yerini alan, ortalı tek bir glass kart.
    const sinif = compact
      ? `card bento bento--${span} error-boundary error-boundary--compact`
      : 'card error-boundary'

    return (
      <div className={sinif} role="alert">
        <span className="error-boundary__icon" aria-hidden="true">
          <AlertTriangle size={compact ? 20 : 26} />
        </span>
        <h2 className="error-boundary__title">{title}</h2>
        <p className="error-boundary__message">{message}</p>
        <button
          type="button"
          className="error-boundary__button"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={15} aria-hidden="true" />
          Sayfayı Yenile
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
