import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useFetchedState, question } from '../api'
import styled from 'styled-components'
import { Grid, Button, Typography } from '@material-ui/core'
import QuestionCard from './QuestionCard'
import { Header, PageBody } from '../components/Header'
import { LastQuestionListUrlContext, UnreadCountContext } from '../context'
import { RouteProps } from 'react-router'
import useRouter from 'use-react-router'

export const UnreadQuestionsView: React.FC<{ location: Exclude<RouteProps['location'], undefined> }> = ({ location }) => {
  const [, setURL] = useContext(LastQuestionListUrlContext)
  const { reload: reloadUnreads } = useContext(UnreadCountContext)
  useEffect(() => {
    setURL(location.pathname + location.search)
  }, [location.pathname, location.search])
  const [result, , reFetch] = useFetchedState({
    field: 'unreads',
    query: {
      question: ['id', 'uid', 'title', 'commentCount', 'resolved', 'mode', 'voteSummary', 'createdAt']
    }
  })
  const readAll = useCallback(async () => {
    await question.readAll()
    await reloadUnreads()
    reFetch()
  }, [reloadUnreads])

  if (!result) return <>
    <Header title="未読" current="unreads" />
    <PageBody>loading...</PageBody>
  </>
  if (result.length === 0) return <>
    <Header title="未読" current="unreads" />
    <PageBody><Typography>未読はありません</Typography></PageBody>
  </>

  return <div>
    <Header title="未読" current="unreads" />
    <PageBody>
      <ReadAllWrapper>
        <Button variant="outlined" onClick={readAll}>すべて既読にする</Button>
      </ReadAllWrapper>
      <Grid container spacing={2}>
        {result.map(({ question }) => {
          return <Grid key={question.id} item xs={12} sm={6} md={4} lg={3} >
            <QuestionCard {...question} />
          </Grid>
        })}
      </Grid>
    </PageBody>
  </div>
}

const ReadAllWrapper = styled.div`
  margin-bottom: 16px;
`
