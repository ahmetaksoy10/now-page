import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hata: false }
  }

  static getDerivedStateFromError() {
    return { hata: true }
  }

  componentDidCatch(hata, bilgi) {
    console.error('ErrorBoundary bir hata yakaladı:', hata, bilgi)
  }

  render() {
    if (!this.state.hata) return this.props.children

    const {
      title = 'Bir şeyler ters gitti',
      message = 'Bu bölüm beklenmedik bir hatayla karşılaştı. Sayfayı yenilemek genelde çözer.',
      compact = false,
      span = 12,
    } = this.props
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
