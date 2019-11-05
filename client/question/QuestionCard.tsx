import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import UserIcon from '../components/UserIcon'
import { useVoteStyles } from '../components/Vote'
import { Card, CardActionArea } from '@material-ui/core'
import CommentIcon from '@material-ui/icons/Comment'
import useRouter from 'use-react-router'

const Link: React.FC<{ to: string }> = ({ to, children }) => {
  const { history } = useRouter()
  const onClick = useCallback(() => { history.push(to) }, [to])
  return <NonDecoratedA href={to} onClick={onClick}>
    {children}
  </NonDecoratedA>
}
const NonDecoratedA = styled.a`
  text-decoration: inherit;
  color: inherit;
`

const useStyles = makeStyles(() => ({
  paper: {
    position: 'relative',
    height: 140
  }
}))

type Props = {
  id: number
  uid: string
  title: string
  commentCount: number
  voteSummary: { [key in 'up' | 'down' | 'forward' | 'rotate']?: number | null }
}

const QuestionCard: React.FC<Props> = (q) => {
  const classes = useStyles()
  return <Link to={`/questions/${q.id}`}>
    <Card>
      <CardActionArea className={classes.paper}>
        <IconWrapper>
          <UserIcon uid={q.uid} size={32} />
        </IconWrapper>
        <TitleWrapper>
          {q.title}
        </TitleWrapper>
        <VoteSummary>
          <CommentIcon /><VoteCount>{q.commentCount}</VoteCount>
          <VoteItem type="up" count={q.voteSummary.up || 0} />
          <VoteItem type="down" count={q.voteSummary.down || 0} />
          {
            q.voteSummary.forward &&
            <VoteItem type="forward" count={q.voteSummary.forward} />
          }
          {
            q.voteSummary.rotate &&
            <VoteItem type="rotate" count={q.voteSummary.rotate} />
          }
        </VoteSummary>
      </CardActionArea>
    </Card>
  </Link>
}
export default React.memo(QuestionCard)

const IconWrapper = styled.div`
  position: absolute;
  left: 4px;
  top: 4px;
`

const TitleWrapper = styled.div`
  position: relative;
  padding-left: 40px;
  padding-top: 4px;
  padding-right: 4px;
  height: 72px;
  margin-bottom: 16px;
  overflow: hidden;
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 20px;
    left: 0;
    bottom: 0;
    background: linear-gradient(rgba(255,255,255,0), white);
  }
`

const VoteSummary = styled.div`
  padding-left: 4px;
`
const VoteItem: React.FC<{ type: 'up' | 'down' | 'forward' | 'rotate'; count: number }> = ({ type, count }) => {
  const voteClasses = useVoteStyles()
  return <>
    <VoteIcon className={voteClasses[type]} /><VoteCount>{count}</VoteCount>
  </>
}
const VoteCount = styled.span`
  font-size: 16px;
  color: gray;
  margin-left: 4px;
  margin-right: 8px;
`
const VoteIcon = styled.div`
  display: inline-block
  width: 24px;
  height: 24px;
  background-size: contain;
`
