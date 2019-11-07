import React, { useEffect, useRef } from 'react'
import { Typography } from '@material-ui/core'
import { loadingIconPath } from '../lib/ikachan'

export const Loading: React.FC = () => {
  const ref = useRef<SVGPathElement | null>(null)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!ref.current) return
      ref.current.setAttribute('d', loadingIconPath(performance.now() / 240))
    }, 16)
    return () => clearInterval(timer)
  }, [])
  return <div style={{ textAlign: 'center' }}>
    <svg width={100} height={100}>
      <path strokeWidth="2" fill="none" stroke="gray" ref={ref} />
    </svg>
    <div>
      <Typography>Loading...</Typography>
    </div>
  </div>
}
/*
document.body.innerHTML='<svg><path d="M1,1 L100,100" stroke="black" fill="none"/></svg>';path=document.body.firstChild.firstChild;setInterval(()=>path.setAttribute('d', iconpath(performance.now()/300)))
*/
