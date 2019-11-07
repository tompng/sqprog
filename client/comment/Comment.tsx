import React, { useState, useCallback, useContext, useRef, useEffect } from 'react'
import CommentHighlight from './CommentHighlight'
import styled from 'styled-components'
import UserIcon from '../components/UserIcon'
import { CurrentUserContext } from '../context'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { comment as commentApi } from '../api'
import Vote, { VoteSample, VoteType, VoteSummary } from '../components/Vote'
import { QuestionContext } from '../context'
import { UpdateCommentForm } from './CommentForm'
import {
  IconButton, Menu, MenuItem, Typography,
} from '@material-ui/core'

type CommentProps = { commentId: number; uid: string; content: string, myVote?: VoteType | null, voteSummary?: VoteSummary }
const Comment: React.FC<CommentProps> = ({ commentId, uid, content, myVote, voteSummary }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [editing, setEditing] = useState(false)
  const [tmpContent, setTmpContent] = useState<string | null>(null)
  const currentUser = useContext(CurrentUserContext)
  const question = useContext(QuestionContext)
  const mountedRef = useRef(true)
  useEffect(() => () => { mountedRef.current = false }, [mountedRef])
  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget)
  }
  const handleEditDone = useCallback(() => {
    if (!mountedRef.current) return
    setEditing(false)
    setTmpContent(null)
  }, [mountedRef, setEditing, setTmpContent])
  const handleEditStart = useCallback(() => {
    setEditing(true)
    setAnchorEl(null)
  }, [setEditing, setAnchorEl])
  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])
  const handleDelete = useCallback(async () => {
    const confirmed = confirm('削除しますか?')
    setAnchorEl(null)
    if (!confirmed) return
    await commentApi.destroy(commentId)
    question.reload()
  }, [question, commentId])
  return <CommentWrapper>
    <CommentUserInfo>
      <UserIcon uid={uid} size={56} />
      <Typography variant="caption">
        {uid === 'ikachan' ? 'いかちゃん' : uid === question.uid ? '投稿いか' : null}
      </Typography>
    </CommentUserInfo>
    <CommentBody>
      { editing
        ? <UpdateCommentForm autoFocus commentId={commentId} content={content} onEditUpdate={setTmpContent} onEditDone={handleEditDone} />
        : <CommentHighlight content={tmpContent || content} />
      }
    </CommentBody>
    { !editing && (currentUser === 'ikachan' || currentUser === uid) &&
      <CommentMenu>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
          <MenuItem onClick={handleEditStart}><EditIcon />編集</MenuItem>
          <MenuItem onClick={handleDelete}><DeleteIcon />削除</MenuItem>
        </Menu>
      </CommentMenu>
    }
    <VoteWrapper>
      <Vote commentId={commentId} myVote={myVote} voteSummary={voteSummary || {}} />
    </VoteWrapper>
  </CommentWrapper>
}

export type CommentSampleProps = { uid: string; content: string; voteSummary: VoteSummary }
export const CommentSample: React.FC<CommentSampleProps> = ({ uid, content, voteSummary }) => {
  return <CommentWrapper>
    <CommentUserInfo>
      <UserIcon uid={uid} size={56} />
      <Typography variant="caption">
        {uid === 'ikachan' && 'いかちゃん'}
      </Typography>
    </CommentUserInfo>
    <CommentBody style={{ paddingRight: 4 }}>
      <CommentHighlight content={content} />
    </CommentBody>
    <VoteWrapper>
      <VoteSample voteSummary={voteSummary} />
    </VoteWrapper>
  </CommentWrapper>
}

const CommentMenu = styled.div`
position: absolute;
right: 4px;
top: 4px;
`

const CommentWrapper = styled.div`
  border-bottom: 1px solid silver;
  position: relative;
  min-height: 80px;
`
const CommentUserInfo = styled.div`
  position: absolute;
  left: 4px;
  top: 4px;
  width: 72px;
  text-align: left;
  text-align: center;
  font-size: 10px;
`
const CommentBody = styled.div`
  padding-top: 4px;
  padding-left: 72px;
  padding-right: 48px;
  min-height: 40px;
`
const VoteWrapper = styled.div`
  padding-left: 72px;
`

export default Comment
