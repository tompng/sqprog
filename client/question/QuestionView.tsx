import React, { useMemo } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Code } from '../code/Code'
import { useFetchedState } from '../api'
import { NewCommentForm } from '../comment/CommentForm'
import Comment from '../comment/Comment'
import { QuestionContext } from '../context'
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
      unreads: '*',
      questionComments: { '*': true, myVote: '*' }
    }
  })
  const qid = question && question.id
  const questionContextValue = useMemo(() => ({ id: qid || 0, reload }), [qid, reload])
  if (!question) return <div>loading...</div>
  return <QuestionContext.Provider value={questionContextValue}>
    <div>uid:{question.uid}</div>
    <div>desc:{question.description}</div>
    {
      question.codes.map(({ id, fileName, threads, code }) => {
        return <Code key={id} codeId={id} fileName={fileName} code={code} threads={threads}/>
      })
    }
    <hr/>
    {
      question.questionComments.map(c => <Comment key={c.id} {...c} />)
    }
    <NewCommentForm {...({} as any)}/>
  </QuestionContext.Provider>
}
