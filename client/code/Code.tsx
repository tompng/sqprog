import React, { useMemo, useState, useCallback, useContext } from 'react'
import highlightLines from '../lib/highlight'
import styled from 'styled-components'
import { StyledCode } from './StyledCode'
import {
  FormControl, Input, InputLabel, TextField,
  Paper, IconButton, Button,
  makeStyles
} from '@material-ui/core'
import { CodeIdContext, LineNumberContext } from '../context'
import { NewCommentForm, UpdateCommentForm } from '../comment/CommentForm'
import Comment from '../comment/Comment'

const useStyles = makeStyles({
  table: {
    borderSpacing: 0,
    width: '100%'
  },
  codeCol: {
    paddingLeft: '0.4em'
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
    color: 'silver',
    paddingRight: '0.4em',
    borderRight: '1px solid silver',
    fontFamily: 'monospace',
    textAlign: 'right',
    fontSize: '0.8em',
    '&:before': { content: 'attr(data-line-number)' }
  }
})

type Comment = {
  id: number
  uid: string
  content: string
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
    <Paper>
      <b>file:{fileName}</b>
      <hr />
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
    </Paper>
  </CodeIdContext.Provider>
}

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
          {
            comments && comments.map(c => <Comment key={c.id} {...c} />)
          }
          {!commentOpen && <Button onClick={openComment}>コメント</Button>}
          {commentOpen && <NewCommentForm cancel={cancel} />}
        </td>
      </tr>
    }
  </LineNumberContext.Provider>
}
const CodeLine = React.memo(CodeLineBase)
