import React from 'react'
import { useFetchedState } from '../api'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import { Grid  } from '@material-ui/core'
import QuestionCard from './QuestionCard'

type Mode = 'all' | 'mine' | 'resolved' | 'unresolved'
export const QuestionsView: React.FC = () => {
  const mode: Mode = 'all'
  const limit = 10
  const offset = 0
  const [questions, , reload] = useFetchedState({
    field: 'questions',
    params: { mode, limit, offset },
    query: ['id', 'uid', 'title', 'commentCount', 'resolved', 'mode', 'voteSummary', 'createdAt']
  })
  if (!questions) return <div>loading...</div>
  return <div>
    一覧ページになります
    <Grid container spacing={2}>
      {questions.map(q => {
        return <Grid key={q.id} item xs={12} sm={6} md={4} lg={3} >
          <QuestionCard {...q} />
        </Grid>
      })}
    </Grid>
  </div>
}
