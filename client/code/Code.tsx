import React, { useMemo, useCallback } from 'react'
import highlightLines from '../lib/highlight'
import styled from 'styled-components'
import {
  FormControl, Input, InputLabel, TextField,
  Paper, IconButton, Button,
  makeStyles
} from '@material-ui/core'

export const Code: React.FC<{ fileName: string; code: string }> = ({ fileName, code }) => {
  const lang = useMemo(() => {
    const match = fileName.match(/\.([^.]+)/)
    return match ? match[1] : ''
  }, [fileName])
  const htmls = useMemo(() => highlightLines(lang, code), [code])
  return <Paper>
    <b>file:{fileName}</b>
    <hr />
    {
      htmls.map((html, i) => {
        return <CodeHighlightDiv key={i} dangerouslySetInnerHTML={{ __html: html }} />
      })
    }
  </Paper>
}

const CodeHighlightDiv = styled.div`
  font-family: Courier, Osaka-Mono, monospace;
  white-space: pre;
  & .hljs-comment, & .hljs-quote {
    color: #8e908c;
  }
  & .hljs-variable, & .hljs-template-variable,
  & .hljs-tag, & .hljs-name,
  & .hljs-selector-id, & .hljs-selector-class,
  & .hljs-regexp, & .hljs-deletion {
    color: #c82829;
  }
  & .hljs-number, & .hljs-built_in,
  & .hljs-builtin-name, & .hljs-literal,
  & .hljs-type, & .hljs-params,
  & .hljs-meta, & .hljs-link {
    color: #f5871f;
  }
  & .hljs-attribute {
    color: #eab700;
  }
  & .hljs-string, & .hljs-symbol,
  & .hljs-bullet, & .hljs-addition {
    color: #718c00;
  }
  & .hljs-title, & .hljs-section {
    color: #4271ae;
  }
  & .hljs-keyword, & .hljs-selector-tag {
    color: #8959a8;
  }
  & .hljs-emphasis {
    font-style: italic;
  }
  & .hljs-strong {
    font-weight: bold;
  }
`
