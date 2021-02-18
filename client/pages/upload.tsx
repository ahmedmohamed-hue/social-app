import { Button, Typography } from '@material-ui/core'
import React, { Fragment, useState } from 'react'
import { useAddAvatarMutation } from '../generated/graphql'
import { withApollo } from '../lib/apolloClient'

const upload: React.FC = () => {
  const [file, setFile] = useState<null | File>(null)

  const [upload, { loading }] = useAddAvatarMutation({ notifyOnNetworkStatusChange: true })

  return (
    <Fragment>
      <Typography>File upload</Typography>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await upload({ variables: { file } })
          console.log('image saved')
        }}
      >
        <input type="file" onChange={(e) => setFile(e.currentTarget.files![0])} />
        <Button type="submit">Upload</Button>
        {loading ? <h1>Loading</h1> : null}
      </form>
    </Fragment>
  )
}

export default withApollo({ ssr: true })(upload)
