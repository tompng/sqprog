import React from 'react'
import { StyledCode } from '../code/StyledCode'
import { mdparse } from '../lib/md'
import { highlightCode } from '../lib/highlight'
import {
  Typography,
  makeStyles
} from '@material-ui/core'


const useStyles = makeStyles({
  inlineCode: {
    paddingLeft: '4px',
    paddingRight: '4px',
    marginLeft: '4px',
    marginRight: '4px',
    background: '#ddd',
    fontFamily: 'Courier, Osaka-Mono, monospace'
  },
  multilineCode: {
    background: '#eee'
  },
  italic: {
    fontStyle: 'italic'
  },
  bold: {
    fontWeight: 'bold'
  },
  strike: {
    textDecoration: 'line-through'
  },
  line: {
    whiteSpace: 'pre',
    lineHeight: '1.2em',
    minHeight: '1.2em'
  }
})

const CommentHighlight: React.FC<{ content: string }> = ({ content }) => {
  const classes = useStyles()
  const lines = mdparse(content)
  return <Typography component="div">
  {
    lines.map((line, lineIndex) => (<div key={lineIndex} className={classes.line}>{
      line.map((e, key) => {
        if (typeof e === 'string') {
          return <span key={key}>{e}</span>
        }
        const { text } = e
        if (e.type === 'code') {
          if (!e.multiline) return <span key={key} className={classes.inlineCode}>{text}</span>
          const html = highlightCode(e.lang || '', text)
          return <StyledCode key={key} className={classes.multilineCode} dangerouslySetInnerHTML={{ __html: html }} />
        }
        if (e.type === 'header') {
          switch (e.level) {
            case 1: return <h1 key={key}>{text}</h1>
            case 2: return <h2 key={key}>{text}</h2>
            case 3: return <h3 key={key}>{text}</h3>
            case 4: return <h4 key={key}>{text}</h4>
            case 5: return <h5 key={key}>{text}</h5>
            default: return <h6 key={key}>{text}</h6>
          }
        }
        if (e.type === 'styled') {
          const k = []
          if (e.italic) k.push(classes.italic)
          if (e.bold) k.push(classes.bold)
          if (e.strike) k.push(classes.strike)
          return <span key={key} className={k.join(' ')}>{text}</span>
        }
      })
    }</div>))
  }
  </Typography>
}

export default React.memo(CommentHighlight)
