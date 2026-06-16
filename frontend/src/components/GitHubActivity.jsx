import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ArrowUpRight, GitFork, Star, Users } from 'lucide-react'
import { GitHubIcon } from './icons/BrandIcons.jsx'
import { profile } from '../data/content.js'
import BentoCard from './BentoCard.jsx'
import Counter from './Counter.jsx'

const GITHUB_API = 'https://api.github.com'
// Vitrine çıkarılacak repo sayısı — yıldız sayısına göre en iyi N repo seçilir.
const ONE_CIKAN_REPO_SAYISI = 4
// Dil dağılımında ayrı gösterilecek en fazla dil; gerisi "Diğer"de toplanır.
const EN_FAZLA_DIL = 5

// GitHub'ın resmi dil renkleri (linguist). Bilinmeyen diller accent'e düşer.
const DIL_RENKLERI = {
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

const dilRengi = (dil) => DIL_RENKLERI[dil] || 'var(--accent)'

// Deterministik pseudo-random: indeksten 0–1 arası, saf (idempotent) değer üretir.
// Math.random yerine bunu kullanıyoruz; böylece render saf kalır (React purity
// kuralı) ve ızgara her render'da aynı organik desende olur. tohum, aynı indeksin
// üç farklı özelliği için farklı çıktı vermesini sağlar.
const sozdeRastgele = (indeks, tohum) => {
  const x = Math.sin((indeks + 1) * tohum) * 43758.5453
  return x - Math.floor(x)
}

/**
 * KatkiIzgarasi — GitHub katkı grafiğini (contribution heatmap) andıran,
 * yanıp sönen kareler arka planı. Tamamen dekoratif (aria-hidden).
 *
 * Kareler `useMemo` ile bir kez üretilir; her birine indekse bağlı (deterministik)
 * bir animasyon gecikmesi ve süresi verilir, böylece ızgara organik biçimde
 * "nefes alır". Animasyonun kendisi CSS'tedir (github-cell-pulse) — JS sadece
 * zamanlamayı dağıtır, kare başına render maliyeti sıfırdır.
 */
function KatkiIzgarasi() {
  const kareler = useMemo(
    () =>
      Array.from({ length: 110 }, (_, i) => ({
        delay: (sozdeRastgele(i, 12.9898) * 4).toFixed(2),
        duration: (2.5 + sozdeRastgele(i, 78.233) * 3).toFixed(2),
        // Kareler farklı "yoğunluk" seviyelerinde başlasın (gerçek heatmap gibi)
        seviye: Math.floor(sozdeRastgele(i, 39.425) * 4),
      })),
    [],
  )

  return (
    <div className="github-grid" aria-hidden="true">
      {kareler.map((kare, sira) => (
        <span
          key={sira}
          className={`github-grid__cell github-grid__cell--l${kare.seviye}`}
          style={{
            animationDelay: `${kare.delay}s`,
            animationDuration: `${kare.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * GitHubSkeleton — Veri yüklenirken gösterilen "shimmer" iskelet.
 * Amatör bir "Loading..." yazısı yerine gelecek içeriğin silüetini çizer.
 */
function GitHubSkeleton() {
  return (
    <div className="github-card__layout" aria-hidden="true">
      <div className="github-card__main">
        <div className="github-card__profile">
          <span className="skeleton skeleton--avatar" />
          <div className="github-card__profile-text">
            <span className="skeleton skeleton--line" style={{ width: '45%' }} />
            <span className="skeleton skeleton--line" style={{ width: '70%' }} />
          </div>
        </div>
        <div className="github-card__stats">
          {[0, 1, 2, 3].map((sira) => (
            <span key={sira} className="skeleton skeleton--stat" />
          ))}
        </div>
        <span className="skeleton skeleton--line" style={{ width: '100%', height: '12px' }} />
      </div>
      <div className="github-card__repos">
        {[0, 1, 2].map((sira) => (
          <span key={sira} className="skeleton skeleton--repo" />
        ))}
      </div>
    </div>
  )
}

/**
 * GitHubActivity — GitHub REST API'sinden canlı veri çeken zengin kart.
 *
 * Çekilen veriden türetilenler (hepsi istemci tarafında hesaplanır):
 *  - Dil dağılımı: tüm repoların `language` alanları sayılıp yüzdelenir.
 *  - Toplam yıldız: repoların yıldızları toplanır.
 *  - Öne çıkan repolar: en çok yıldız alan ilk N repo.
 *
 * Teknik kararlar:
 *  - Promise.all: profil + repo istekleri paralel atılır (~2x hızlı).
 *  - AbortController: component kalkarsa istekler iptal edilir.
 *  - Üç durumlu UI (loading / error / success): ziyaretçi asla boş ekran görmez.
 */
function GitHubActivity() {
  const [kullanici, setKullanici] = useState(null)
  const [repolar, setRepolar] = useState([])
  const [diller, setDiller] = useState([])
  const [toplamYildiz, setToplamYildiz] = useState(0)
  const [durum, setDurum] = useState('loading') // 'loading' | 'error' | 'success'

  useEffect(() => {
    const iptalKontrol = new AbortController()

    async function verileriGetir() {
      try {
        const [kullaniciYaniti, repoYaniti] = await Promise.all([
          fetch(`${GITHUB_API}/users/${profile.githubUsername}`, {
            signal: iptalKontrol.signal,
          }),
          fetch(
            `${GITHUB_API}/users/${profile.githubUsername}/repos?per_page=100&sort=updated`,
            { signal: iptalKontrol.signal },
          ),
        ])

        if (!kullaniciYaniti.ok || !repoYaniti.ok) {
          throw new Error(`GitHub API hatası: ${kullaniciYaniti.status}`)
        }

        const kullaniciVerisi = await kullaniciYaniti.json()
        const repoVerisi = await repoYaniti.json()

        // ── Dil dağılımı: her repodaki ana dili say, yüzdeye çevir ──
        const dilSayaci = {}
        for (const repo of repoVerisi) {
          if (repo.language) {
            dilSayaci[repo.language] = (dilSayaci[repo.language] || 0) + 1
          }
        }
        const dilToplami = Object.values(dilSayaci).reduce((a, b) => a + b, 0)
        const siraliDiller = Object.entries(dilSayaci)
          .sort((a, b) => b[1] - a[1])
          .map(([ad, adet]) => ({
            ad,
            yuzde: Math.round((adet / dilToplami) * 100),
            renk: dilRengi(ad),
          }))

        // İlk EN_FAZLA_DIL dili göster, kalanları "Diğer" olarak topla
        const ustDiller = siraliDiller.slice(0, EN_FAZLA_DIL)
        const kalanYuzde = siraliDiller
          .slice(EN_FAZLA_DIL)
          .reduce((a, d) => a + d.yuzde, 0)
        if (kalanYuzde > 0) {
          ustDiller.push({ ad: 'Diğer', yuzde: kalanYuzde, renk: 'var(--text-tertiary)' })
        }

        // ── Toplam yıldız + öne çıkan repolar ──
        const yildizToplami = repoVerisi.reduce((a, r) => a + r.stargazers_count, 0)
        const oneCikanlar = [...repoVerisi]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, ONE_CIKAN_REPO_SAYISI)

        setKullanici(kullaniciVerisi)
        setRepolar(oneCikanlar)
        setDiller(ustDiller)
        setToplamYildiz(yildizToplami)
        setDurum('success')
      } catch (hata) {
        // Bilinçli iptal (unmount) hata sayılmaz
        if (hata.name !== 'AbortError') setDurum('error')
      }
    }

    verileriGetir()
    return () => iptalKontrol.abort()
  }, [])

  return (
    <BentoCard
      span={12}
      id="github"
      label="GitHub — Canlı Veri"
      labelId="github-baslik"
      className="github-card"
    >
      {/* Animasyonlu katkı ızgarası: kartın arka planında nefes alır */}
      <KatkiIzgarasi />

      {durum === 'loading' && <GitHubSkeleton />}

      {durum === 'error' && (
        <div className="github-card__error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <p>
            GitHub verilerine şu an ulaşılamıyor (API limiti veya bağlantı sorunu).
            Profilime{' '}
            <a
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              buradan
            </a>{' '}
            göz atabilirsiniz.
          </p>
        </div>
      )}

      {durum === 'success' && kullanici && (
        <div className="github-card__layout">
          {/* SOL: profil + istatistikler + dil dağılımı */}
          <div className="github-card__main">
            <div className="github-card__profile">
              <img
                src={kullanici.avatar_url}
                alt={`${kullanici.name || kullanici.login} GitHub avatarı`}
                className="github-card__avatar"
                width="60"
                height="60"
                loading="lazy"
              />
              <div className="github-card__profile-text">
                <h2 className="github-card__name">
                  {kullanici.name || kullanici.login}
                  <span className="github-card__login">@{kullanici.login}</span>
                </h2>
                {kullanici.bio && <p className="github-card__bio">{kullanici.bio}</p>}
              </div>
              <a
                href={`https://github.com/${kullanici.login}`}
                className="github-card__visit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profilini aç"
              >
                <GitHubIcon size={15} aria-hidden="true" />
                <ArrowUpRight size={13} className="github-card__visit-arrow" aria-hidden="true" />
              </a>
            </div>

            {/* Dört istatistik: repo, yıldız, takipçi, takip.
                Rakamlar görünür olunca 0'dan sayarak gelir (canlı veri hissi). */}
            <dl className="github-card__stats">
              <div className="github-card__stat">
                <dt>Repo</dt>
                <dd><Counter value={kullanici.public_repos} /></dd>
              </div>
              <div className="github-card__stat">
                <dt>
                  <Star size={12} aria-hidden="true" /> Yıldız
                </dt>
                <dd><Counter value={toplamYildiz} /></dd>
              </div>
              <div className="github-card__stat">
                <dt>
                  <Users size={12} aria-hidden="true" /> Takipçi
                </dt>
                <dd><Counter value={kullanici.followers} /></dd>
              </div>
              <div className="github-card__stat">
                <dt>Takip</dt>
                <dd><Counter value={kullanici.following} /></dd>
              </div>
            </dl>

            {/* Dil dağılımı: tek satırlık renkli çubuk + lejant */}
            {diller.length > 0 && (
              <div className="lang-dist">
                <p className="lang-dist__title">En çok kullandığım diller</p>
                <div
                  className="lang-dist__bar"
                  role="img"
                  aria-label={`Dil dağılımı: ${diller.map((d) => `${d.ad} %${d.yuzde}`).join(', ')}`}
                >
                  {diller.map((dil, sira) => (
                    <span
                      key={dil.ad}
                      className="lang-dist__segment"
                      style={{
                        '--seg-width': `${dil.yuzde}%`,
                        '--seg-color': dil.renk,
                        '--seg-delay': `${sira * 90}ms`,
                      }}
                    />
                  ))}
                </div>
                <ul className="lang-dist__legend">
                  {diller.map((dil) => (
                    <li key={dil.ad} className="lang-dist__item">
                      <span
                        className="lang-dist__dot"
                        style={{ background: dil.renk }}
                        aria-hidden="true"
                      />
                      {dil.ad}
                      <span className="lang-dist__pct">%{dil.yuzde}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SAĞ: öne çıkan repolar */}
          <div className="github-card__side">
            <p className="github-card__side-title">Öne çıkan repolar</p>
            <ul className="github-card__repos" aria-label="Öne çıkan repolar">
              {repolar.map((repo) => (
                <li key={repo.id}>
                  <a
                    href={repo.html_url}
                    className="repo-row"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="repo-row__name">{repo.name}</span>
                    {repo.description && (
                      <span className="repo-row__description">{repo.description}</span>
                    )}
                    <span className="repo-row__meta">
                      {repo.language && (
                        <span className="repo-row__language">
                          <span
                            className="repo-row__language-dot"
                            style={{ background: dilRengi(repo.language) }}
                            aria-hidden="true"
                          />
                          {repo.language}
                        </span>
                      )}
                      <span className="repo-row__stat">
                        <Star size={13} aria-hidden="true" />
                        {repo.stargazers_count}
                      </span>
                      <span className="repo-row__stat">
                        <GitFork size={13} aria-hidden="true" />
                        {repo.forks_count}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </BentoCard>
  )
}

export default GitHubActivity
