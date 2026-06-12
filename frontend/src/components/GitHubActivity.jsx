import { useEffect, useState } from 'react'
import { AlertCircle, GitFork, Star, Users } from 'lucide-react'
import { profile } from '../data/content.js'
import BentoCard from './BentoCard.jsx'

const GITHUB_API = 'https://api.github.com'
// Vitrine çıkarılacak repo sayısı — yıldız sayısına göre en iyi N repo seçilir.
const ONE_CIKAN_REPO_SAYISI = 3

/**
 * GitHubSkeleton — Veri yüklenirken gösterilen "shimmer" iskelet.
 * Amatör bir "Loading..." yazısı yerine gelecek içeriğin silüetini çizer.
 */
function GitHubSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="github-card__profile">
        <span className="skeleton skeleton--avatar" />
        <div className="github-card__profile-text">
          <span className="skeleton skeleton--line" style={{ width: '40%' }} />
          <span className="skeleton skeleton--line" style={{ width: '65%' }} />
        </div>
      </div>
      <div className="github-card__stats">
        {[0, 1, 2].map((sira) => (
          <span key={sira} className="skeleton skeleton--stat" />
        ))}
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
 * GitHubActivity — GitHub REST API'sinden canlı veri çeken kart.
 *
 * Teknik kararlar:
 *  - Promise.all: profil + repo istekleri paralel atılır (~2x hızlı).
 *  - AbortController: component kalkarsa istekler iptal edilir.
 *  - Üç durumlu UI (loading / error / success): ziyaretçi asla boş ekran görmez.
 */
function GitHubActivity() {
  const [kullanici, setKullanici] = useState(null)
  const [repolar, setRepolar] = useState([])
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

        // En çok yıldız alan repoları öne çıkar
        const oneCikanlar = [...repoVerisi]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, ONE_CIKAN_REPO_SAYISI)

        setKullanici(kullaniciVerisi)
        setRepolar(oneCikanlar)
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
    <BentoCard span={7} id="github" label="GitHub — Canlı Veri" labelId="github-baslik">
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
        <div>
          <div className="github-card__profile">
            <img
              src={kullanici.avatar_url}
              alt={`${kullanici.name || kullanici.login} GitHub avatarı`}
              className="github-card__avatar"
              width="52"
              height="52"
              loading="lazy"
            />
            <div className="github-card__profile-text">
              <h2 className="github-card__name">
                {kullanici.name || kullanici.login}
                <span className="github-card__login">@{kullanici.login}</span>
              </h2>
              {kullanici.bio && <p className="github-card__bio">{kullanici.bio}</p>}
            </div>
          </div>

          <dl className="github-card__stats">
            <div className="github-card__stat">
              <dt>Repo</dt>
              <dd>{kullanici.public_repos}</dd>
            </div>
            <div className="github-card__stat">
              <dt>
                <Users size={13} aria-hidden="true" /> Takipçi
              </dt>
              <dd>{kullanici.followers}</dd>
            </div>
            <div className="github-card__stat">
              <dt>Takip</dt>
              <dd>{kullanici.following}</dd>
            </div>
          </dl>

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
                        <span className="repo-row__language-dot" aria-hidden="true" />
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
      )}
    </BentoCard>
  )
}

export default GitHubActivity
