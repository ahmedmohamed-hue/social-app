import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../components/Layout'
import { useGetUserQuery } from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'
import DefaultErrorPage from 'next/error'

const useStyles = makeStyles((theme) => ({
  gradient: {
    background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))',
    borderRadius: theme.spacing(2),
  },
  avatar: {
    position: 'absolute',
    bottom: -theme.spacing(6),
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: theme.spacing(16),
    height: theme.spacing(16),
    backgroundColor: 'red',
    borderRadius: '50%',
    border: `solid 3px ${theme.palette.primary.main}`,
  },
  cover: {
    background: 'url(https://i.pinimg.com/originals/bf/82/f6/bf82f6956a32819af48c2572243e8286.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    borderRadius: theme.spacing(2),
  },
}))

const User: React.FC = () => {
  const router = useRouter()

  const classes = useStyles()

  const slug = router.query

  const { data, loading } = useGetUserQuery({
    variables: { username: slug.user as string },
  })

  if (loading) {
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    )
  }

  if (!data?.getUser && !loading) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <Box
        position="relative"
        mt="72px"
        pt="21%"
        width="90%"
        marginX="auto"
        className={classes.cover}
      >
        <Avatar
          src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
          className={classes.avatar}
        />
        <Box
          width="100%"
          height="50px"
          className={classes.gradient}
          display="flex"
          justifyContent="end"
          px={4}
        >
          <Box>
            <Button variant="contained">EXTRA</Button>
          </Box>
        </Box>
      </Box>
      <Box textAlign="center" mt={7}>
        <Typography variant="h6" color="textPrimary">
          {data?.getUser?.firstName} {data?.getUser?.lastName}
        </Typography>
      </Box>
    </Layout>
  )
}

export default withApollo({ ssr: true })(User)
