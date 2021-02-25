import Box from '@material-ui/core/Box'
import React, { Fragment } from 'react'
import { usePostsQuery, Post as PostType } from '../generated/graphql'
import InfiniteScroll from 'react-infinite-scroll-component'
import Post from './Post'
import PostSkeleton from './Skeletons/PostSkeleton'

interface Props {
  isUser?: boolean
}

const Posts: React.FC<Props> = ({ isUser }) => {
  const { data, loading, fetchMore, variables } = usePostsQuery({ variables: { limit: 3 } })

  return (
    <Fragment>
      {loading ? (
        <Box>
          <PostSkeleton />
        </Box>
      ) : data?.paginatedPosts ? (
        <InfiniteScroll
          next={() => {
            fetchMore({
              variables: {
                limit: variables?.limit,
                cursor: data?.paginatedPosts.posts[data.paginatedPosts.posts.length - 1].createdAt,
              },
            })
          }}
          loader={
            <Box>
              <PostSkeleton />
            </Box>
          }
          dataLength={data.paginatedPosts.posts.length}
          hasMore={data.paginatedPosts.hasMore}
        >
          <Box>
            {data.paginatedPosts.posts.map((p) => (
              <Box key={p.id}>
                <Post isUser={!!isUser} post={p as PostType} />
              </Box>
            ))}
          </Box>
        </InfiniteScroll>
      ) : null}
    </Fragment>
  )
}

export default Posts
