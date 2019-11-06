import React, { useCallback } from 'react'
import styled from 'styled-components'
import useRouter from 'use-react-router'

export const Link: React.FC<{ to: string }> = ({ to, children }) => {
  const { history } = useRouter()
  const onClick = useCallback(e => {
    e.preventDefault()
    history.push(to)
  }, [to])
  return <NonDecoratedA href={to} onClick={onClick}>
    {children}
  </NonDecoratedA>
}
const NonDecoratedA = styled.a`
  text-decoration: inherit;
  color: inherit;
`
