import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Box, DialogContentText, IconButton, makeStyles } from '@material-ui/core'
import { X } from 'heroicons-react'

interface DeleteModalProps {
  open: boolean
  handleClose: () => void
  action?: () => void
  message: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '500px',
  },
  red: {
    backgroundColor: theme.palette.error.main,
  },
}))

const DeleteModal: React.FC<DeleteModalProps> = ({ open, handleClose, action, message }) => {
  const classes = useStyles()

  // const [create] = useCreatePostMutation()

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ className: classes.root }}
      aria-labelledby="form-dialog-title"
      keepMounted={false}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <DialogTitle id="form-dialog-title">{message}</DialogTitle>
        <Box pr={2}>
          <IconButton onClick={handleClose}>
            <X />
          </IconButton>
        </Box>
      </Box>
      <DialogContent>
        <DialogContentText>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta voluptates nemo
          reprehenderit delectus accusantium?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={action ? action : undefined} className={classes.red}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteModal
