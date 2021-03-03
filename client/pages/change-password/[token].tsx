import { Button, DialogContent, DialogTitle, makeStyles, TextField } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import { useRouter } from 'next/router'
import React from 'react'
import { useIsValidRestoreTokenQuery } from '../../generated/graphql'
import DefaultErrorPage from 'next/error'
import { withApollo } from '../../lib/apolloClient'
import { useFormik } from 'formik'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
  },
  paper: {
    minWidth: '400px',
  },
  mb: {
    marginBottom: theme.spacing(2),
  },
}))

const ChangePassword: React.FC = () => {
  const router = useRouter()
  const { token } = router.query
  const classes = useStyles()

  const { getFieldProps, handleSubmit } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values))
    },
  })

  const { data, loading, error } = useIsValidRestoreTokenQuery({
    variables: { token: token as string },
  })

  if (loading) {
    return null
  }

  if (!data?.isValidRestoreToken && !loading) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <Box className={`${classes.root} background-pattern`}>
      <Paper className={classes.paper}>
        <DialogTitle>Change your password</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              color="primary"
              label="New password"
              className={classes.mb}
              {...getFieldProps('password')}
            />
            <TextField
              fullWidth
              label="Confirm password"
              variant="outlined"
              color="secondary"
              {...getFieldProps('confirmPassword')}
            />
            <Box width="100%" marginY={2} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Paper>
    </Box>
  )
}

export default withApollo({ ssr: true })(ChangePassword)
