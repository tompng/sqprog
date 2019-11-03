import React, { useMemo, useState, useCallback, useContext } from 'react'
import CommentHighlight from './CommentHighlight'
import styled from 'styled-components'
import UserIcon from '../components/UserIcon'
import { CurrentUserContext } from '../context'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import {
  Paper, IconButton, Button, Menu, MenuItem,
  makeStyles
} from '@material-ui/core'

const Comment: React.FC<{ uid: string; content: string }> = ({ uid, content }) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null)
  const open = Boolean(anchorEl)
  const currentUser = useContext(CurrentUserContext)
  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
      setAnchorEl(null);
    }
  return <CommentWrapper>
    <CommentUserInfo>
      <UserIcon uid={uid} size={56} />
      <div>{uid === 'ikachan' && 'いかちゃん'}</div>
    </CommentUserInfo>
    <CommentBody>
      <CommentHighlight content={content} />
    </CommentBody>
    { (currentUser === 'ikachan' || currentUser === uid) &&
      <CommentMenu>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={!!anchorEl}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}><EditIcon /></MenuItem>
          <MenuItem onClick={handleClose}><DeleteIcon /></MenuItem>
        </Menu>
      </CommentMenu>
    }
  </CommentWrapper>
}

const CommentMenu = styled.div`
position: absolute;
right: 4px;
top: 4px;
`

const CommentWrapper = styled.div`
  border-bottom: 1px solid silver;
  display:flex;
  flex-wrap: wrap;
  position: relative;
  min-height: 80px;
`
const CommentUserInfo = styled.div`
  position: absolute;
  left: 4px;
  top: 4px;
  width: 60px;
  text-align: center;
  font-size: 10px;
`
const CommentBody = styled.div`
  padding-top: 4px;
  padding-left: 4em;
  padding-right: 3em;
`

export default Comment
