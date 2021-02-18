import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

import { DialogActions, Button, DialogTitle, Box, CircularProgress } from '@material-ui/core'
import { useAddAvatarMutation } from '../../generated/graphql'

interface DeleteModalProps {
  open: boolean
  handleClose: () => void
  user: any
  refetch: any
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '500px',
  },
  red: {
    backgroundColor: theme.palette.error.main,
  },
}))

const ProfileAvtarModal: React.FC<DeleteModalProps> = ({ open, handleClose, user, refetch }) => {
  const classes = useStyles()

  const [upload, { loading, data }] = useAddAvatarMutation()

  const [cropper, setCropper] = useState<any>()
  // const onChange = (e: any) => {
  //   e.preventDefault()
  //   let files
  //   if (e.dataTransfer) {
  //     files = e.dataTransfer.files
  //   } else if (e.target) {
  //     files = e.target.files
  //   }
  //   const reader = new FileReader()

  //   reader.readAsDataURL(files[0])
  // }

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      cropper.getCroppedCanvas().toBlob(async (blob: any) => {
        const file = new File([blob], 'dada', {
          type: 'image/png',
        })
        try {
          await upload({ variables: { file } })
          handleClose()
          await refetch()
        } catch (e) {
          console.log(e)
        }
      })
    }
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ className: classes.root }}
      aria-labelledby="form-dialog-title"
      keepMounted={false}
    >
      <DialogTitle>Edit your image</DialogTitle>
      {loading && data ? (
        <Box width="100%" height="300px" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Cropper
            style={{ height: 400, overflow: 'hidden' }}
            initialAspectRatio={1}
            src={user.avatar_url}
            viewMode={3}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            scalable={false}
            dragMode="move"
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
              setCropper(instance)
            }}
          />
          <DialogActions style={{ padding: '16px' }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={getCropData} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default ProfileAvtarModal
