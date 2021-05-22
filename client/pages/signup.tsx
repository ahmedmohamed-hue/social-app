import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import Copyright from '../components/Copyright'
import {
  CurrentUserDocument,
  CurrentUserQuery,
  useRegisterMutation,
} from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const Signup: React.FC = () => {
  const classes = useStyles()
  const router = useRouter()
  const [register] = useRegisterMutation()

  const { handleSubmit, getFieldProps } = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    onSubmit: (values) => {
      register({
        variables: values,
        update: (cache, { data }) => {
          cache.writeQuery<CurrentUserQuery>({
            query: CurrentUserDocument,
            data: {
              __typename: 'Query',
              currentUser: data?.register,
            },
          })
        },
      })
        .then(() => {
          router.push('/')
        })
        .catch((e) => {
          console.log(e)
        })
    },
  })

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create your account
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                {...getFieldProps('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                autoComplete="lname"
                {...getFieldProps('lastName')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                {...getFieldProps('username')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...getFieldProps('email')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                {...getFieldProps('password')}
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

export default withApollo({ ssr: true })(Signup)
