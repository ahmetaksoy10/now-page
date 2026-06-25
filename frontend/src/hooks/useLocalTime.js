import { useEffect, useState } from 'react'
const saatBicimi = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Europe/Istanbul',
})

export function useLocalTime() {
  const [simdi, setSimdi] = useState(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSimdi(new Date())
    const sayac = setInterval(() => setSimdi(new Date()), 1000)
    return () => clearInterval(sayac)
  }, [])

  return simdi ? saatBicimi.format(simdi) : '··:··:··'
}
