import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { X } from 'heroicons-react'
import React from 'react'
import { User as UserType } from '../../generated/graphql'
import Link from '../Link'

interface Props {
  users?: UserType[] | null
  open: boolean
  handleClose: () => void
}

const useStyles = makeStyles(() => ({
  paper: {
    minHeight: 300,
  },
}))

const LikesModal: React.FC<Props> = ({ users, open, handleClose }) => {
  const classes = useStyles()
  return (
    <Dialog PaperProps={{ className: classes.paper }} open={open} onClose={handleClose}>
      <Box display="flex" justifyContent="space-between">
        <DialogTitle>Likes</DialogTitle>
        <Box display="flex" alignItems="center" pr={2}>
          <IconButton onClick={handleClose}>
            <X />
          </IconButton>
        </Box>
      </Box>
      <DialogContent>
        <Box>
          {users?.map((user) => (
            <Box display="flex" alignItems="center" marginBottom={2} key={user.id}>
              <Link href={`/${user.username}`}>
                <Avatar src={user.avatar_url!} />
              </Link>
              <Box ml={2}>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default LikesModal
