import React, { useState } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core'
import useModal from '../components/useModal'
import ProfileAvtarModal from '../components/Modals/ProfileAvatarModal'
import { useAddAvatarMutation, useCurrentUserQuery } from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'

const defaultSrc =
  'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'

export const Demo: React.FC = () => {
  const [props, handleOpen] = useModal()

  const { data } = useCurrentUserQuery()
  const [upload] = useAddAvatarMutation()

  const [image, setImage] = useState(defaultSrc)
  const [cropData, setCropData] = useState('#')
  const [cropper, setCropper] = useState<any>()
  const onChange = (e: any) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as any)
    }
    reader.readAsDataURL(files[0])
  }

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setCropData(cropper.getCroppedCanvas().toDataURL())
      cropper.getCroppedCanvas().toBlob(async (blob: any) => {
        const file = new File([blob], 'dada')
        // console.log(file)
        upload({ variables: { file } })
          .then((res) => {
            console.log(res)
          })
          .catch((e) => {
            console.log(e)
          })
      })
    }
  }

  return (
    <div>
      <Button onClick={handleOpen}>click</Button>
      <Dialog {...props} style={{ minWidth: '500px' }}>
        <DialogTitle>Edit your image</DialogTitle>
        <Cropper
          style={{ height: 400, overflow: 'hidden' }}
          initialAspectRatio={1}
          src={data?.currentUser?.avatar_url!}
          viewMode={3}
          async
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
          <Button>Cancel</Button>
          <Button onClick={getCropData} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <div>{cropData ? <img style={{ borderRadius: '50%' }} src={cropData} alt="" /> : null}</div>
    </div>
  )
}

export default withApollo({ ssr: true })(Demo)
