import React, { useMemo, useCallback } from 'react'
import {
  FormControl, Input, InputLabel, TextField,
  Paper, IconButton, Button,
  makeStyles
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
function useInputID() { return useMemo(() => String(Math.random()), []) }

const fileTypes: Record<string, string> = {
  css: 'CSS',
  html: 'HTML',
  rb: 'Ruby',
  js: 'JavaScript',
  jsx: 'JavaScript(JSX)',
  ts: 'TypeScript',
  tsx: 'TypeScript(JSX)',
  c: 'C',
  h: 'C',
  cc: 'C++',
  cpp: 'C++',
  go: 'Go',
  java: 'Java',
  php: 'PHP',
  py: 'Python',
  pl: 'Perl'
}

const useStyles = makeStyles(theme => ({
  codeTextField: {
    minHeight: '4em',
    maxHeight: '20em',
    fontFamily: 'Courier, Osaka-Mono, monospace'
  },
  paper: {
    padding: theme.spacing(1)
  }
}))

type CodeFieldProps = {
  fileName: string
  id: number | string
  code: string
  disabled?: boolean
  onChange: (id: number | string, state: { fileName: string; code: string } | null) => void
}

export const CodeForm: React.FC<CodeFieldProps> = ({ id, fileName, code, onChange, disabled }) => {
  const inputid = useInputID()
  const classes = useStyles()
  const onFileNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(id, { fileName: e.target.value, code })
  }, [id, code])
  const onCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(id, { fileName, code: e.target.value })
  }, [id, fileName])
  const labelWithFileType = useMemo(() => {
    const match = fileName.match(/\.([^.]+)/)
    const type = match && (fileTypes[match[1]] || 'unknown')
    return `ファイル名${type ? `(${type})` : ''}`
  }, [fileName])
  const onClose = useCallback(() => onChange(id, null), [])
  return (<Paper className={classes.paper}>
    <div style={{ display: 'flex' }}>
      <FormControl fullWidth>
        <InputLabel htmlFor={inputid}>{labelWithFileType}</InputLabel>
        <Input id={inputid} value={fileName} disabled={disabled} onChange={onFileNameChange} />
      </FormControl>
      <IconButton onClick={onClose}><CloseIcon /></IconButton>
    </div>
    <FormControl fullWidth>
      <TextField
      placeholder="code..."
      multiline
      inputProps={{ spellCheck: false, className: classes.codeTextField }}
      variant="standard"
      value={code}
      disabled={disabled}
      onChange={onCodeChange}
      />
    </FormControl>
  </Paper>)
}

export const CodeAddButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
  <Paper>
    <Button fullWidth onClick={onClick} disabled={disabled}>
      <AddIcon />
    </Button>
  </Paper>
)
