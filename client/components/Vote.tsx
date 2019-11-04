import React, { useMemo, useState, useCallback, useContext, useRef, useEffect } from 'react'
import styled from 'styled-components'
import AddIcon from '@material-ui/icons/Add'
import { comment as commentApi, question as questionApi } from '../api'
import { VoteUpSVG, VoteDownSVG, VoteForwardSVG, VoteRotateSVG, VoteSplatSVG } from '../lib/ikachan'
import { QuestionContext } from '../context'
import {
  IconButton,
  makeStyles
} from '@material-ui/core'

export type VoteType = 'up' | 'down' | 'forward' | 'rotate'
export type VoteSummary = { [key in VoteType]?: number | null }

function svgImgUrl(svg: string) {
  return `url('data:image/svg+xml,${svg.replace(/#/g, '%23')}')`
}
const useVoteStyles = makeStyles({
  icon: {
    width: '24px',
    height: '24px',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    position: 'relative',
    zIndex: 1
  },
  up: {
    backgroundImage: svgImgUrl(VoteUpSVG)
  },
  down: {
    backgroundImage: svgImgUrl(VoteDownSVG)
  },
  forward: {
    backgroundImage: svgImgUrl(VoteForwardSVG)
  },
  rotate: {
    backgroundImage: svgImgUrl(VoteRotateSVG)
  }
})
const Vote: React.FC<{ commentId?: number; questionId?: number; myVote?: VoteType | null; voteSummary: VoteSummary }> = ({ questionId, commentId, myVote, voteSummary }) => {
  const question = useContext(QuestionContext)
  const [tmpValue, setTmpValue] = useState<VoteValue | null | undefined>(undefined)
  const [showAll, setShowAll] = useState(false)
  const onChange = useCallback(async (v: VoteValue | null) => {
    if (tmpValue !== undefined) return
    setTmpValue(v)
    if (commentId) {
      await commentApi.vote(commentId, v)
    } else if(questionId) {
      await questionApi.vote(questionId, v)
    }
    await question.reload()
    setTmpValue(undefined)
  }, [tmpValue, setTmpValue, commentId, questionId])
  const currentVote = tmpValue !== undefined ? tmpValue : myVote
  const countOf = (v: VoteValue) => {
    const base = voteSummary[v] || 0
    if (tmpValue === undefined) return base
    return base + (tmpValue === v ? 1 : 0) - (myVote === v ? 1 : 0)
  }
  return <>
    <VoteButton value='up' selected={currentVote === 'up'} onChange={onChange} />
    <VoteCount>{countOf('up')}</VoteCount>
    <VoteButton value='down' selected={currentVote === 'down'} onChange={onChange} />
    <VoteCount>{countOf('down')}</VoteCount>
    {(showAll || voteSummary.forward) && <>
      <VoteButton value='forward' selected={currentVote === 'forward'} onChange={onChange} />
      <VoteCount>{countOf('forward')}</VoteCount>
    </>}
    {(showAll || voteSummary.rotate) && <>
      <VoteButton value='rotate' selected={currentVote === 'rotate'} onChange={onChange} />
      <VoteCount>{countOf('rotate')}</VoteCount>
    </>}
    {
      (!showAll && (!voteSummary.forward || !voteSummary.rotate)) &&
      <IconButton onClick={() => setShowAll(true)}><AddIcon /></IconButton>
    }
  </>
}
export default React.memo(Vote)

type VoteValue = 'up' | 'down' | 'forward' | 'rotate'
const VoteButton: React.FC<{ value: VoteValue; selected: boolean; onChange: (value: VoteValue | null) => void }> = ({
  value, selected, onChange
}) => {
  const classes = useVoteStyles()
  const onClick = useCallback(() => {
    onChange(selected ? null : value)
  }, [onChange, selected])
  return <IconButton onClick={onClick}>
    {selected && <Splat />}
    <div className={`${classes.icon} ${classes[value]}`} />
  </IconButton>
}
const Splat = styled.div`
  width: 24px;
  height: 24px;
  background-position: 50% 50%;
  background-size: cover;
  background-image: ${svgImgUrl(VoteSplatSVG)};
  transform: scale(2, 2);
  position: absolute;
  z-index: 0;
`

const VoteCount = styled.div`
  display: inline-block;
  padding-bottom: 4px;
  font-size: 16px;
  vertical-align: bottom;
  padding-right: 8px;
  min-width: 1.5em;
  color: gray;
`
