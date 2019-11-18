import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Header, PageBody } from './components/Header'
import { Link } from './components/Link'
import { Button, Typography, Paper } from '@material-ui/core'
import { CodeSample } from './code/Code'
import SendIcon from '@material-ui/icons/Send'
import WidgetsIcon from '@material-ui/icons/Widgets'

const samplecode = `def hello_world!
  hello = 'Hello'.to_i(26) & 0xff
  space = ' '.ord
  world = 'World'.size
  exclam = '!'.ord
  linebreak = "\\n".ord
  message = (hello + hello) * hello + hello * space
  message += space * space * (space / world + world / world)
  message += (exclam + exclam) / exclam - exclam - linebreak
  puts message.chr 'utf-8'
end
hello_world!
`

export const TopPage: React.FC = () => {
  const threads = [{
    lineNumber: 10,
    comments: [{
      uid: 'ikachan',
      content: [
        'これはさかなですね`🐟`',
        'ふやしちゃえ',
        '```ruby',
        "$><< (message + rand(hello % world)).chr('utf-8')",
        'hello_world! if rand > 0.01',
        '```'
      ].join('\n'),
      myVote: null,
      voteSummary: {
        up: 4,
        down: 8,
      }
    }]
  }]
  const account = useMemo(() => {
    return document.querySelector('#app')!.getAttribute('data-ikachan-twitter') as string
  }, [])
  return <>
    <Header title="いかちゃんプログラミング" current="toppage" />
    <PageBody>
      <Typography variant="body1">
        コードを送ると、いかちゃん
        (<a href={`https://twitter.com/${account}`}>
          @{account}
        </a>)
        が適当なコメントを返してくれるよ
      </Typography>
      <Paper>
        <CodeWrapper>
          <CodeSample lang="ruby" code={samplecode} threads={threads} />
        </CodeWrapper>
      </Paper>
      <Link to="/questions/new">
        <Button variant="outlined" size="large">
          <SendIcon/ >
          コードを送る
        </Button>
      </Link>
      &nbsp;
      <Link to="/questions/">
        <Button variant="outlined" size="large">
          <WidgetsIcon/ >
          みんなのコードを見る
        </Button>
      </Link>
    </PageBody>
  </>
}

const CodeWrapper = styled.div`
  padding: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
  background: #eee;
`
