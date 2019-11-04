import React, { useState, useCallback } from 'react'
import { question } from '../api'
import { CodeForm } from '../code/CodeForm'
import styled from 'styled-components'
import { compact } from 'lodash'
import { FormControl, TextField, Button, MenuItem, Select } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import useRouter from 'use-react-router'
import { RightUpSVG, svgImgUrl } from '../lib/ikachan'
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
    [setDescription]
  )
  const onModeChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => setMode(e.target.value as Mode), [setMode])
  const [codes, setCodes] = useState<CodeWithId[]>(() => [...Array(2)].map(() => newCode()))
  const onCodeChange = useCallback((id: number | string, codeObject: Code | null) => {
    setCodes(codes => compact(codes.map(code => code.id === id ? codeObject && { id, ...codeObject } : code)))
  }, [setCodes])
  const addCode = useCallback(() => {
    setCodes(codes => [...codes, newCode()])
  }, [setCodes])
  const send = useCallback(async () => {
    try {
      setSending(true)
      const { id } = await question.create({ mode, description, codes })
      history.push(`/questions/${id}`)
    } catch {
      setSending(false)
      alert('error')
    }
  }, [mode, description, codes])
  return <>
    <NewQuestionHeader>
      <div>いかちゃんにコードを送りつけよう</div>
      <Select value={mode} onChange={onModeChange}>
        <MenuItem value="normal">通常モードで見てもらう</MenuItem>
        <MenuItem value="terrible">理不尽モードで見てもらう</MenuItem>
      </Select>
    </NewQuestionHeader>
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
      <Button onClick={addCode} disabled={sending}>
        <AddIcon />ファイルを追加
      </Button>
    </FormWrapper>
    <SendButtonWrapper>
      <Button fullWidth disabled={sending} onClick={send}>
        <SendButtonInner>送信</SendButtonInner>
      </Button>
    </SendButtonWrapper>
  </>
}
const NewQuestionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const SendButtonWrapper = styled.div`
  margin-top: 40px;
  margin-bottom: 40px;
`
const SendButtonInner = styled.div`
  font-size: 80px;
  height: 128px;
  line-height: 128px;
  padding-left: 128px;
  font-weight: bold;
  color: #8f8;
  background-image: ${svgImgUrl(RightUpSVG)};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 0% 50%;
`
