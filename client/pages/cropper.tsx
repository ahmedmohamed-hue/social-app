import React, { useState } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

const defaultSrc =
  'https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg'

export const Demo: React.FC = () => {
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
    }
  }

  return (
    <div>
      <div style={{ width: '100%' }}>
        <input type="file" onChange={onChange} />
        <button>Use default img</button>
        <br />
        <br />
        <Cropper
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image}
          viewMode={1}
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
      </div>
      <div>
        <div
          style={{
            width: '50%',
            float: 'right',
            display: 'inline-block',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <h1>Preview</h1>
          <div
            className="img-preview"
            style={{
              width: '100%',
              float: 'left',
              height: '300px',
              overflow: 'hidden',
              borderRadius: '50%',
            }}
          />
        </div>
        <div
          className="box"
          style={{
            width: '50%',
            float: 'right',
            height: '300px',
            display: 'inline-block',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <h1>
            <span>Crop</span>
            <button style={{ float: 'right' }} onClick={getCropData}>
              Crop Image
            </button>
          </h1>
          <img
            style={{ width: '256px', height: '256px', borderRadius: '50%' }}
            src={cropData}
            alt="cropped"
          />
        </div>
      </div>
      <br style={{ clear: 'both' }} />
    </div>
  )
}

export default Demo
