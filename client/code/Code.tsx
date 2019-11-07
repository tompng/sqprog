import React, { useMemo, useState, useCallback } from 'react'
import highlightLines from '../lib/highlight'
import styled from 'styled-components'
import { StyledCode } from './StyledCode'
import {
  Paper, Button, Typography,
  makeStyles
} from '@material-ui/core'
import CommentIcon from '@material-ui/icons/Comment'
import { CodeIdContext, LineNumberContext } from '../context'
import { NewCommentForm } from '../comment/CommentForm'
import Comment, { CommentSample, CommentSampleProps } from '../comment/Comment'

const useStyles = makeStyles({
  paper: {
    marginBottom: '2em',
    background: '#eee'
  },
  table: {
    borderSpacing: 0,
    width: '100%',
  },
  codeCol: {
    paddingLeft: '0.4em',
    paddingRight: '0.4em'
  },
  commentableRow: {
    cursor: 'pointer',
    lineHeight: '1.2em',
    '&:hover': { background: '#eee' },
    '&:hover td:first-child:after': {
      position: 'absolute',
      fontSize: '1.5em',
      color: 'gray',
      fontWeight: 'bold',
      top: '0',
      left: '0.1em',
      height: '1.2em',
      lineHeight: '1.2em',
      content: '"+"'
    }
  },
  lineNumberCol: {
    position: 'relative',
    width: '3em',
    minWidth: '3em',
    maxWidth: '3em',
    color: 'silver',
    paddingRight: '0.4em',
    borderRight: '1px solid silver',
    fontFamily: 'monospace',
    textAlign: 'right',
    fontSize: '0.8em',
    '&:before': { content: 'attr(data-line-number)' }
  }
})

type VoteValue = 'up' | 'down' | 'forward' | 'rotate'
type Comment = {
  id: number
  uid: string
  content: string
  myVote: { value: VoteValue } | null
  voteSummary: { [key in VoteValue]?: number | null }
}
type CodeProps = {
  codeId: number
  fileName: string
  code: string
  threads: {
    lineNumber: number
    comments: Comment[]
  }[]
}
const FileName = styled.div`
  padding: 4px;
  color: gray;
  font-weight: bold;
  border-bottom: 1px solid silver;
`
const ScrollableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`
export const Code: React.FC<CodeProps> = ({ codeId, fileName, code, threads }) => {
  const lang = useMemo(() => {
    const match = fileName.match(/\.([^.]+)/)
    return match ? match[1] : ''
  }, [fileName])
  const classes = useStyles()
  const htmls = useMemo(() => highlightLines(lang, code), [code])
  const commentsByLineNumber = useMemo(() => {
    return new Map(threads.map(t => [t.lineNumber, t.comments]))
  }, [threads])
  return <CodeIdContext.Provider value={codeId}>
    <Paper className={classes.paper}>
      <FileName><Typography>file:&nbsp;{fileName}</Typography></FileName>
      <ScrollableWrapper>
        <table className={classes.table}>
          <tbody>
          {
            htmls.map((html, lineIndex) => {
              const lineNumber = lineIndex + 1
              return <CodeLine key={lineNumber} html={html} comments={commentsByLineNumber.get(lineNumber)} lineNumber={lineNumber} />
            })
          }
          </tbody>
        </table>
      </ScrollableWrapper>
    </Paper>
  </CodeIdContext.Provider>
}

export const CodeSample: React.FC<{
  code: string
  lang: string
  threads: {
    lineNumber: number
    comments: CommentSampleProps[]
  }[]
}> = ({ lang, code, threads }) => {
  const htmls = useMemo(() => highlightLines(lang, code), [code])
  return <>
    {
      htmls.map((html, lineIndex) => {
        const thread = threads.find(t => t.lineNumber === lineIndex + 1)
        return <div key={lineIndex}>
          <StyledCode dangerouslySetInnerHTML={{ __html: html }} />
          {thread &&
            <CommentGroup style={{ maxWidth: 'none' }}>
              {
                thread.comments.map((c, i) => <CommentSample key={i} {...c}/>)
              }
            </CommentGroup>
          }
        </div>
      })
    }
  </>
}

const CommentGroup = styled.div`
  max-width: calc(100vw - 4.4em);
  border-radius: 4px;
  border: 1px solid silver;
  margin-bottom: 0.4em;
  background: white;
`

const CodeLineBase: React.FC<{ lineNumber: number; comments?: Comment[]; html: string }> = ({ lineNumber, html, comments }) => {
  const classes = useStyles()
  const [commentOpen, setCommentOpen] = useState(false)
  const cancel = useCallback(() => { setCommentOpen(false) }, [setCommentOpen])
  const openComment = useCallback(() => { setCommentOpen(true) }, [setCommentOpen])
  return <LineNumberContext.Provider value={lineNumber}>
    <tr onClick={openComment} className={classes.commentableRow}>
      <td className={classes.lineNumberCol} data-line-number={lineNumber} />
      <td className={classes.codeCol}>
        <StyledCode dangerouslySetInnerHTML={{ __html: html }} />
      </td>
    </tr>
    { (comments || commentOpen) &&
      <tr>
        <td className={classes.lineNumberCol}></td>
        <td className={classes.codeCol}>
          <CommentGroup>
            {
              comments && comments.map(c => <Comment key={c.id} commentId={c.id} {...c} myVote={c.myVote && c.myVote.value}/>)
            }
            {!commentOpen && <Button onClick={openComment}><CommentIcon />コメント</Button>}
            {commentOpen && <NewCommentForm autoFocus cancel={cancel} />}
          </CommentGroup>
        </td>
      </tr>
    }
  </LineNumberContext.Provider>
}
const CodeLine = React.memo(CodeLineBase)
