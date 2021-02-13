import {
  Divider,
  Box,
  useMediaQuery,
  SwipeableDrawer,
  Avatar,
  Typography,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
} from '@material-ui/core'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { Chat, Home } from 'heroicons-react'
import React from 'react'
import { User } from '../../generated/graphql'
import { useUIStore } from '../../lib/store'
import Copyright from '../Copyright'
import Link from '../Link'

interface Sidebar {
  user: User
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

interface SidebarProps {
  user?: User
}

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
        <>
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
            <Avatar
              src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
              className={classes.avatar}
            />
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
        </>
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