import * as THREE from 'three'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  heroScene — Sayfanın imza öğesi: yaşayan bir "takımyıldız ağı" (saf Three.js)
 * ─────────────────────────────────────────────────────────────────────────────
 *  React'ten tamamen bağımsızdır: bir <canvas> alır, sahneyi kurar ve geriye
 *  yalnızca bir `dispose()` fonksiyonu döndürür (CLAUDE.md katmanlı mimari).
 *
 *  Sahne iki katmandan oluşur:
 *   1. Takımyıldız ağı — yavaşça süzülen düğümler ve birbirine yaklaşınca
 *      beliren ince bağlantı çizgileri. "Akıllı ağ" hissi: bir geliştiricinin
 *      zihnindeki bağlantılı fikirler. Sayfanın imzası budur.
 *   2. Yıldız tozu  — arkada derinlik katan, sayıca çok, soluk zerreler.
 *
 *  Etkileşim: fare SPRING fiziğiyle takip edilir (yaylı, doğal his); imleç
 *  ağı nazikçe büker. Scroll ile sahne uzaklaşıp solar, içerik öne çıkar.
 *  Performans: mobilde düğüm/zerre sayısı ve DPR düşürülür; tek rAF döngüsü;
 *  sekme arkadayken duraklatma; reduced-motion'da çok yavaş minimal hareket;
 *  unmount'ta tam GPU temizliği.
 */

// data-theme'e göre sahne paleti (CSS amber paletiyle birebir uyumlu)
const TEMA_PALETI = {
  dark: { renk: 0xe8a33c, cizgi: 0xe8a33c, toz: 0xe8a33c, opaklik: 1 },
  light: { renk: 0xb05e0a, cizgi: 0xb05e0a, toz: 0xc8771a, opaklik: 0.62 },
}

/**
 * Spring — Tek eksenli yay fiziği (threejs-animation skill deseni).
 * Fare hedefini kritik-sönümlü bir yayla takip eder: ani sıçrama yok,
 * doğal bir "yaslanma" hissi var.
 */
class Spring {
  constructor(stiffness = 70, damping = 14) {
    this.stiffness = stiffness
    this.damping = damping
    this.deger = 0
    this.hiz = 0
    this.hedef = 0
  }
  guncelle(dt) {
    const kuvvet = -this.stiffness * (this.deger - this.hedef)
    const sonumleme = -this.damping * this.hiz
    this.hiz += (kuvvet + sonumleme) * dt
    this.deger += this.hiz * dt
    return this.deger
  }
}

