import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Avatar,
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Switch,
  Typography,
} from '@material-ui/core'
import { Logout, Moon, User } from 'heroicons-react'
import SwitchTheme from '../SwitchTheme'
import {
  CurrentUserDocument,
  CurrentUserQuery,
  useLogoutMutation,
  User as UserType,
} from '../../generated/graphql'
import { useApolloClient } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from '../Link'
import { grey } from '@material-ui/core/colors'
import clsx from 'clsx'
import { useToggleStatusMutation } from '../../generated/graphql'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    paper: {
      minWidth: theme.spacing(28),
    },
    avatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginBottom: theme.spacing(1),
    },
    listIcon: {
      minWidth: theme.spacing(4),
    },
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      bottom: 0,
      borderRadius: '50%',
    },
    statusBadge: {
      width: theme.spacing(1),
      height: theme.spacing(1),
      backgroundColor: '#44b700',
      borderRadius: '50%',
      marginRight: theme.spacing(1),
    },
    offlineStatusBadge: {
      backgroundColor: grey[500],
    },
  })
)

interface DropdownMenuProps {
  user: UserType
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ user }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  const [toggleStatus] = useToggleStatusMutation({
    update: (cache, { data }) => {
      cache.writeQuery<CurrentUserQuery>({
        query: CurrentUserDocument,
        data: {
          __typename: 'Query',
          currentUser: data?.toggleStatus,
        },
      })
    },
  })

  const handleToggleStatus = async () => {
    await toggleStatus()
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  const [logout] = useLogoutMutation()
  const apolloClient = useApolloClient()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    await apolloClient.resetStore()

    router.push('/')
  }

  return (
    <div className={classes.root}>
      <IconButton
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Avatar src={user.avatar_url!} />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center top' }}>
            <Paper className={classes.paper}>
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Box display="flex" alignItems="center" mx={2} width="100%" paddingTop={2}>
                    <Avatar src={user.avatar_url!} className={classes.avatar} />
                    <Box display="flex" flexDirection="column" ml={1}>
                      <Typography
                        component={Link}
                        href={`/${user.username}`}
                        variant="body1"
                        color="textPrimary"
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <div
                          className={clsx(classes.statusBadge, {
                            [classes.offlineStatusBadge]: !user.onlineStatus,
                          })}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {user.onlineStatus ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    pt={1}
                    width="100%"
                    display="flex"
                    justifyContent="space-between"
                    px={3}
                    alignItems="center"
                  >
                    <Typography variant="body2" color="textSecondary">
                      Online
                    </Typography>
                    <Switch checked={user.onlineStatus} onChange={handleToggleStatus} />
                  </Box>
                  <Divider />
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem>
                      <ListItemIcon className={classes.listIcon}>
                        <User />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon className={classes.listIcon}>
                        <Moon />
                      </ListItemIcon>
                      <ListItemText primary="Dark mode" />
                      <SwitchTheme />
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon className={classes.listIcon}>
                        <Logout />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </MenuList>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export default DropdownMenu
