import { Typography } from '@material-ui/core'
import React from 'react'
import Link from './Link'

export default function Copyright() {
  return (
    <div>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link href="/" color="inherit">
          Social App
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </div>
  )
}
