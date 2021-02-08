import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { useGetPostQuery } from '../../generated/graphql'
import { withApollo } from '../../lib/apolloClient'

const Post: React.FC = () => {
  const router = useRouter()

  const { id } = router.query

  const { data, error, loading } = useGetPostQuery({ variables: { id: parseInt(id as string) } })

  if (loading) {
    return null
  }

  if (error) {
    router.push('/')
  }

  if (!data?.getPost && !loading) {
    return <h1>Not found</h1>
  }

  return <Fragment>{JSON.stringify(data?.getPost)}</Fragment>
}

export default withApollo({ ssr: true })(Post)
