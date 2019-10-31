import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Code } from '../code/Code'
import { useFetchedState } from '../api'

export const QuestionView: React.FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const questionId = Number(match.params.id)
  const [data] = useFetchedState({
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
  if (!data) return <div>loading...</div>
  return <div>
    <div>uid:{data.uid}</div>
    <div>desc:{data.description}</div>
    {
      data.codes.map(({ id, fileName, code }) => {
        return <Code key={id} fileName={fileName} code={code} />
      })
    }
  </div>
}
