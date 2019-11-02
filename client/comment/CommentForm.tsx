import React, { useMemo, useState, useCallback, useContext } from 'react'
import CommentHighlight from './CommentHighlight'
import styled from 'styled-components'
import {
  FormControl, Input, InputLabel, TextField,
  Paper, IconButton, Button,
  makeStyles
} from '@material-ui/core'
import { comment as commentApi } from '../api'
import { QuestionContext, CodeIdContext, LineNumberContext } from '../context'

const CommentField: React.FC<{ content: string; disabled?: boolean; onChange: (c: string) => void }> = ({ content, disabled, onChange }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])
  return (
    <FormControl fullWidth>
      <TextField
      placeholder="コメント..."
      multiline
      rows={4}
      inputProps={{ spellCheck: false }}
      variant="standard"
      value={content}
      disabled={disabled}
      onChange={handleChange}
      autoFocus
      />
    </FormControl>
  )
}

const CommentForm: React.FC<{ mode: 'create' | 'update'; initialContent?: string; submit: (content: string) => Promise<boolean>; cancel: () => void }> = ({ initialContent, mode, submit, cancel }) => {
  const [content, setContent] = useState(initialContent || '')
  const [preview, setPreview] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const handleSubmit = useCallback(async () => {
    setDisabled(true)
    const status = await submit(content)
    setDisabled(false)
    if (status) {
      setContent('')
      setPreview(false)
    }
  }, [submit, content, setContent, setDisabled, setPreview])
  const togglePreview = useCallback(() => setPreview(p => !p), [])
  const endPreview = useCallback(() => setPreview(false), [])
  return <>
    {
      preview
      ? <PreviewWrapper onClick={endPreview}><CommentHighlight content={content} /></PreviewWrapper>
      : <CommentField disabled={disabled} content={content} onChange={setContent} />
    }
    <Button onClick={togglePreview} disabled={!content}>{preview ? '編集に戻る' : 'プレビュー'}</Button>
    <Button disabled={disabled} onClick={cancel}>キャンセル</Button>
    { mode === 'create' && <Button disabled={disabled} onClick={handleSubmit} color="primary">送信</Button>}
    { mode === 'update' && <Button disabled={disabled} onClick={handleSubmit} color={content ? 'primary' : 'secondary'}>{content ? '保存' : '削除'}</Button>}
  </>
}

const PreviewWrapper = styled.div`
  min-height: 4em;
  cursor: pointer;
`
export const NewCommentForm: React.FC<{ cancel: () => void }> = ({ cancel }) => {
  const question = useContext(QuestionContext)
  const codeId = useContext(CodeIdContext)
  const lineNumber = useContext(LineNumberContext)
  const submit = useCallback(async (content: string) => {
    try {
      const pos = codeId && lineNumber ? { codeId, lineNumber } : undefined
      await commentApi.create(question.id, content, pos)
    } catch {
      return false
    }
    try {
      await question.reload()
    } catch { }
    return true
  }, [question, codeId, lineNumber])
  return <CommentForm mode='create' submit={submit} cancel={cancel}/>
}


export const UpdateCommentForm: React.FC<{cancel: () => void }> = ({ cancel }) => (
  <CommentForm mode='update' submit={} cancel={cancel} />
)
