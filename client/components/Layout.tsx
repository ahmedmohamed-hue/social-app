import { Box, Container, useMediaQuery } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useTheme from '@material-ui/core/styles/useTheme'
import clsx from 'clsx'
import React, { Fragment } from 'react'
import Navbar from './Navbar'

const useStyles = makeStyles((theme) => ({
  shitContent: {
    width: `calc(100% - ${240}px)`,
    marginLeft: 240,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}))

const Layout: React.FC = ({ children }) => {
  const classes = useStyles()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Fragment>
      <Navbar />
      <Box
        mt={8}
        className={clsx({
          [classes.shitContent]: !mobile,
        })}
      >
        {children}
      </Box>
    </Fragment>
  )
}

export default Layout
