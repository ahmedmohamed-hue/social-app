import { S3 } from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { FileUpload } from 'graphql-upload'

const BUCKET_NAME = 'hamooood'

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
})

export const uploadFile = (file: FileUpload, key?: string) => {
  const params: PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Body: file.createReadStream(),
    ContentType: file.mimetype,
    Key: key || file.filename,
  }

  return new Promise<string>((res, rej) => {
    s3.upload(params, (err, data) => {
      if (err) {
        throw new Error(err.message)
      }
      res(data.Location)
    })
  })
}

export const deleteObject = (key: string) => {
  console.log('key: ' + key)
  const params: PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: key,
  }

  return new Promise<boolean>((res, rej) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        rej(false)
        console.log(err)
        throw new Error(err.message)
      }
      res(true)
    })
  })
}
