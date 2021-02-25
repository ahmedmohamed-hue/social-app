import User from './User'
import React, { Fragment } from 'react'
import { useUsersQuery } from '../generated/graphql'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'

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
  const { data } = useUsersQuery({ pollInterval: 15000 })
  const classes = useStyles()

  return (
    <Fragment>
      <Box>
        <Typography variant="h4" component="h1">
          People
        </Typography>
        <Divider className={classes.divider} />
      </Box>
      {/* TODO: Add Skeleton while laoding */}
      <Paper className={classes.paper}>
        {data?.users ? data.users.map((user) => <User key={user.id} user={user} />) : null}
      </Paper>
    </Fragment>
  )
}

export default People
