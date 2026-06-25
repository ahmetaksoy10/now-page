import { useEffect, useState } from 'react'
import { profile } from '../data/content.js'

function IntroOverlay() {
  const [durum, setDurum] = useState('acik')
  useEffect(() => {
    const azalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gorulmus = sessionStorage.getItem('now-page-intro') === '1'
    if (azalt || gorulmus) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDurum('gizli')
      return
    }
    sessionStorage.setItem('now-page-intro', '1')
    const zamanlayici = setTimeout(() => setDurum('kapaniyor'), 1150)
    return () => clearTimeout(zamanlayici)
  }, [])
  useEffect(() => {
    if (durum !== 'kapaniyor') return
    const zamanlayici = setTimeout(() => setDurum('gizli'), 800)
    return () => clearTimeout(zamanlayici)
  }, [durum])

  if (durum === 'gizli') return null

  return (
    <div className={`intro ${durum === 'kapaniyor' ? 'intro--leaving' : ''}`} aria-hidden="true">
      <div className="intro__inner">
        <span className="intro__name">{profile.name}</span>
        <span className="intro__tag">şu an — bugünkü ben</span>
        <span className="intro__line" />
      </div>
    </div>
  )
}

export default IntroOverlay
