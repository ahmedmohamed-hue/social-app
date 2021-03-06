import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Skeleton from '@material-ui/lab/Skeleton'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: theme.spacing(2),
  },
}))

const PostSkeleton: React.FC = () => {
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Skeleton variant="circle" animation="wave" className={classes.avatar} />
          <Box>
            <Skeleton variant="text" animation="wave" width={100} />
            <Skeleton variant="text" animation="wave" width={60} />
          </Box>
        </Box>
        <IconButton disabled>
          <Skeleton variant="circle" animation="wave" width={20} height={20} />
        </IconButton>
      </Box>
      <Divider />
      <Box p={2}>
        <Skeleton variant="text" animation="wave" width={200} height={32} />
        <Skeleton height={24} animation="wave" style={{ marginBottom: '0.25rem' }} />
        <Skeleton height={24} animation="wave" width="60%" />
      </Box>
      <Divider />
      <Box display="flex" alignItems="center" pl={1} pb={1}>
        <IconButton disabled>
          <Skeleton variant="circle" animation="wave" width={20} height={20} />
        </IconButton>
        <Skeleton variant="text" animation="wave" width={20} />
      </Box>
    </Paper>
  )
}

export default PostSkeleton
