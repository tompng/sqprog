import React, { useMemo, useState, useCallback, useContext, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {
  AppBar, Toolbar, IconButton, Typography, Button, Badge,
  Drawer, Divider, List, ListItem, ListItemIcon, ListItemText,
  Dialog,
  makeStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import AlertIcon from '@material-ui/icons/Notifications'
import SendIcon from '@material-ui/icons/Send'
import SubjectIcon from '@material-ui/icons/Subject'
import WidgetsIcon from '@material-ui/icons/Widgets'
import BackIcon from '@material-ui/icons/NavigateBefore'
import UserIcon, { useIconSVG } from './UserIcon'
import { CurrentUserContext } from '../context'

import { LastQuestionListUrlContext } from '../context'
import useRouter from 'use-react-router'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

type HeaderProps = {
  title?: string
  back?: boolean
  current?: 'new_question' | 'all_questions' | 'my_questions'
}
export const Header: React.FC<HeaderProps> = ({ title, back, current }) => {
  const classes = useStyles()
  const { history } = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [backUrl] = useContext(LastQuestionListUrlContext)
  const closeDrawer = useCallback(() => setDrawerOpen(false), [setDrawerOpen])
  const uid = useContext(CurrentUserContext)
  const [userIconDialogOpen, setUserIconDialogOpen] = useState(false)
  const closeUserIconDialog = useCallback(() => setUserIconDialogOpen(false), [setUserIconDialogOpen])
  const openUserIconDialog = useCallback(() => setUserIconDialogOpen(true), [setUserIconDialogOpen])
  return <div className={classes.root}>
    <AppBar position="fixed">
      <Toolbar>
        { back
          ? <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={() => {
              backUrl ? history.goBack() : history.push('/questions')
            }}>
            <BackIcon />
          </IconButton>
          : <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        }
        <Typography variant="h6" className={classes.title}>
          {title || ''}
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <AlertIcon />
         </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <ListItem button onClick={openUserIconDialog}>
        <div>
          <UserIcon size={64} uid={uid} />
          <Typography variant="caption" >あなたのアイコンです</Typography>
        </div>
      </ListItem>
      <Divider />
      <List>
        <ListLinkItem selected={current === 'new_question'} url="/questions/new" afterClick={closeDrawer}>
          <ListItemIcon><SendIcon /></ListItemIcon>
          <ListItemText primary="コードを送る" />
        </ListLinkItem>
        <ListLinkItem selected={current === 'all_questions'} url="/questions/" afterClick={closeDrawer}>
          <ListItemIcon><WidgetsIcon /></ListItemIcon>
          <ListItemText primary="みんなのコード" />
        </ListLinkItem>
        <ListLinkItem selected={current === 'my_questions'} url="/questions/?mode=mine" afterClick={closeDrawer}>
          <ListItemIcon><SubjectIcon /></ListItemIcon>
          <ListItemText primary="自分のコード" />
        </ListLinkItem>
     </List>
    </Drawer>
    <UserIconDialog uid={uid} onClose={closeUserIconDialog} open={userIconDialogOpen} />
  </div>
}

const UserIconDialog: React.FC<{ uid: string; open: boolean; onClose: () => void }> = ({ uid, open, onClose }) => {
  const svg = useIconSVG(uid)
  return <Dialog open={open} onClose={onClose}>
    <div style={{ width: 512, height: 512 }}>
      <img src={`data:image/svg+xml,${svg}`} width="512" height="512" />
    </div>
  </Dialog>
}

const ListLinkItem: React.FC<{ url: string; selected?: boolean; afterClick: () => void }> = ({ url, selected, afterClick, children }) => {
  const { history } = useRouter()
  const onClick = () => {
    if (!selected) history.push(url)
    afterClick()
  }
  return <ListItem button selected={selected} onClick={onClick}>
    {children}
  </ListItem>
}

export const PageBody = styled.div`
  margin: 8px;
`
