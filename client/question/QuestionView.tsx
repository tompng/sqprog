import React, { useMemo } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { Code } from '../code/Code'
import { useFetchedState } from '../api'
import { NewCommentForm } from '../comment/CommentForm'
import Comment from '../comment/Comment'
import { QuestionContext } from '../context'
import UserIcon from '../components/UserIcon'
import Vote from '../components/Vote'

export const QuestionView: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const questionId = Number(match.params.id)
  const [question, , reload] = useFetchedState({
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
  const questionContextValue = useMemo(() => ({ id: qid || 0, uid: uid || '', reload }), [qid, uid, reload])
  if (!question) return <div>loading...</div>
  return <QuestionContext.Provider value={questionContextValue}>
    <QuestionInfo>
      <QuestionUserInfo>
        <UserIcon uid={question.uid} size={64} />
        <div>{question.uid === 'ikachan' ? 'いかちゃん' : '投稿いか'}</div>
      </QuestionUserInfo>
      <CommentDescription>{question.description || '説明: なし'}</CommentDescription>
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
  </QuestionContext.Provider>
}

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
