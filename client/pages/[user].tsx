import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import Layout from '../components/Layout'
import {
  useGetUserQuery,
  User as UserType,
  Post as PostType,
  useCurrentUserQuery,
  useRemoveAvatarMutation,
} from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'
import DefaultErrorPage from 'next/error'
import Post from '../components/Post'
import { Pencil } from 'heroicons-react'
import useMenu from '../components/useMenu'
import useModal from '../components/useModal'
import ProfileAvtarModal from '../components/Modals/ProfileAvatarModal'
import DeleteConfirmModal from '../components/Modals/DeleteConfirmModal'

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
  box: {
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

  const slug = router.query

  const { data, loading, refetch } = useGetUserQuery({
    variables: { username: slug.user as string },
    fetchPolicy: 'network-only',
  })

  const { anchorEl, handleClick, handleClose } = useMenu()
  const [props, handleOpen] = useModal()
  const [deleteProps, handleDeleteOpen] = useModal()

  const [removeAvatar] = useRemoveAvatarMutation()

  const handleRemove = async () => {
    handleClose()
    await removeAvatar()
    await refetch()
    props.handleClose()
  }

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

  if (!data?.getUser) return null

  const user = data.getUser

  return (
    <Layout>
      <Container>
        <Box position="relative" pt="21%" width="100%%" marginX="auto" className={classes.cover}>
          <Box className={classes.box}>
            <Box position="relative">
              {currentUser.data?.currentUser?.id === user.id ? (
                <Fragment>
                  <IconButton onClick={handleClick} className={classes.badge}>
                    <Avatar>
                      <Pencil />
                    </Avatar>
                  </IconButton>

                  {user.avatar_url ? (
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>Change avatar</MenuItem>
                      <MenuItem onClick={handleOpen}>Edit avatar</MenuItem>
                      <MenuItem onClick={handleDeleteOpen}>Remove avatar</MenuItem>
                      <DeleteConfirmModal
                        {...deleteProps}
                        action={handleRemove}
                        message="Are you sure?"
                      />
                      <ProfileAvtarModal {...props} user={user} refetch={currentUser.refetch} />
                    </Menu>
                  ) : (
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>Add Profile image</MenuItem>
                    </Menu>
                  )}
                </Fragment>
              ) : null}
              <Avatar src={user.avatar_url!} className={classes.avatar} />
            </Box>
          </Box>
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
                  key={p.id}
                  post={{ ...(p as PostType), creator: user as UserType }}
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
