import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../components/Layout'
import {
  User as UserType,
  Post as PostType,
  useCurrentUserQuery,
  useUserQuery,
} from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'
import DefaultErrorPage from 'next/error'
import Post from '../components/Post'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import ProfilePicture from '../components/ProfilePicture'
import ProfileCover from '../components/ProfileCover'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `0 ${theme.spacing(3)}px`,
  },
  gradient: {
    background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))',
    // borderRadius: theme.spacing(2),
  },
  cover: {
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.background.paper,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    height: '21vw',
    display: 'flex',
    alignItems: 'flex-end',
  },
  friendsPaper: {
    width: '100%',
    padding: theme.spacing(2),
  },
  gridContainer: {
    marginTop: theme.spacing(2),
  },
  loading: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    width: '100%',
    backgroundColor: `rgba(0,0,0,${
      theme.palette.type === 'dark' ? '0.6' : '0.3'
    })`,
  },
}))

const User: React.FC = () => {
  const router = useRouter()
  const classes = useStyles()

  const { data: currentUser } = useCurrentUserQuery()

  const { userId } = router.query

  const { data, loading } = useUserQuery({
    variables: { username: userId as string },
    fetchPolicy: 'network-only',
  })

  if (!data?.user && !loading) {
    return <DefaultErrorPage statusCode={404} />
  }

  if (!data?.user) return null

  const user = data.user

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
        <Box
          position="relative"
          height="21vw"
          width="100%%"
          marginX="auto"
          className={classes.cover}
        >
          <ProfileCover user={user} />
          <ProfilePicture currentUser={currentUser?.me!} user={user} />
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
                  isUser={!!currentUser?.me}
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
