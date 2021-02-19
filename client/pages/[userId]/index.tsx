import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../components/Layout'
import {
  User as UserType,
  Post as PostType,
  useCurrentUserQuery,
  useUserQuery,
} from '../../generated/graphql'
import { withApollo } from '../../lib/apolloClient'
import DefaultErrorPage from 'next/error'
import Post from '../../components/Post'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import ProfilePicture from './ProfilePicture'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `0 ${theme.spacing(3)}px`,
  },
  gradient: {
    background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))',
    // borderRadius: theme.spacing(2),
  },
  avatar: {
    width: '100%',
    height: theme.spacing(16),
    border: `solid 3px ${theme.palette.primary.main}`,
  },
  cover: {
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.background.paper,
    backgroundSize: 'cover',
    // borderRadius: theme.spacing(1),
  },
  friendsPaper: {
    width: '100%',
    padding: theme.spacing(2),
  },
  gridContainer: {
    marginTop: theme.spacing(2),
  },
  avatarBox: {
    position: 'absolute',
    bottom: -theme.spacing(6),
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderRadius: '50%',
  },
  badge: {
    position: 'absolute',
    bottom: theme.spacing(-1),
    right: theme.spacing(-1),
    zIndex: 10000,
    '&:hover': {
      backgroundColor: 'inherit',
    },
  },
}))

const User: React.FC = () => {
  const router = useRouter()
  const classes = useStyles()
  const currentUser = useCurrentUserQuery()

  const { userId } = router.query

  const { data, loading, refetch } = useUserQuery({
    variables: { username: userId as string },
    fetchPolicy: 'network-only',
  })

  if (!data?.getUser && !loading) {
    return <DefaultErrorPage statusCode={404} />
  }

  if (!data?.getUser) return null

  const user = data.getUser

  if (loading) {
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    )
  }

  return (
    <Layout>
      <Container>
        <Box position="relative" pt="21%" width="100%%" marginX="auto" className={classes.cover}>
          <ProfilePicture currentUser={currentUser.data?.currentUser!} user={user} />
          <Box
            width="100%"
            height="50px"
            className={classes.gradient}
            display="flex"
            justifyContent="flex-end"
            px={4}
          >
            <Box>
              <Button variant="contained">Change photo cover</Button>
            </Box>
          </Box>
        </Box>
        <Box textAlign="center" mt={7}>
          <Typography variant="h5" color="textPrimary">
            {user.firstName} {user.lastName}
          </Typography>
        </Box>
        <Grid container spacing={4} className={classes.gridContainer}>
          <Grid item md={5} sm={12}>
            <Paper className={classes.friendsPaper}>
              <Typography>Friends</Typography>
            </Paper>
          </Grid>
          <Grid item md={7} sm={12}>
            {user.posts.length! > 0 ? (
              user.posts.map((p) => (
                <Post
                  key={p.id!}
                  post={{ ...(p as PostType), creator: user as UserType }}
                  isUser={!!currentUser.data?.currentUser}
                  refetch={refetch}
                />
              ))
            ) : (
              <Paper className={classes.friendsPaper}>
                <Typography variant="body1">No posts</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default withApollo({ ssr: true })(User)
