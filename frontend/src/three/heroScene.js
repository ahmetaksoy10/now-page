import * as THREE from 'three'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  heroScene — Sayfanın arka planındaki sinematik 3D atmosfer (saf Three.js)
 * ─────────────────────────────────────────────────────────────────────────────
 *  React'ten tamamen bağımsızdır: bir <canvas> alır, sahneyi kurar ve geriye
 *  yalnızca bir `dispose()` fonksiyonu döndürür (CLAUDE.md katmanlı mimari).
 *
 *  Tasarım: dikkat çekmek yerine derinlik ve sıcaklık katan, zamansız bir
 *  parçacık atmosferi. Stripe/Linear/Vercel landing sayfalarındaki gibi —
 *  somut bir "obje" değil, ortamın kendisi nefes alır. Üç derinlik katmanı:
 *
 *   • Uzak katman  — çok sayıda küçük, soluk zerre (yıldız tozu)
 *   • Orta katman  — orta boy, dengeli parlaklık
 *   • Yakın katman — az sayıda iri, parlak zerre (ön plan derinliği)
 *
 *  Katmanlar fareye FARKLI hızlarda tepki verir → gerçek parallax/derinlik.
 *  Performans: tek rAF döngüsü, DPR sınırı, sekme arkadayken duraklatma,
 *  prefers-reduced-motion'da statik kare, unmount'ta tam GPU temizliği.
 */

// data-theme'e göre sahne paleti (CSS amber paletiyle birebir uyumlu)
const TEMA_PALETI = {
  dark: { renk: 0xe8a33c, opaklik: 0.85 },
  light: { renk: 0xb05e0a, opaklik: 0.5 },
}

// Üç derinlik katmanı: [parçacık sayısı, yarıçap aralığı, boyut, parallax katsayısı]
const KATMANLAR = [
  { sayi: 2400, ic: 10, dis: 26, boyut: 0.03, parallax: 0.15, opaklik: 0.5 }, // uzak
  { sayi: 1300, ic: 6, dis: 16, boyut: 0.055, parallax: 0.35, opaklik: 0.85 }, // orta
  { sayi: 500, ic: 4, dis: 11, boyut: 0.09, parallax: 0.6, opaklik: 1 }, // yakın
]