export function initHeroScene(canvas) {
  const hareketAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobil = window.matchMedia('(max-width: 768px)').matches

  // Mobilde daha az düğüm/zerre ve daha düşük DPR → akıcı performans
  const DUGUM_SAYISI = mobil ? 34 : 70
  const TOZ_SAYISI = mobil ? 700 : 1800
  const BAGLANTI_MESAFESI = mobil ? 4.2 : 3.6 // bu mesafenin altındaki düğümler bağlanır
  const maxDpr = mobil ? 1.5 : 2

  // ── Temel kurulum ──────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true, // şeffaf: arkadaki CSS gradyanları/grid görünsün
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr))
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

  // Tüm sahneyi tek grupta topla — parallax/scroll'u gruba uygulamak ucuz
  const dunya = new THREE.Group()
  scene.add(dunya)

  // ── 1. Takımyıldız düğümleri ──────────────────────────────────────────────
  // Her düğümün konumu + çok yavaş bir drift hızı var (organik süzülme).
  const dugumKonum = new Float32Array(DUGUM_SAYISI * 3)
  const dugumHiz = new Float32Array(DUGUM_SAYISI * 3)
  const ALAN = 11 // düğümlerin dağıldığı küp yarı-boyutu
  for (let i = 0; i < DUGUM_SAYISI; i++) {
    dugumKonum[i * 3] = (Math.random() * 2 - 1) * ALAN
    dugumKonum[i * 3 + 1] = (Math.random() * 2 - 1) * ALAN * 0.7
    dugumKonum[i * 3 + 2] = (Math.random() * 2 - 1) * ALAN * 0.5
    dugumHiz[i * 3] = (Math.random() * 2 - 1) * 0.12
    dugumHiz[i * 3 + 1] = (Math.random() * 2 - 1) * 0.12
    dugumHiz[i * 3 + 2] = (Math.random() * 2 - 1) * 0.12
  }

  const dugumGeo = new THREE.BufferGeometry()
  dugumGeo.setAttribute('position', new THREE.BufferAttribute(dugumKonum, 3))
  const dugumMat = new THREE.PointsMaterial({
    color: palet.renk,
    size: mobil ? 0.13 : 0.1,
    transparent: true,
    opacity: 0.9 * palet.opaklik,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })
  const dugumler = new THREE.Points(dugumGeo, dugumMat)
  dunya.add(dugumler)

  // ── Bağlantı çizgileri ────────────────────────────────────────────────────
  // Olası en fazla çizgi sayısı kadar buffer önceden ayrılır; her frame yalnızca
  // aktif (yeterince yakın) çiftler doldurulur, gerisi setDrawRange ile gizlenir.
  const maxCizgi = (DUGUM_SAYISI * (DUGUM_SAYISI - 1)) / 2
  const cizgiKonum = new Float32Array(maxCizgi * 2 * 3)
  const cizgiAlfa = new Float32Array(maxCizgi * 2) // mesafeye göre solma (vertex alpha)
  const cizgiGeo = new THREE.BufferGeometry()
  cizgiGeo.setAttribute('position', new THREE.BufferAttribute(cizgiKonum, 3))
  cizgiGeo.setAttribute('aLpha', new THREE.BufferAttribute(cizgiAlfa, 1))

  // Çizgilere vertex-bazlı saydamlık vermek için küçük bir shader materyali:
  // yakın çiftler belirgin, eşiğe yaklaşanlar sönük → "akıllı ağ" hissi.
  const cizgiMat = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(palet.cizgi) },
      uOpacity: { value: 0.5 * palet.opaklik },
    },
    vertexShader: `
      attribute float aLpha;
      varying float vAlpha;
      void main() {
        vAlpha = aLpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(uColor, vAlpha * uOpacity);
      }
    `,
  })
  const cizgiler = new THREE.LineSegments(cizgiGeo, cizgiMat)
  dunya.add(cizgiler)

  // ── 2. Yıldız tozu (arka derinlik) ────────────────────────────────────────
  const tozKonum = new Float32Array(TOZ_SAYISI * 3)
  for (let i = 0; i < TOZ_SAYISI; i++) {
    const yaricap = 12 + Math.random() * 16
    const teta = Math.random() * Math.PI * 2
    const fi = Math.acos(2 * Math.random() - 1)
    tozKonum[i * 3] = yaricap * Math.sin(fi) * Math.cos(teta)
    tozKonum[i * 3 + 1] = yaricap * Math.sin(fi) * Math.sin(teta)
    tozKonum[i * 3 + 2] = yaricap * Math.cos(fi)
  }
  const tozGeo = new THREE.BufferGeometry()
  tozGeo.setAttribute('position', new THREE.BufferAttribute(tozKonum, 3))
  const tozMat = new THREE.PointsMaterial({
    color: palet.toz,
    size: 0.04,
    transparent: true,
    opacity: 0.4 * palet.opaklik,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })
  const toz = new THREE.Points(tozGeo, tozMat)
  dunya.add(toz)

  // ── Etkileşim durumu ─────────────────────────────────────────────────────
  const fareYayX = new Spring(60, 12) // yaylı fare takibi (doğal yaslanma)
  const fareYayY = new Spring(60, 12)
  let scrollIlerleme = 0

  const fareHareketi = (olay) => {
    fareYayX.hedef = (olay.clientX / window.innerWidth) * 2 - 1 // -1..1
    fareYayY.hedef = (olay.clientY / window.innerHeight) * 2 - 1
  }
  const scrollGuncelle = () => {
    scrollIlerleme = Math.min(window.scrollY / window.innerHeight, 1)
  }

  // ── Tema değişimi: renkleri canlı güncelle ────────────────────────────────
  const temaGozlemci = new MutationObserver(() => {
    palet = temaOku()
    dugumMat.color.set(palet.renk)
    dugumMat.opacity = 0.9 * palet.opaklik
    tozMat.color.set(palet.toz)
    tozMat.opacity = 0.4 * palet.opaklik
    cizgiMat.uniforms.uColor.value.set(palet.cizgi)
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr))
  }

  // ── Düğüm hareketi + bağlantıları her frame yeniden kur ───────────────────
  const esikKare = BAGLANTI_MESAFESI * BAGLANTI_MESAFESI // sqrt'tan kaçın
  const dugumPos = dugumGeo.attributes.position.array
  const hizOlcek = hareketAzalt ? 0.12 : 1 // reduced-motion: çok yavaş ama canlı

  const dugumleriGuncelle = (dt) => {
    // 1) Düğümleri yavaşça süzdür; alan kenarına çarpınca yönü tersine çevir
    for (let i = 0; i < DUGUM_SAYISI; i++) {
      const ix = i * 3
      for (let e = 0; e < 3; e++) {
        dugumPos[ix + e] += dugumHiz[ix + e] * dt * hizOlcek
        const sinir = e === 0 ? ALAN : e === 1 ? ALAN * 0.7 : ALAN * 0.5
        if (dugumPos[ix + e] > sinir || dugumPos[ix + e] < -sinir) {
          dugumHiz[ix + e] *= -1
        }
      }
    }
    dugumGeo.attributes.position.needsUpdate = true

    // 2) Yakın düğüm çiftleri arası çizgileri kur (O(n²) ama n küçük)
    let v = 0 // çizgi vertex sayacı
    for (let i = 0; i < DUGUM_SAYISI; i++) {
      const ax = dugumPos[i * 3]
      const ay = dugumPos[i * 3 + 1]
      const az = dugumPos[i * 3 + 2]
      for (let j = i + 1; j < DUGUM_SAYISI; j++) {
        const dx = ax - dugumPos[j * 3]
        const dy = ay - dugumPos[j * 3 + 1]
        const dz = az - dugumPos[j * 3 + 2]
        const mesafeKare = dx * dx + dy * dy + dz * dz
        if (mesafeKare < esikKare) {
          // Mesafe arttıkça çizgi soluklaşır (yakınlık = güçlü bağ)
          const alfa = 1 - mesafeKare / esikKare
          cizgiKonum[v * 3] = ax
          cizgiKonum[v * 3 + 1] = ay
          cizgiKonum[v * 3 + 2] = az
          cizgiAlfa[v] = alfa
          v++
          cizgiKonum[v * 3] = dugumPos[j * 3]
          cizgiKonum[v * 3 + 1] = dugumPos[j * 3 + 1]
          cizgiKonum[v * 3 + 2] = dugumPos[j * 3 + 2]
          cizgiAlfa[v] = alfa
          v++
        }
      }
    }
    cizgiGeo.setDrawRange(0, v) // yalnızca aktif çizgileri çiz
    cizgiGeo.attributes.position.needsUpdate = true
    cizgiGeo.attributes.aLpha.needsUpdate = true
  }

  // ── Animasyon döngüsü ─────────────────────────────────────────────────────
  const saat = new THREE.Clock()
  let cerceveId = null
  let calisiyor = true

  const cizdir = () => {
    const dt = Math.min(saat.getDelta(), 0.05) // sekme dönüşünde sıçramayı sınırla
    const zaman = saat.getElapsedTime()

    const fx = fareYayX.guncelle(dt)
    const fy = fareYayY.guncelle(dt)

    dugumleriGuncelle(dt)

    // Sahne sürekli çok yavaş döner + yaylı fare parallax'ı ile bükülür
    dunya.rotation.y = zaman * 0.03 * hizOlcek + fx * 0.35
    dunya.rotation.x = fy * 0.22
    toz.rotation.y = -zaman * 0.015 * hizOlcek

    // Scroll: kamera geri çekilir, sahne topluca solar (içerik öne çıksın)
    camera.position.z = 14 + scrollIlerleme * 5
    const solma = 1 - scrollIlerleme * 0.85
    dugumMat.opacity = 0.9 * palet.opaklik * solma
    tozMat.opacity = 0.4 * palet.opaklik * solma
    cizgiMat.uniforms.uOpacity.value = 0.5 * palet.opaklik * solma

    renderer.render(scene, camera)
    if (calisiyor) cerceveId = requestAnimationFrame(cizdir)
  }

  // ── Sekme görünürlüğü: arkadayken döngüyü durdur ──────────────────────────
  const gorunurlukDegisti = () => {
    if (document.hidden) {
      calisiyor = false
      if (cerceveId) cancelAnimationFrame(cerceveId)
    } else if (!calisiyor) {
      calisiyor = true
      saat.getDelta()
      cerceveId = requestAnimationFrame(cizdir)
    }
  }

  // ── Başlat ────────────────────────────────────────────────────────────────
  window.addEventListener('mousemove', fareHareketi, { passive: true })
  window.addEventListener('scroll', scrollGuncelle, { passive: true })
  window.addEventListener('resize', boyutGuncelle)
  document.addEventListener('visibilitychange', gorunurlukDegisti)

  // reduced-motion: döngü yine çalışır ama çok yavaş (hizOlcek 0.12) — tek
  // donuk kare yerine "neredeyse durağan, hafifçe nefes alan" bir sahne.
  cizdir()

  // ── Temizlik ──────────────────────────────────────────────────────────────
  return function dispose() {
    calisiyor = false
    if (cerceveId) cancelAnimationFrame(cerceveId)
    window.removeEventListener('mousemove', fareHareketi)
    window.removeEventListener('scroll', scrollGuncelle)
    window.removeEventListener('resize', boyutGuncelle)
    document.removeEventListener('visibilitychange', gorunurlukDegisti)
    temaGozlemci.disconnect()
    dugumGeo.dispose()
    dugumMat.dispose()
    cizgiGeo.dispose()
    cizgiMat.dispose()
    tozGeo.dispose()
    tozMat.dispose()
    renderer.dispose()
  }
}
