import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../components/Layout'
import PostComponent from '../../components/Post'
import { Post as PostType, useCurrentUserQuery, usePostQuery } from '../../generated/graphql'
import { withApollo } from '../../lib/apolloClient'

const Post: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const { data, error, loading } = usePostQuery({ variables: { id: parseInt(id as string) } })
  const currentUser = useCurrentUserQuery()

  if (loading) {
    return null
  }

  if (error && !loading) {
    router.push('/')
  }

  if (!data?.post) {
    return <h1>Not found</h1>
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Box display="flex" maxWidth="700px" marginX="auto" justifyContent="center" pt={3}>
          <PostComponent isUser={!!currentUser.data?.currentUser} post={data.post as PostType} />
        </Box>
      </Container>
    </Layout>
  )
}

export default withApollo({ ssr: true })(Post)
