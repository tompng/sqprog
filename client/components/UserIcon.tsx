import React, { useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { genIconSVG, genIkachanSVG } from '../lib/ikachan'

const IconFactory = {
  icons: new Map<string, { ref: number; svg: string }>(),
  get(uid: string) {
    const el = this.icons.get(uid)
    if (el) {
      el.ref++
      return el.svg
    }
    const svg = uid === 'ikachan' ? genIkachanSVG() : genIconSVG(uid)
    this.icons.set(uid, { ref: 1, svg })
    return svg
  },
  release(uid: string) {
    const el = this.icons.get(uid)
    if (!el) return
    el.ref--
    if (el.ref === 0) this.icons.delete(uid)
  }
}
;(window as any).IconFactory = IconFactory

const Icon = styled.div`
  background-size: cover;
  border-radius: 50%;
`
const UserIcon: React.FC<{ uid: string, size: number }> = ({ uid, size }) => {
  const svg = useIconSVG(uid)
  return <>
    <Icon style={{ width: size, height: size, backgroundImage: `url('data:image/svg+xml,${svg}')` }} />
  </>
}

export function useIconSVG(uid: string) {
  const svg = useMemo(() => IconFactory.get(uid), [uid])
  useEffect(() => {
    return () => IconFactory.release(uid)
  }, [uid])
  return svg
}

export default React.memo(UserIcon)
