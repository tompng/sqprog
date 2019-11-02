import React, { useMemo, useState, useCallback } from 'react'
import CommentHighlight from './CommentHighlight'
import styled from 'styled-components'
import {
  FormControl, Input, InputLabel, TextField,
  Paper, IconButton, Button,
  makeStyles
} from '@material-ui/core'

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
      />
    </FormControl>
  )
}

const CommentForm: React.FC<{ mode: 'create' | 'update'; submit: (content: string) => void; cancel: () => void }> = ({ mode, submit, cancel }) => {
  const [sending] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(false)
  const handleSubmit = useCallback(() => submit(content), [submit, content])
  const togglePreview = useCallback(() => setPreview(p => !p), [])
  const endPreview = useCallback(() => setPreview(false), [])
  return <>
    {
      preview
      ? <PreviewWrapper onClick={endPreview}><CommentHighlight content={content} /></PreviewWrapper>
      : <CommentField disabled={sending} content={content} onChange={setContent} />
    }
    <Button onClick={togglePreview} disabled={!content}>{preview ? '編集に戻る' : 'プレビュー'}</Button>
    <Button onClick={cancel}>キャンセル</Button>
    { mode === 'create' && <Button onClick={handleSubmit} color="primary">送信</Button>}
    { mode === 'update' && <Button onClick={handleSubmit} color={content ? 'primary' : 'secondary'}>{content ? '保存' : '削除'}</Button>}
  </>
}

const PreviewWrapper = styled.div`
  min-height: 4em;
  cursor: pointer;
`
export const NewCommentForm: React.FC<{ submit: (content: string) => void, cancel: () => void }> = ({ submit, cancel }) => (
  <CommentForm mode='create' submit={submit} cancel={cancel} />
)


export const UpdateCommentForm: React.FC<{ submit: (content: string) => void, cancel: () => void }> = ({ submit, cancel }) => (
  <CommentForm mode='update' submit={submit} cancel={cancel} />
)
