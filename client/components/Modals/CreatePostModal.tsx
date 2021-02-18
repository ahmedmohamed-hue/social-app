import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Box, IconButton, makeStyles } from '@material-ui/core'
import { X } from 'heroicons-react'
import { useFormik } from 'formik'
import { GetPostsDocument, GetPostsQuery, useCreatePostMutation } from '../../generated/graphql'

interface CreatePostModalProps {
  open: boolean
  handleClose: () => void
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '500px',
  },
}))

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, handleClose }) => {
  const classes = useStyles()

  const [create] = useCreatePostMutation()

  const reset = () => {
    resetForm()
    handleClose()
  }

  const { getFieldProps, handleSubmit, resetForm } = useFormik({
    initialValues: {
      title: '',
      body: '',
    },
    onSubmit: (values) => {
      create({
        variables: values,
        update: (cache, { data }) => {
          if (data?.createPost) {
            const oldPosts = cache.readQuery<GetPostsQuery>({ query: GetPostsDocument })

            cache.writeQuery<GetPostsQuery>({
              query: GetPostsDocument,
              data: {
                getAllPosts: [data?.createPost!, ...oldPosts?.getAllPosts!],
              },
            })
          }
        },
      })
        .then(() => {
          reset()
        })
        .catch(console.log)
    },
  })

  return (
    <Dialog
      open={open}
      onClose={reset}
      PaperProps={{ className: classes.root }}
      aria-labelledby="form-dialog-title"
      keepMounted={false}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <DialogTitle id="form-dialog-title">Create Post</DialogTitle>
        <Box pr={2}>
          <IconButton onClick={reset}>
            <X />
          </IconButton>
        </Box>
      </Box>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            variant="outlined"
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            {...getFieldProps('title')}
          />
          <TextField
            multiline
            rows={4}
            rowsMax={8}
            margin="normal"
            id="body"
            variant="outlined"
            label="Body"
            type="text"
            {...getFieldProps('body')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={reset} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreatePostModal
