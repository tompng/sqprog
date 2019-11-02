import React, { useMemo, useState, useCallback } from 'react'
import CommentHighlight from './CommentHighlight'
import styled from 'styled-components'
import {
  Paper, IconButton, Button,
  makeStyles
} from '@material-ui/core'

const Comment: React.FC<{ uid: string; content: string }> = ({ uid, content }) => {
  return <CommentWrapper>
    <CommentHighlight content={content} />
  </CommentWrapper>
}

const CommentWrapper = styled.div`
  border-bottom: 1px solid silver;
`

export default Comment
