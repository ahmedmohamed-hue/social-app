import clsx from 'clsx'
import dayjs from 'dayjs'
import React from 'react'
import { RegularUserFragment } from '../../generated/graphql'
import Link from '../../components/Link'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginRight: theme.spacing(2),
  },
  status: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    borderRadius: '50%',
    marginLeft: theme.spacing(1),
  },
  statusOffline: {
    backgroundColor: grey[500],
  },
}))

interface UserProps {
  user?: RegularUserFragment
}

const User: React.FC<UserProps> = ({ user }) => {
  const classes = useStyles()

  if (!user) return null

  const fromNowDate = dayjs(user.lastSeen!).fromNow()

  return (
    <Link href={`/${user.username}`}>
      <Box display="flex" alignItems="center" width="100%" mx={2} p={1} pt={2}>
        <Avatar src={user.avatar_url!} className={classes.avatar} />
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Typography variant="body2" color="textPrimary">
            {user.firstName} {user.lastName}
          </Typography>
          <Box display="flex" width="100%" alignItems="center">
            <Typography variant="caption" color="textSecondary">
              {user.onlineStatus ? 'Online' : fromNowDate}
            </Typography>
            <div
              className={clsx(classes.status, {
                [classes.statusOffline]: !user?.onlineStatus,
              })}
            />
          </Box>
        </Box>
      </Box>
    </Link>
  )
}

export default User
