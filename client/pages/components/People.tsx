import { Typography, Divider, Box, Paper, makeStyles } from '@material-ui/core'
import User from './User'
import React, { Fragment } from 'react'
import { useGetUsersQuery } from '../../generated/graphql'

const useStyles = makeStyles((theme) => ({
  divider: {
    width: theme.spacing(20),
    height: '2px',
    marginTop: theme.spacing(0.6),
    background: theme.palette.text.primary,
  },
  paper: {
    marginTop: theme.spacing(2),
    width: theme.spacing(30),
  },
}))

const People: React.FC = () => {
  const users = useGetUsersQuery({ pollInterval: 15000 })
  const classes = useStyles()

  return (
    <Fragment>
      <Box>
        <Typography variant="h4" component="h1">
          People
        </Typography>
        <Divider className={classes.divider} />
      </Box>
      <Paper className={classes.paper}>
        {users.data?.getUsers
          ? users.data.getUsers.map((user) => <User key={user.username} user={user} />)
          : null}
      </Paper>
    </Fragment>
  )
}

export default People
