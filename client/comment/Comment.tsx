import React, { useMemo, useState, useCallback, useContext, useRef, useEffect } from 'react'
import CommentHighlight from './CommentHighlight'
import styled from 'styled-components'
import UserIcon from '../components/UserIcon'
import { CurrentUserContext } from '../context'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { comment as commentApi } from '../api'
import { VoteUpSVG, VoteDownSVG, VoteForwardSVG, VoteRotateSVG, VoteSplatSVG } from '../lib/ikachan'
import { QuestionContext } from '../context'
import { UpdateCommentForm } from './CommentForm'
import {
  Paper, IconButton, Button, Menu, MenuItem,
  makeStyles
} from '@material-ui/core'
type VoteType = 'up' | 'down' | 'forward' | 'rotate'
type VoteSummary = { [key in VoteType]?: number | null }
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
      <div>{uid === 'ikachan' && 'いかちゃん'}</div>
    </CommentUserInfo>
    <CommentBody>
      { editing
        ? <UpdateCommentForm commentId={commentId} content={content} onEditUpdate={setTmpContent} onEditDone={handleEditDone} />
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
    <Vote commentId={commentId} myVote={myVote} voteSummary={voteSummary || {}} />
  </CommentWrapper>
}
function svgImgUrl(svg: string) {
  return `url('data:image/svg+xml,${svg.replace(/#/g, '%23')}')`
}
const useVoteStyles = makeStyles({
  icon: {
    width: '24px',
    height: '24px',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    position: 'relative',
    zIndex: 1
  },
  up: {
    backgroundImage: svgImgUrl(VoteUpSVG)
  },
  down: {
    backgroundImage: svgImgUrl(VoteDownSVG)
  },
  forward: {
    backgroundImage: svgImgUrl(VoteForwardSVG)
  },
  rotate: {
    backgroundImage: svgImgUrl(VoteRotateSVG)
  }
})
const Vote: React.FC<{ commentId: number; myVote?: VoteType | null; voteSummary: VoteSummary }> = ({ commentId, myVote, voteSummary }) => {
  const question = useContext(QuestionContext)
  const [tmpValue, setTmpValue] = useState<VoteValue | null | undefined>(undefined)
  const [showAll, setShowAll] = useState(false)
  const onChange = useCallback(async (v: VoteValue | null) => {
    if (tmpValue !== undefined) return
    setTmpValue(v)
    await commentApi.vote(commentId, v)
    await question.reload()
    setTmpValue(undefined)
  }, [tmpValue, setTmpValue, commentId])
  const currentVote = tmpValue !== undefined ? tmpValue : myVote
  const countOf = (v: VoteValue) => {
    const base = voteSummary[v] || 0
    if (tmpValue === undefined) return base
    return base + (tmpValue === v ? 1 : 0) - (myVote === v ? 1 : 0)
  }
  return <VoteWrapper>
    <VoteButton value='up' selected={currentVote === 'up'} onChange={onChange} />
    <VoteCount>{countOf('up')}</VoteCount>
    <VoteButton value='down' selected={currentVote === 'down'} onChange={onChange} />
    <VoteCount>{countOf('down')}</VoteCount>
    {(showAll || voteSummary.forward) && <>
      <VoteButton value='forward' selected={currentVote === 'forward'} onChange={onChange} />
      <VoteCount>{countOf('forward')}</VoteCount>
    </>}
    {(showAll || voteSummary.rotate) && <>
      <VoteButton value='rotate' selected={currentVote === 'rotate'} onChange={onChange} />
      <VoteCount>{countOf('rotate')}</VoteCount>
    </>}
    {
      (!showAll && (!voteSummary.forward || !voteSummary.rotate)) &&
      <IconButton onClick={() => setShowAll(true)}><AddIcon /></IconButton>
    }
  </VoteWrapper>
}
type VoteValue = 'up' | 'down' | 'forward' | 'rotate'
const VoteButton: React.FC<{ value: VoteValue; selected: boolean; onChange: (value: VoteValue | null) => void }> = ({
  value, selected, onChange
}) => {
  const classes = useVoteStyles()
  const onClick = useCallback(() => {
    onChange(selected ? null : value)
  }, [onChange, selected])
  return <IconButton onClick={onClick}>
    {selected && <Splat />}
    <div className={`${classes.icon} ${classes[value]}`} />
  </IconButton>
}
const Splat = styled.div`
  width: 24px;
  height: 24px;
  background-position: 50% 50%;
  background-size: cover;
  background-image: ${svgImgUrl(VoteSplatSVG)};
  transform: scale(2, 2);
  position: absolute;
  z-index: 0;
`

const VoteCount = styled.div`
  display: inline-block;
  padding-bottom: 4px;
  font-size: 16px;
  vertical-align: bottom;
  padding-right: 8px;
  min-width: 1.5em;
  color: gray;
`
const VoteWrapper = styled.div`
  padding-left: 4em;
`

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
  width: 60px;
  text-align: center;
  font-size: 10px;
`
const CommentBody = styled.div`
  padding-top: 4px;
  padding-left: 4em;
  padding-right: 3em;
  min-height: 80px;
`

export default Comment
