import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Chat, Home } from 'heroicons-react'
import React, { Fragment } from 'react'
import { CurrentUserFragment } from '../../generated/graphql'
import { useUIStore } from '../../lib/store'
import Copyright from '../Copyright'
import Link from '../Link'

interface SidebarProps {
  user: CurrentUserFragment
}

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
  },
  drawerPaper: {
    width: 240,
  },
  copyrightSection: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    paddingBottom: theme.spacing(4),
    width: '100%',
  },
  divider: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(1),
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
}))

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const classes = useStyles()
  const open = useUIStore((state) => state.drawerOpen)
  const closeDrawer = useUIStore((state) => state.closeDrawer)
  const openDrawer = useUIStore((state) => state.openDrawer)

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <SwipeableDrawer
      className={classes.drawer}
      variant={mobile ? 'temporary' : 'permanent'}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
      onOpen={openDrawer}
      open={open}
      onClose={closeDrawer}
    >
      {user ? (
        <Fragment>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            p={1}
            pt={2}
            pb={2}
          >
            <Avatar src={user.avatar_url!} className={classes.avatar} />
            <Typography variant="h6" color="textPrimary">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography
              component={Link}
              href={`/${user.username}`}
              variant="body1"
              color="textSecondary"
            >
              @{user.username}
            </Typography>
          </Box>
          <Divider
            style={{ width: '80%', margin: '0 auto', height: '2px', marginBottom: '1.5rem' }}
          />
        </Fragment>
      ) : null}
      <List style={{ paddingTop: 0 }}>
        <ListItem button component={Link} href="/" activeClassName={classes.active}>
          <ListItemText className={classes.center} primary="Home" />
          <ListItemIcon className={classes.center}>
            <Home />
          </ListItemIcon>
        </ListItem>
        <ListItem button component={Link} href="/messages" activeClassName={classes.active}>
          <ListItemText className={classes.center} primary="Messages" />
          <ListItemIcon className={classes.center}>
            <Chat />
          </ListItemIcon>
        </ListItem>
      </List>
      <Box className={classes.copyrightSection}>
        <Divider className={classes.divider} />
        <Copyright />
      </Box>
    </SwipeableDrawer>
  )
}

export default Sidebar
