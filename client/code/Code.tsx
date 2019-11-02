import React, { useMemo, useState, useCallback } from 'react'
import highlightLines from '../lib/highlight'
import styled from 'styled-components'
import { StyledCode } from './StyledCode'
import {
  FormControl, Input, InputLabel, TextField,
  Paper, IconButton, Button,
  makeStyles
} from '@material-ui/core'

import { NewCommentForm, UpdateCommentForm } from '../comment/CommentForm'

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

export const Code: React.FC<{ fileName: string; code: string }> = ({ fileName, code }) => {
  const lang = useMemo(() => {
    const match = fileName.match(/\.([^.]+)/)
    return match ? match[1] : ''
  }, [fileName])
  const classes = useStyles()
  const htmls = useMemo(() => highlightLines(lang, code), [code])
  return <Paper>
    <b>file:{fileName}</b>
    <hr />
    <table className={classes.table}>
      <tbody>
      {
        htmls.map((html, lineIndex) => (
          <CodeLine key={lineIndex} html={html} lineNumber={lineIndex + 1} />
        ))
      }
      </tbody>
    </table>
  </Paper>
}

const CodeLineBase: React.FC<{ lineNumber: number; html: string }> = ({ lineNumber, html }) => {
  const classes = useStyles()
  const [commentOpen, setCommentOpen] = useState(false)
  return <>
    <tr onClick={() => setCommentOpen(true)} className={classes.commentableRow}>
      <td className={classes.lineNumberCol} data-line-number={lineNumber} />
      <td className={classes.codeCol}>
        <StyledCode dangerouslySetInnerHTML={{ __html: html }} />
      </td>
    </tr>
    { commentOpen &&
      <tr>
        <td className={classes.lineNumberCol}></td>
        <td className={classes.codeCol}>
          <NewCommentForm cancel={()=>setCommentOpen(false)} submit={() => {}}/>
        </td>
      </tr>
    }
  </>
}
const CodeLine = React.memo(CodeLineBase)
