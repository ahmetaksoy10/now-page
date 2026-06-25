import { useCountUp } from '../hooks/useCountUp.js'

function Counter({ value, duration = 1400, start = true }) {
  const { ref, deger } = useCountUp(value, { sure: duration, baslat: start })
  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {deger}
    </span>
  )
}

export default Counter
