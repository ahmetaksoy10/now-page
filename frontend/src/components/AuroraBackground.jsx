/**
 * AuroraBackground — Sayfanın yaşayan arka planı (saf CSS, sıfır bağımlılık).
 *
 * Eski Three.js "takımyıldız ağı"nın yerini alır: birkaç dev, bulanık renk
 * küresi (aurora blob) yavaşça süzülür, nefes alır ve ölçek değiştirir.
 * Hareket yalnızca transform + opacity üzerinden olur → GPU katmanında,
 * 60fps; ana thread'i hiç yormaz. Renkler tema değişkenlerinden (--accent-*)
 * gelir, bu yüzden açık/koyu temayla otomatik uyumludur.
 *
 * Erişilebilirlik: tamamen dekoratif (aria-hidden). Animasyonun kendisi
 * App.css'te yaşar; "hareketi azalt" tercihinde küreler durağan kalır.
 */
function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
      <span className="aurora__blob aurora__blob--4" />
    </div>
  )
}

export default AuroraBackground
