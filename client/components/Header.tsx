import React, { useMemo, useState, useCallback, useContext, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {
  AppBar, Toolbar, IconButton, Typography, Button, Badge,
  makeStyles
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import AlarmIcon from '@material-ui/icons/Notifications'

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
  return <div className={classes.root}>
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {title || ''}
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <AlarmIcon />
         </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
    <Toolbar />
  </div>
}

export const PageBody = styled.div`
  margin: 8px;
`
