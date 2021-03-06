import React, { useState, useCallback, useContext, useRef, useEffect } from 'react'
import CommentHighlight from './CommentHighlight'
import styled from 'styled-components'
import {
  FormControl, TextField, Button
} from '@material-ui/core'
import { comment as commentApi } from '../api'
import { QuestionContext, CodeIdContext, LineNumberContext } from '../context'

const CommentField: React.FC<{ content: string; autoFocus?: boolean; disabled?: boolean; onChange: (c: string) => void }> = ({ content, disabled, autoFocus, onChange }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])
  return (
    <FormControl fullWidth>
      <TextField
        placeholder="コメント..."
        multiline
        rows={4}
        inputProps={{ spellCheck: false, style: { padding: '0 4px' } }}
        variant="standard"
        value={content}
        disabled={disabled}
        onChange={handleChange}
        autoFocus={autoFocus} />
    </FormControl>
  )
}

const CommentForm: React.FC<{ mode: 'create' | 'update'; autoFocus?: boolean; initialContent?: string; submit: (content: string) => Promise<boolean>; cancel?: () => void }> = ({ initialContent, mode, submit, cancel, autoFocus }) => {
  const [content, setContent] = useState(initialContent || '')
  const [preview, setPreview] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const mountedRef = useRef(true)
  useEffect(() => () => { mountedRef.current = false }, [mountedRef])
  const handleSubmit = useCallback(async () => {
    setDisabled(true)
    const status = await submit(content)
    if (!mountedRef.current) return
    setDisabled(false)
    if (status) {
      setContent('')
      setPreview(false)
    }
  }, [submit, content, setContent, setDisabled, setPreview])
  const handleCancel = useCallback(() => {
    if (!cancel) return
    if (content && content !== initialContent) {
      if (confirm('入力中のようです。編集を続けますか？')) return
    }
    cancel()
  }, [cancel, content, initialContent])
  const togglePreview = useCallback(() => setPreview(p => !p), [setPreview])
  return <>
    {
      preview
      ? <PreviewWrapper onClick={togglePreview}><CommentHighlight content={content} /></PreviewWrapper>
      : <CommentField disabled={disabled} autoFocus={autoFocus} content={content} onChange={setContent} />
    }
    <Button onClick={togglePreview} disabled={!content}>{preview ? '編集に戻る' : 'プレビュー'}</Button>
    { cancel && <Button disabled={disabled} onClick={handleCancel}>キャンセル</Button> }
    { mode === 'create' && <Button disabled={disabled || !content} onClick={handleSubmit} color="primary">送信</Button>}
    { mode === 'update' && <Button disabled={disabled} onClick={handleSubmit} color={content ? 'primary' : 'secondary'}>{content ? '保存' : '削除'}</Button>}
  </>
}

const PreviewWrapper = styled.div`
  min-height: 4em;
  cursor: pointer;
`
export const NewCommentForm: React.FC<{ autoFocus?: boolean; cancel: () => void }> = ({ autoFocus, cancel }) => {
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
  return <CommentForm mode='create' autoFocus={autoFocus} submit={submit} cancel={cancel}/>
}


export const UpdateCommentForm: React.FC<{ autoFocus?: boolean; content: string; commentId: number; onEditUpdate: (v: string) => void; onEditDone: () => void }> = ({ autoFocus, commentId, content, onEditUpdate, onEditDone }) => {
  const question = useContext(QuestionContext)
  const submit = useCallback(async (content: string) => {
    try {
      onEditUpdate(content)
      if (content) {
        await commentApi.update(commentId, content)
      } else {
        await commentApi.destroy(commentId)
      }
    } catch {
      return false
    }
    try {
      await question.reload()
      onEditDone()
    } catch { }
    return true
  }, [onEditDone, commentId])
  return <CommentForm mode='update' autoFocus={autoFocus} initialContent={content} submit={submit} cancel={onEditDone} />
}
