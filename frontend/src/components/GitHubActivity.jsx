import { useEffect, useState } from 'react'
import { AlertCircle, ArrowUpRight, GitFork, Star, Users } from 'lucide-react'
import { GitHubIcon } from './icons/BrandIcons.jsx'
import { profile } from '../data/content.js'
import { dilRengi, haftalaraBol, guncelSeri } from '../utils/github.js'
import BentoCard from './BentoCard.jsx'
import Counter from './Counter.jsx'

const GITHUB_API = 'https://api.github.com'
// Vitrine çıkarılacak repo sayısı — yıldız sayısına göre en iyi N repo seçilir.
const ONE_CIKAN_REPO_SAYISI = 4
// Dil dağılımında ayrı gösterilecek en fazla dil; gerisi "Diğer"de toplanır.
const EN_FAZLA_DIL = 5

// Katkı haritası için ücretsiz, auth gerektirmeyen public API (CORS açık).
// GitHub'ın resmi REST API'si katkı grafiği verisini vermez; bu servis
// profil sayfasındaki gerçek heatmap'i JSON olarak döndürür.
const KATKI_API = 'https://github-contributions-api.jogruber.de/v4'

/**
 * KatkiHaritasi — Son bir yılın GERÇEK GitHub katkı ısı haritası.
 *
 * Kendi verisini bağımsız çeker (ana kart isteklerini bloklamaz); başarısız
 * olursa sessizce gizlenir, kartın geri kalanı çalışmaya devam eder. Toplam
 * katkı ve güncel seri veriden türetilir — elle yazılmaz.
 */
function KatkiHaritasi({ username }) {
  const [veri, setVeri] = useState(null)
  const [durum, setDurum] = useState('loading')

  useEffect(() => {
    const iptal = new AbortController()
    fetch(`${KATKI_API}/${username}?y=last`, { signal: iptal.signal })
      .then((yanit) => {
        if (!yanit.ok) throw new Error('katki-api')
        return yanit.json()
      })
      .then((json) => {
        setVeri(json)
        setDurum('success')
      })
      .catch((hata) => {
        if (hata.name !== 'AbortError') setDurum('error')
      })
    return () => iptal.abort()
  }, [username])

  // Hata/yükleme: sessizce gizle (üçüncü taraf servis; kart geri kalanı sağlam)
  if (durum !== 'success' || !veri?.contributions?.length) return null

  const gunler = veri.contributions
  const haftalar = haftalaraBol(gunler)
  const toplam = gunler.reduce((a, g) => a + g.count, 0)
  const seri = guncelSeri(gunler)

  return (
    <div className="contrib">
      <div className="contrib__head">
        <p className="contrib__title">Son bir yılın katkıları</p>
        <p className="contrib__stats">
          <strong>{toplam}</strong> katkı · <strong>{seri}</strong> gün seri
        </p>
      </div>

      <div className="contrib__grid-wrap">
        <div
          className="contrib__grid"
          role="img"
          aria-label={`Son bir yılda ${toplam} katkı, güncel seri ${seri} gün`}
        >
          {haftalar.map((hafta, i) => (
            <div key={i} className="contrib__week">
              {hafta.map((gun, j) => (
                <span
                  key={j}
                  className={
                    gun
                      ? `contrib__day contrib__day--l${gun.level}`
                      : 'contrib__day contrib__day--empty'
                  }
                  title={gun ? `${gun.date}: ${gun.count} katkı` : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="contrib__legend" aria-hidden="true">
        <span>az</span>
        <span className="contrib__day contrib__day--l0" />
        <span className="contrib__day contrib__day--l1" />
        <span className="contrib__day contrib__day--l2" />
        <span className="contrib__day contrib__day--l3" />
        <span className="contrib__day contrib__day--l4" />
        <span>çok</span>
      </div>
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
        const [kullaniciYaniti, repoYaniti, starredYaniti] = await Promise.all([
          fetch(`${GITHUB_API}/users/${profile.githubUsername}`, {
            signal: iptalKontrol.signal,
          }),
          fetch(
            `${GITHUB_API}/users/${profile.githubUsername}/repos?per_page=100&sort=updated`,
            { signal: iptalKontrol.signal },
          ),
          fetch(
            `${GITHUB_API}/users/${profile.githubUsername}/starred?per_page=100`,
            { signal: iptalKontrol.signal },
          ),
        ])

        if (!kullaniciYaniti.ok || !repoYaniti.ok || !starredYaniti.ok) {
          throw new Error(`GitHub API hatası: ${kullaniciYaniti.status}`)
        }

        const kullaniciVerisi = await kullaniciYaniti.json()
        const repoVerisi = await repoYaniti.json()
        const starredVerisi = await starredYaniti.json()

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

        // ── Toplam yıldız (Kullanıcının yıldızladıkları) + öne çıkan repolar ──
        const yildizToplami = starredVerisi.length
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
        <>
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
                decoding="async"
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

        {/* Gerçek katkı ısı haritası (full-width, layout'un altında) */}
        <KatkiHaritasi username={profile.githubUsername} />
        </>
      )}
    </BentoCard>
  )
}

export default GitHubActivity
