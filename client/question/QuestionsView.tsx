import React, { useState, useEffect, useContext } from 'react'
import { useFetchedState } from '../api'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import { Grid, Button } from '@material-ui/core'
import QuestionCard from './QuestionCard'
import { Header, PageBody } from '../components/Header'
import { LastQuestionListUrlContext } from '../context'
import queryString from 'query-string'
import { RouteProps } from 'react-router'
import useRouter from 'use-react-router'

type Mode = 'all' | 'mine' | 'resolved' | 'unresolved'
const modes: Mode[] = ['all', 'mine', 'resolved', 'unresolved']

export const QuestionsView: React.FC<{ location: Exclude<RouteProps['location'], undefined> }> = ({ location }) => {
  if (!location) throw 'should not happen'
  const [, setURL] = useContext(LastQuestionListUrlContext)
  useEffect(() => {
    setURL(location.pathname + location.search)
  }, [location.pathname, location.search])
  const query = queryString.parse(location.search)
  const queryMode = String(query['mode'])
  const mode: Mode = modes.find(m => m === queryMode) || 'all'
  const queryPage = Number(query['page'] || '1')
  return <QuestionsList mode={mode} page={queryPage}/>
}

const titles: Record<Mode, string> = {
  all: 'みんなのコード',
  mine: '自分のコード',
  resolved: 'いかちゃんが見たコード',
  unresolved: 'いかちゃんが見てないコード'
}
function questionsUrl(mode: Mode, page: number) {
  const q: string[] = []
  if (mode !== 'all') q.push('mode=' + mode)
  if (page !== 1) q.push('page=' + page)
  const base = '/questions/'
  if (q.length === 0) return base
  return `${base}?${q.join('&')}`
}
export const QuestionsList: React.FC<{ mode: Mode; page: number }> = ({ mode, page }) => {
  const limit = 48
  const offset = (page - 1) * limit
  const { history } = useRouter()
  const [result] = useFetchedState({
    field: 'questions',
    params: { mode, limit, offset },
    query: {
      total: true,
      limit: true,
      offset: true,
      collection: ['id', 'uid', 'title', 'commentCount', 'resolved', 'mode', 'voteSummary', 'createdAt']
    }
  })
  if (!result) return <div>
    <Header title={titles[mode]} />
    <PageBody>loading...</PageBody>
  </div>
  const loading = result.offset !== offset
  const { total, collection: questions } = result
  return <div>
    <Header title={titles[mode]} current={mode === 'all' ? 'all_questions' : mode === 'mine' ? 'my_questions' : undefined} />
    <PageBody>
      <Grid container spacing={2} style={{ opacity: loading ? 0.2 : 1 }}>
        {questions.map(q => {
          return <Grid key={q.id} item xs={12} sm={6} md={4} lg={3} >
            <QuestionCard {...q} />
          </Grid>
        })}
      </Grid>
      <Pagination
        onChange={page => { history.push(questionsUrl(mode, page))}}
        currentPage={page}
        totalPages={Math.ceil(total / limit)} />
    </PageBody>
  </div>
}

const Pagination: React.FC<{ onChange: (p: number) => void; currentPage: number; totalPages: number }> = ({ onChange, currentPage, totalPages }) => {
  if (totalPages <= 1) return <div></div>
  const maxNums = 9
  const pages = [currentPage]
  for (let i = 1; i < maxNums; i++) {
    if (pages.length >= totalPages) break
    if (0 < currentPage - i) pages.unshift(currentPage - i)
    if (currentPage + i <= totalPages) pages.push(currentPage + i)
  }
  return <PaginationWrapper>
    {pages.map(p => {
      return <Button key={p} color={p === currentPage ? 'primary' : undefined} onClick={() => onChange(p)}>{p}</Button>
    })}
  </PaginationWrapper>
}

const PaginationWrapper = styled.div`
  margin-top: 20px;
  text-align: center;
`
