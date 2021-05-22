import { CircularProgress, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { MeDocument, useConfirmEmailMutation } from '../../generated/graphql'

const ConfirmEmail: React.FC = () => {
  const toast = useToast()
  const { token } = useParams()

  const [confirmEmail, { data, loading, error }] = useConfirmEmailMutation({
    variables: { token },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: MeDocument,
        data: data?.confirmEmail,
      })
    },
  })

  useEffect(() => {
    ;(async () => {
      try {
        await confirmEmail()
        toast({
          status: 'success',
          title: 'Email confirmed successfully',
          position: 'bottom-right',
        })
      } catch (e) {}
    })()
  }, [confirmEmail, toast])

  if (loading) {
    return <CircularProgress isIndeterminate color={'green.300'} />
  }

  // TODO: Display a better error

  if (error || !data) {
    return <h1>{error?.message}</h1>
  }

  return <Redirect to="/dashboard" />
}

export default ConfirmEmail