export function initHeroScene(canvas) {
  const hareketAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // ── Temel kurulum ──────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true, // şeffaf: arkadaki CSS gradyanları/grid görünsün
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // retina'da 3x boşa render etme
  renderer.setSize(window.innerWidth, window.innerHeight)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  )
  camera.position.z = 14

  const temaOku = () =>
    document.documentElement.getAttribute('data-theme') === 'light'
      ? TEMA_PALETI.light
      : TEMA_PALETI.dark
  let palet = temaOku()

  // ── Parçacık katmanlarını oluştur ────────────────────────────────────────
  // Her katman kendi grubunda → fareye farklı katsayıyla tepki = derinlik hissi.
  const katmanlar = KATMANLAR.map((k) => {
    const konumlar = new Float32Array(k.sayi * 3)
    for (let i = 0; i < k.sayi; i++) {
      // İçi boş küresel kabuk: merkez seyrek, kenarlar dolu — içerik nefes alsın
      const yaricap = k.ic + Math.random() * (k.dis - k.ic)
      const teta = Math.random() * Math.PI * 2
      const fi = Math.acos(2 * Math.random() - 1)
      konumlar[i * 3] = yaricap * Math.sin(fi) * Math.cos(teta)
      konumlar[i * 3 + 1] = yaricap * Math.sin(fi) * Math.sin(teta)
      konumlar[i * 3 + 2] = yaricap * Math.cos(fi)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(konumlar, 3))

    const mat = new THREE.PointsMaterial({
      color: palet.renk,
      size: k.boyut,
      transparent: true,
      opacity: palet.opaklik * k.opaklik,
      blending: THREE.AdditiveBlending, // üst üste gelince yumuşak parlama
      depthWrite: false,
      sizeAttenuation: true, // uzaktakiler küçük → doğal derinlik
    })

    const points = new THREE.Points(geo, mat)
    const grup = new THREE.Group()
    grup.add(points)
    scene.add(grup)
    return { ...k, geo, mat, grup, points }
  })

  // ── Etkileşim durumu ─────────────────────────────────────────────────────
  const fare = { x: 0, y: 0 } // hedef (ham girdi)
  const fareYumusak = { x: 0, y: 0 } // smooth-damping ile yumuşatılmış
  let scrollIlerleme = 0 // 0 (tepe) → 1 (bir ekran aşağısı)

  const fareHareketi = (olay) => {
    fare.x = (olay.clientX / window.innerWidth) * 2 - 1 // -1..1
    fare.y = (olay.clientY / window.innerHeight) * 2 - 1
  }
  const scrollGuncelle = () => {
    scrollIlerleme = Math.min(window.scrollY / window.innerHeight, 1)
  }

  // ── Tema değişimini izle (dark/light geçişinde renkleri güncelle) ─────────
  const temaGozlemci = new MutationObserver(() => {
    palet = temaOku()
    katmanlar.forEach((k) => {
      k.mat.color.set(palet.renk)
      k.mat.opacity = palet.opaklik * k.opaklik
    })
  })
  temaGozlemci.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  // ── Yeniden boyutlandırma ─────────────────────────────────────────────────
  const boyutGuncelle = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  // ── Animasyon döngüsü ─────────────────────────────────────────────────────
  const saat = new THREE.Clock()
  let cerceveId = null
  let calisiyor = true

  const cizdir = () => {
    const delta = saat.getDelta()
    const zaman = saat.getElapsedTime()

    // Fare parallax: yaylı yumuşatma (ani değil — premium his)
    fareYumusak.x += (fare.x - fareYumusak.x) * Math.min(delta * 2.5, 1)
    fareYumusak.y += (fare.y - fareYumusak.y) * Math.min(delta * 2.5, 1)

    const solma = 1 - scrollIlerleme * 0.85
    katmanlar.forEach((k, i) => {
      // Sürekli, çok yavaş otomatik dönüş — katmanlar farklı yönde döner
      k.grup.rotation.y = zaman * 0.015 * (i % 2 === 0 ? 1 : -1)
      // Fare parallax: yakın katman çok, uzak katman az tepki verir → derinlik
      k.grup.rotation.x = fareYumusak.y * k.parallax * 0.4
      k.grup.position.x = fareYumusak.x * k.parallax * 1.2
      k.grup.position.y = -fareYumusak.y * k.parallax * 0.8
      // Scroll'da topluca soluklaş — içerik öne çıksın
      k.mat.opacity = palet.opaklik * k.opaklik * solma
    })

    // Scroll'da kamera hafifçe geri çekilir → derinlik artar
    camera.position.z = 14 + scrollIlerleme * 5

    renderer.render(scene, camera)
    if (calisiyor) cerceveId = requestAnimationFrame(cizdir)
  }

  // ── Sekme görünürlüğü: arkadayken döngüyü durdur (pil/CPU tasarrufu) ──────
  const gorunurlukDegisti = () => {
    if (document.hidden) {
      calisiyor = false
      if (cerceveId) cancelAnimationFrame(cerceveId)
    } else if (!calisiyor) {
      calisiyor = true
      saat.getDelta() // gizliyken biriken büyük delta'yı at
      cerceveId = requestAnimationFrame(cizdir)
    }
  }

  // ── Başlat ────────────────────────────────────────────────────────────────
  window.addEventListener('mousemove', fareHareketi, { passive: true })
  window.addEventListener('scroll', scrollGuncelle, { passive: true })
  window.addEventListener('resize', boyutGuncelle)
  document.addEventListener('visibilitychange', gorunurlukDegisti)

  if (hareketAzalt) {
    renderer.render(scene, camera) // tek statik kare, döngü yok
    calisiyor = false
  } else {
    cizdir()
  }

  // ── Temizlik: React unmount'unda çağrılır ─────────────────────────────────
  return function dispose() {
    calisiyor = false
    if (cerceveId) cancelAnimationFrame(cerceveId)
    window.removeEventListener('mousemove', fareHareketi)
    window.removeEventListener('scroll', scrollGuncelle)
    window.removeEventListener('resize', boyutGuncelle)
    document.removeEventListener('visibilitychange', gorunurlukDegisti)
    temaGozlemci.disconnect()
    // GPU belleğini serbest bırak — bellek sızıntısını önler
    katmanlar.forEach((k) => {
      k.geo.dispose()
      k.mat.dispose()
    })
    renderer.dispose()
  }
}
