import React, { useState, useCallback } from 'react'
import { question } from '../api'
import { CodeForm, CodeAddButton } from './CodeForm'
import styled from 'styled-components'
import { compact } from 'lodash'
import { FormControl, TextField, Button } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import SendIcon from '@material-ui/icons/Send'
import useRouter from 'use-react-router'

type Code = {
  code: string
  fileName: string
}
interface CodeWithId extends Code {
  id: number | string
}
function newCode(): CodeWithId {
  return { id: Math.random(), code: '', fileName: '' }
}
const FormWrapper = styled.div`
  margin-bottom: 8px;
`
type Mode = 'normal' | 'terrible'
export const NewQuestionForm: React.FC = () => {
  const [description, setDescription] = useState('')
  const [mode, setMode] = useState<Mode>('normal')
  const [sending, setSending] = useState(false)
  const { history } = useRouter()
  const onDescChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
    []
  )
  const onModeChange = useCallback((_, v: Mode) => setMode(v), [])
  const [codes, setCodes] = useState<CodeWithId[]>(() => [...Array(2)].map(() => newCode()))
  const onCodeChange = useCallback((id: number | string, codeObject: Code | null) => {
    setCodes(codes => compact(codes.map(code => code.id === id ? codeObject && { id, ...codeObject } : code)))
  }, [])
  const addCode = useCallback(() => {
    setCodes(codes => [...codes, newCode()])
  }, [])
  const send = useCallback(async () => {
    try {
      setSending(true)
      const { id } = await question.create({ mode, description, codes })
      history.push(`questions/${id}`)
    } catch {
      setSending(false)
      alert('error')
    }
  }, [mode, description, codes])
  return <>
    <div>
      いかちゃんにコードを送りつけよう
      <ToggleButtonGroup
        value={mode}
        onChange={onModeChange}
        exclusive>
        <ToggleButton value="normal" color="primary" disabled={sending}>通常モード</ToggleButton>
        <ToggleButton value="terrible" color="secondary" disabled={sending}>理不尽モード</ToggleButton>
      </ToggleButtonGroup>
      <Button disabled={sending} onClick={send}><SendIcon /></Button>
    </div>
    <FormWrapper>
      <FormControl fullWidth>
        <TextField
        placeholder="説明..."
        multiline
        inputProps={{ spellCheck: false }}
        variant="standard"
        value={description}
        disabled={sending}
        onChange={onDescChange}
        />
      </FormControl>
    </FormWrapper>
    {
      codes.map(({ id, fileName, code }) => (
        <FormWrapper key={id}>
          <CodeForm id={id} fileName={fileName} code={code} onChange={onCodeChange} disabled={sending} />
        </FormWrapper>
      ))
    }
    <FormWrapper>
      <CodeAddButton onClick={addCode} disabled={sending} />
    </FormWrapper>
  </>
}
