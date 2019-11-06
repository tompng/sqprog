import React, { useMemo, useState, useCallback, useContext, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {
  AppBar, Toolbar, IconButton, Typography, Button, Badge,
  Drawer, Divider, List, ListItem, ListItemIcon, ListItemText,
  makeStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import AlertIcon from '@material-ui/icons/Notifications'
import SendIcon from '@material-ui/icons/Send'
import SubjectIcon from '@material-ui/icons/Subject'
import WidgetsIcon from '@material-ui/icons/Widgets'
import StorageIcon from '@material-ui/icons/Storage'
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
}
export const Header: React.FC<HeaderProps> = ({ title }: HeaderProps) => {
  const classes = useStyles()
  const { history } = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  return <div className={classes.root}>
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" onClick={() => setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
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
      <List>
        <ListItem button onClick={() => history.push('/questions/new')}>
          <ListItemIcon><SendIcon /></ListItemIcon>
          <ListItemText primary="コードを送る" />
        </ListItem>
        <ListItem button onClick={() => history.push('/questions/')}>
          <ListItemIcon><WidgetsIcon /></ListItemIcon>
          <ListItemText primary="みんなのコード" />
        </ListItem>
        <ListItem button onClick={() => history.push('/questions/mine')}>
          <ListItemIcon><SubjectIcon /></ListItemIcon>
          <ListItemText primary="あなたが送ったコード" />
        </ListItem>
     </List>
    </Drawer>
  </div>
}

export const PageBody = styled.div`
  margin: 8px;
`
