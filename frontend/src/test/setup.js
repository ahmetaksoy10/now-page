// Vitest kurulum dosyası: her test dosyasından önce çalışır.
// jest-dom, `toBeInTheDocument` / `toHaveAttribute` gibi okunabilir
// DOM matcher'larını `expect`'e ekler.
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom bazı tarayıcı API'lerini sağlamaz; bileşenlerimiz bunları kullandığı
// için (useScrollReveal, AuroraBackground…) test ortamında zararsız mock veririz.

// matchMedia: her zaman "eşleşmiyor" (animasyonlar/parallax pasif sayılır)
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
}

// IntersectionObserver: scroll-reveal bu olmadan çöker; no-op mock yeterli.
if (!('IntersectionObserver' in globalThis)) {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}
