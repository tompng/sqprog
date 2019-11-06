import React from 'react'
import styled from 'styled-components'
import { Header, PageBody } from './components/Header'
import { Link } from './components/Link'
import { Button } from '@material-ui/core'

export const TopPage: React.FC = () => {
  return <>
    <Header title="いかちゃんプログラミング" current="toppage" />
    <PageBody>
      コードを送ったらいかちゃんが適当なコメントを返してくれるよ
      <Link to="/questions/new"><Button>コードを送る</Button></Link>
      <Link to="/questions/"><Button>みんなのコードを見る</Button></Link>
    </PageBody>
  </>
}

const ReadAllWrapper = styled.div`
  margin-bottom: 16px;
`
