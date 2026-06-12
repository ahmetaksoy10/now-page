import { useEffect, useState } from 'react'

// Saat her zaman Türkiye saatiyle gösterilir — ziyaretçi nerede olursa olsun
// "Balıkesir'de şu an saat kaç" sorusuna cevap verir (canlı sayfa hissi).
const saatBicimi = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Istanbul',
})

/**
 * useLocalTime — Saniyede bir güncellenen canlı yerel saat.
 *
 * Neden hook? Saat state'i yalnızca onu gösteren küçük component'i
 * yeniden çizer; sayfanın geri kalanı her saniye render OLMAZ.
 * Cleanup fonksiyonu interval'i temizler — bellek sızıntısı yok.
 */
export function useLocalTime() {
  const [simdi, setSimdi] = useState(() => new Date())

  useEffect(() => {
    const sayac = setInterval(() => setSimdi(new Date()), 1000)
    return () => clearInterval(sayac)
  }, [])

  return saatBicimi.format(simdi)
}
