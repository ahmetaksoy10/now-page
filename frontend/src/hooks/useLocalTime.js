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
 *
 * SSR/hydration: İlk değer sunucu ve istemcide AYNI olmalı (yoksa "şu an"
 * her ortamda farklı → hydration uyumsuzluğu). Bu yüzden başlangıçta yer
 * tutucu gösterilir; gerçek saat yalnızca mount sonrası (istemci) yazılır.
 */
export function useLocalTime() {
  const [simdi, setSimdi] = useState(null)

  useEffect(() => {
    // Hydration guard: gerçek saat yalnızca mount sonrası yazılır ki sunucu ve
    // istemcinin İLK render'ı (yer tutucu) eşleşsin. setState-in-effect bu SSR
    // deseninin doğası gereğidir (React dokümanlarının önerdiği yol).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSimdi(new Date())
    const sayac = setInterval(() => setSimdi(new Date()), 1000)
    return () => clearInterval(sayac)
  }, [])

  return simdi ? saatBicimi.format(simdi) : '··:··:··'
}
