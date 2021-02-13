import { Box, Avatar, Typography, makeStyles } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import clsx from 'clsx'
import dayjs from 'dayjs'
import React from 'react'
import { User as UserType } from '../generated/graphql'
import Link from './Link'

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
  user?: UserType
  offline?: boolean
}

const User: React.FC<UserProps> = ({ user }) => {
  const classes = useStyles()

  return (
    <Link href={`/${user?.username}`}>
      <Box display="flex" alignItems="center" width="100%" mx={2} p={1} pt={2}>
        <Avatar
          src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
          className={classes.avatar}
        />
        <Box display="flex" justifyContent="center" flexDirection="column">
          <Typography variant="body2" color="textPrimary">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Box display="flex" width="100%" alignItems="center">
            <Typography variant="caption" color="textSecondary">
              {user?.onlineStatus ? 'Online' : dayjs(user?.lastSeen!).fromNow()}
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
