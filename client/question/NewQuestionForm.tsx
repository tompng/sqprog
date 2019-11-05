import React, { useState, useCallback } from 'react'
import { question } from '../api'
import { CodeForm } from '../code/CodeForm'
import styled from 'styled-components'
import { compact } from 'lodash'
import { FormControl, TextField, Button, MenuItem, Select } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import useRouter from 'use-react-router'
import { RightUpSVG, svgImgUrl } from '../lib/ikachan'
import CommentHighlight from '../comment/CommentHighlight'

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
const DescriptionWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 24px;
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
  const [preview, setPreview] = useState(false)
  const togglePreview = useCallback(() => setPreview(p => !p), [setPreview])
  return <>
    <NewQuestionHeader>
      <div>いかちゃんにコードを送りつけよう</div>
      <Select value={mode} onChange={onModeChange}>
        <MenuItem value="normal">通常モードで見てもらう</MenuItem>
        <MenuItem value="terrible">理不尽モードで見てもらう</MenuItem>
      </Select>
    </NewQuestionHeader>
    <DescriptionWrapper>
      説明文 <Button size="small" color="primary" onClick={togglePreview}>{preview ? '編集に戻る' : 'プレビュー'}</Button>
      { !preview &&
        <FormControl fullWidth>
          <TextField
          placeholder="..."
          multiline
          inputProps={{ spellCheck: false }}
          variant="standard"
          value={description}
          disabled={sending}
          onChange={onDescChange}
          autoFocus
          />
        </FormControl>
      }
      { preview &&
        <PreviewWrapper onClick={togglePreview}>
          <CommentHighlight content={description}/>
        </PreviewWrapper>
      }
    </DescriptionWrapper>
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
      <Button variant="outlined" color="default" disabled={sending} onClick={send}>
        <SendButtonInner>送信</SendButtonInner>
      </Button>
    </SendButtonWrapper>
  </>
}
const PreviewWrapper = styled.div`
  border-bottom: 1px solid gray;
  cursor: pointer;
  min-height: 2em;
`

const NewQuestionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const SendButtonWrapper = styled.div`
  margin-top: 64px;
  margin-bottom: 40px;
  text-align: center;
`
const SendButtonInner = styled.div`
  font-size: 64px;
  line-height: 96px;
  padding-left: 96px;
  font-weight: bold;
  color: #8f8;
  background-image: ${svgImgUrl(RightUpSVG)};
  background-size: 96px 96px;
  background-repeat: no-repeat;
  background-position: 0% 50%;
`
