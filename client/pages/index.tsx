import React from 'react'
import { useCurrentUserQuery } from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'
import Layout from '../components/Layout'
import {
  Box,
  Button,
  Grid,
  Hidden,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import clsx from 'clsx'
import useModal from '../lib/hooks/useModal'
import CreatePostModal from '../components/Modals/CreatePostModal'
import { useRouter } from 'next/router'
import People from '../components/People'
import Posts from '../components/Posts'

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
  const router = useRouter()

  const { data } = useCurrentUserQuery()

  const classes = useStyles()
  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.down('sm'))

  const [props, handleOpen] = useModal()

  const handleModalOpen = () => {
    if (!data?.currentUser) {
      router.push('/login')
    } else {
      handleOpen()
    }
  }

  return (
    <Layout>
      <Box
        className={clsx(classes.root, {
          [classes.rootMd]: md,
        })}
      >
        <Grid container>
          <Grid item lg={3}>
            <Hidden mdDown implementation="css">
              <Box position="fixed">
                <People />
              </Box>
            </Hidden>
          </Grid>
          <Grid item md={8} lg={6} xs={12}>
            {/* Create Post */}

            <Box maxWidth="700px" mx="auto">
              <Box mb={2}>
                <Button color="primary" variant="contained" fullWidth onClick={handleModalOpen}>
                  Create Post
                </Button>
              </Box>
              <Posts isUser={!!data?.currentUser} />
            </Box>
          </Grid>
          <Grid item md={4} lg={3}>
            <Hidden implementation="css" smDown>
              <Box right={32} position="fixed">
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Poeple to follow
                  </Typography>
                </Paper>
              </Box>
            </Hidden>
          </Grid>
        </Grid>
      </Box>
      <CreatePostModal {...props} />
    </Layout>
  )
}

export default withApollo({ ssr: true })(Index)
