import React, { useState, useEffect, useContext } from 'react'
import { useFetchedState } from '../api'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import { Grid, Button } from '@material-ui/core'
import QuestionCard from './QuestionCard'
import { Header, PageBody } from '../components/Header'
import { LastQuestionListUrlContext } from '../context'
import useRouter from 'use-react-router'

export const QuestionsView: React.FC = () => {
  const { location, history, ...a } = useRouter()
  const [, setURL] = useContext(LastQuestionListUrlContext)
  useEffect(() => {
    setURL(location.pathname + location.search)
  }, [location.pathname, location.search])
  return <QuestionsList mode="all" />
}

type Mode = 'all' | 'mine' | 'resolved' | 'unresolved'
const titles: Record<Mode, string> = {
  all: 'みんなのコード',
  mine: '自分のコード',
  resolved: 'いかちゃんが見たコード',
  unresolved: 'いかちゃんが見てないコード'
}
export const QuestionsList: React.FC<{ mode: Mode }> = ({ mode }) => {
  const limit = 48
  const [offset, setOffset] = useState(0)
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
    <Header title={titles[mode]} />
    <PageBody>
      <Grid container spacing={2} style={{ opacity: loading ? 0.2 : 1 }}>
        {questions.map(q => {
          return <Grid key={q.id} item xs={12} sm={6} md={4} lg={3} >
            <QuestionCard {...q} />
          </Grid>
        })}
      </Grid>
      <Pagination
        onChange={page => { setOffset((page - 1) * limit) }}
        currentPage={Math.ceil((offset + 1)/ limit)}
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
