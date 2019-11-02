import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Code } from '../code/Code'
import { useFetchedState } from '../api'
import { NewCommentForm, UpdateCommentForm } from '../comment/CommentForm'
import { QuestionIdContext } from '../context'
export const QuestionView: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const questionId = Number(match.params.id)
  const [question, setData] = useFetchedState({
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
      questionComments: { myVote: '*' }
    }
  })
  if (!question) return <div>loading...</div>
  return <QuestionIdContext.Provider value={question.id}>
    <div>uid:{question.uid}</div>
    <div>desc:{question.description}</div>
    {
      question.codes.map(({ id, fileName, threads, code }) => {
        return <Code key={id} codeId={id} fileName={fileName} code={code} threads={threads}/>
      })
    }
    <NewCommentForm {...({} as any)}/>
    <UpdateCommentForm {...({} as any)}/>
  </QuestionIdContext.Provider>
}
