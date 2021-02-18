import { useRouter } from 'next/router'
import PostComponent from '../../components/Post'
import React, { Fragment } from 'react'
import Layout from '../../components/Layout'
import { useGetPostQuery, Post as PostType } from '../../generated/graphql'
import { withApollo } from '../../lib/apolloClient'
import { Box, Container } from '@material-ui/core'

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

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box display="flex" width="100%" justifyContent="center" pt={3}>
          {data?.getPost ? <PostComponent post={data.getPost! as PostType} /> : null}
        </Box>
      </Container>
    </Layout>
  )
}

export default withApollo({ ssr: true })(Post)
