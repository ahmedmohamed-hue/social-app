import { gql } from '@apollo/client'
import { Box, Button, CircularProgress, DialogActions, DialogTitle } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import 'cropperjs/dist/cropper.css'
import React, { useState } from 'react'
import Cropper from 'react-cropper'
import { useAddAvatarMutation } from '../../generated/graphql'

interface DeleteModalProps {
  open: boolean
  handleClose: () => void
  img: any
  file: any
  userId: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: '500px',
  },
  red: {
    backgroundColor: theme.palette.error.main,
  },
}))

const ProfileAvtarModal: React.FC<DeleteModalProps> = ({
  open,
  handleClose,
  img,
  file,
  userId,
}) => {
  const classes = useStyles()

  const [upload, { loading }] = useAddAvatarMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: 'User:' + userId,
        fragment: gql`
          fragment __ on User {
            avatar_url
          }
        `,
        data: { avatar_url: data?.addAvatar },
      })
    },
  })

  const [cropper, setCropper] = useState<any>()

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      cropper.getCroppedCanvas().toBlob(async (blob: any) => {
        const file = new File([blob], 'dada', {
          type: 'image/png',
        })
        try {
          await upload({ variables: { file } })
          handleClose()
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
      {loading ? (
        <Box width="100%" height="300px" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Cropper
            style={{ height: 400, overflow: 'hidden' }}
            initialAspectRatio={1}
            src={file ? file : img}
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
