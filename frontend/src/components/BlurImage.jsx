import { useEffect, useRef, useState } from 'react'

function BlurImage({ className = '', onLoad, ...rest }) {
  const [yuklendi, setYuklendi] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current?.complete) setYuklendi(true)
  }, [])

  return (
    <img
      ref={ref}
      className={`blur-img ${yuklendi ? 'is-loaded' : ''} ${className}`.trim()}
      decoding="async"
      onLoad={(olay) => {
        setYuklendi(true)
        onLoad?.(olay)
      }}
      {...rest}
    />
  )
}

export default BlurImage
