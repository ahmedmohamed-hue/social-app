import React from 'react'
import { useCurrentUserQuery, useGetPostsQuery, useGetUsersQuery } from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'
import Layout from '../components/Layout'
import {
  Box,
  Divider,
  Hidden,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import User from '../components/User'
import Post from '../components/Post'
import { User as UserType, Post as PostType } from '../generated/graphql'
import clsx from 'clsx'
import PostSkeleton from '../components/Skeletons/PostSkeleton'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
  },
  rootMd: {
    justifyContent: 'center',
  },
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
  main: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '500px',
    flexDirection: 'column',
  },
}))

const Index: React.FC = () => {
  const { data } = useCurrentUserQuery()

  const posts = useGetPostsQuery()

  const users = useGetUsersQuery({ pollInterval: 5000 })

  const classes = useStyles()

  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Layout>
      <Box
        className={clsx(classes.root, {
          [classes.rootMd]: md,
        })}
      >
        <Hidden mdDown implementation="css">
          <Box position="fixed">
            <Box>
              <Typography variant="h4" component="h1">
                People
              </Typography>
              <Divider className={classes.divider} />
            </Box>
            <Paper className={classes.paper}>
              {users.data?.getUsers
                ? users.data.getUsers.map((user) => (
                    <User key={user.username} user={user as UserType} />
                  ))
                : null}
            </Paper>
          </Box>
        </Hidden>
        <Box className={classes.main}>
          {posts.loading ? (
            <Box>
              <PostSkeleton />
            </Box>
          ) : posts.data?.getAllPosts ? (
            posts.data?.getAllPosts.map((p) => (
              <Box key={p.id}>
                <Post user={data?.currentUser!} post={p as PostType} />
              </Box>
            ))
          ) : null}
        </Box>
        <Hidden implementation="css" smDown>
          <Box right={32} position="fixed">
            <Paper className={classes.paper}>
              <h1>content</h1>
            </Paper>
          </Box>
        </Hidden>
      </Box>
    </Layout>
  )
}

export default withApollo({ ssr: true })(Index)
