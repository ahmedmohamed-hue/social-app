import { AppBar, Button, IconButton, Toolbar, Typography, useMediaQuery } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import { Menu } from 'heroicons-react'
import React from 'react'
import { useCurrentUserQuery, User } from '../../generated/graphql'
import { useUIStore } from '../../lib/store'
import Link from '../Link'
import DropdownMenu from './DropdownMenu'
import Sidebar from './Sidebar'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  appBarShift: {
    width: `calc(100% - ${240}px)`,
    marginLeft: 240,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  dotsIcons: {
    color: '#fff',
  },
}))

const index: React.FC = () => {
  const classes = useStyles()
  const openDrawer = useUIStore((state) => state.openDrawer)

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  const { data } = useCurrentUserQuery()

  return (
    <AppBar
      position="fixed"
      className={clsx({
        [classes.appBarShift]: !mobile,
      })}
    >
      <Toolbar>
        {mobile ? (
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={openDrawer}
            color="inherit"
            aria-label="menu"
          >
            <Menu />
          </IconButton>
        ) : null}
        <Typography variant="h6" className={classes.title}>
          App
        </Typography>
        {data?.currentUser ? (
          <DropdownMenu user={data.currentUser} />
        ) : (
          <>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Signup</Button>
            </Link>
          </>
        )}
      </Toolbar>
      <Sidebar user={data?.currentUser as User} />
    </AppBar>
  )
}

export default index
