import React, { useMemo, useEffect, useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { Code } from '../code/Code'
import { useFetchedState } from '../api'
import { NewCommentForm } from '../comment/CommentForm'
import Comment from '../comment/Comment'
import CommentHighlight from '../comment/CommentHighlight'
import { QuestionContext, CurrentUserContext, UnreadCountContext } from '../context'
import UserIcon from '../components/UserIcon'
import Vote from '../components/Vote'
import useRouter from 'use-react-router'
import { question as questionApi } from '../api'
import {
  IconButton, Menu, MenuItem, Typography
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Header, PageBody } from '../components/Header'

export const QuestionView: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const questionId = Number(match.params.id)
  const unread = useContext(UnreadCountContext)
  const currentUser = useContext(CurrentUserContext)
  const [question, complete, reload] = useFetchedState({
    field: 'question',
    params: { id: questionId },
    query: {
      '*': true,
      codes: {
        '*': true,
        threads: {
          '*': true,
          comments: { '*': true, myVote: '*' }
        }
      },
      myVote: '*',
      unreads: '*',
      questionComments: { '*': true, myVote: '*' }
    }
  })
  const qid = question && question.id
  const uid = question && question.uid
  useEffect(() => {
    if (!question) return
    if (!question.unreads.find(u => u.uid === currentUser)) return
    (async () => {
      await questionApi.read(question.id)
      unread.reload()
    })()
  }, [qid])
  const questionContextValue = useMemo(() => ({ id: qid || 0, uid: uid || '', reload }), [qid, uid, reload])
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const handleMenuOpen = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget)
  }
  const handleResolve = useCallback(async () => {
    setAnchorEl(null)
    if (!question) return
    await questionApi.resolve(question.id, !question.resolved)
    await reload()
  }, [question, setAnchorEl])
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])
  const { history } = useRouter()
  const handleDelete = useCallback(async () => {
    const confirmed = confirm('削除しますか?')
    setAnchorEl(null)
    if (!confirmed) return
    if (!question) return
    await questionApi.destroy(question.id)
    history.push('/questions/')
  }, [question])
  if (!question) {
    const message = complete ? '404 not found' : 'loading...'
    return <div>
      <Header back title={message} />
      <PageBody>{message}</PageBody>
    </div>
  }
  return <QuestionContext.Provider value={questionContextValue}>
    <Header back title={`${question.title.substr(0, 12) + '...'}`} />
    <PageBody>
      <QuestionInfo>
        <QuestionUserInfo>
          <UserIcon uid={question.uid} size={64} />
          <Typography variant="caption">{question.uid === 'ikachan' ? 'いかちゃん' : '投稿いか'}</Typography>
        </QuestionUserInfo>
        { currentUser === 'ikachan' &&
          <QuestionMenu>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
              <MenuItem onClick={handleResolve}>{
                question.resolved ? '未完了に戻す' : '完了にする'
              }</MenuItem>
              <MenuItem onClick={handleDelete}>削除</MenuItem>
            </Menu>
          </QuestionMenu>
        }
        <CommentDescription>
          {
            question.mode === 'terrible' &&
            <div><TerribleModeTag>理不尽なコメントをリクエスト</TerribleModeTag></div>
          }
          <CommentHighlight content={question.description || '説明: なし'} />
        </CommentDescription>
        <VoteWrapper>
          <Vote questionId={question.id} myVote={question.myVote && question.myVote.value} voteSummary={question.voteSummary} />
        </VoteWrapper>
      </QuestionInfo>
      <CommentGroup>
        {
          question.questionComments.map(c => <Comment key={c.id} commentId={c.id} {...c} myVote={c.myVote && c.myVote.value} voteSummary={c.voteSummary} />)
        }
        <NewCommentForm {...({} as any)} />
      </CommentGroup>
      {
        question.codes.map(({ id, fileName, threads, code }) => {
          return <Code key={id} codeId={id} fileName={fileName} code={code} threads={threads}/>
        })
      }
    </PageBody>
  </QuestionContext.Provider>
}

const TerribleModeTag = styled.span`
  background: red;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  padding: 2px 4px;
`

const QuestionMenu = styled.div`
position: absolute;
right: 4px;
top: 4px;
`

const QuestionUserInfo = styled.div`
  position: absolute;
  left: 8px;
  top: 8px;
  width: 64px;
  text-align: center;
  font-size: 10px;
`
const VoteWrapper = styled.div`
  padding-left: 80px;
`

const CommentDescription = styled.div`
  padding-left: 80px;
  padding-right: 48px;
  min-height: 80px;
  padding-top: 8px;
  padding-bottom: 8px;
`

const QuestionInfo = styled.div`
  border: 1px solid silver;
  border-radius: 4px;
  position: relative;
`

const CommentGroup = styled.div`
  margin-left: 1em;
  padding-left: 1em;
  border-left: 4px solid #ddd;
  padding-top: 1em;
  margin-bottom: 2em;
`
