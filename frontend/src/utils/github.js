// ─────────────────────────────────────────────────────────────────────────────
//  GitHub veri yardımcıları (saf fonksiyonlar)
// ─────────────────────────────────────────────────────────────────────────────
//  GitHubActivity bileşeninden çıkarıldı: ağ/DOM içermeyen, tamamen saf mantık
//  burada toplanır → bağımsız test edilebilir, bileşen yalnızca çizime odaklanır.
// ─────────────────────────────────────────────────────────────────────────────

// GitHub'ın resmi dil renkleri (linguist). Bilinmeyen diller accent'e düşer.
export const DIL_RENKLERI = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Swift: '#F05138',
  HTML: '#e34c26',
  CSS: '#563d7c',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  'Jupyter Notebook': '#DA5B0B',
}

// Bir dilin rengini döndürür; bilinmiyorsa CSS accent değişkenine düşer.
export const dilRengi = (dil) => DIL_RENKLERI[dil] || 'var(--accent)'

// Günleri haftalara böler: ilk günün haftanın gününe (0=Pazar) göre baştan
// boşluk eklenir ki sütunlar GitHub'daki gibi doğru hizalansın.
export function haftalaraBol(gunler) {
  const haftalar = []
  let hafta = new Array(new Date(gunler[0].date).getDay()).fill(null)
  for (const gun of gunler) {
    hafta.push(gun)
    if (hafta.length === 7) {
      haftalar.push(hafta)
      hafta = []
    }
  }
  if (hafta.length) {
    while (hafta.length < 7) hafta.push(null)
    haftalar.push(hafta)
  }
  return haftalar
}

// Güncel seri: sondan başa ardışık katkılı gün sayısı. Bugün henüz 0 ise
// seriyi bozmaz (dünden geriye sayar) — GitHub'ın "current streak" mantığı.
export function guncelSeri(gunler) {
  let seri = 0
  for (let i = gunler.length - 1; i >= 0; i--) {
    if (gunler[i].count > 0) seri++
    else if (i === gunler.length - 1) continue
    else break
  }
  return seri
}
