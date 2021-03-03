import { Box, Button, CircularProgress } from '@material-ui/core'
import React from 'react'
import { useCommentsQuery, Comment as CommentType } from '../generated/graphql'
import Comment from './Comment'

interface CommentsProps {
  postId: number
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { data, loading, fetchMore, variables } = useCommentsQuery({
    variables: { postId, limit: 4 },
  })

  if (loading) {
    return <CircularProgress />
  }

  if (!data?.paginatedComments) {
    return null
  }

  return (
    <Box paddingX={2} pb={2}>
      {data.paginatedComments.comments.map((comment) => (
        <Comment key={comment.id} comment={comment as CommentType} />
      ))}{' '}
      {data.paginatedComments.hasMore && (
        <Box m={1} mb={2}>
          <Button
            size="small"
            variant="contained"
            fullWidth
            onClick={() => {
              fetchMore({
                variables: {
                  ...variables,
                  limit: 20,
                  cursor:
                    data.paginatedComments.comments[data.paginatedComments.comments.length - 1]
                      .createdAt,
                },
              })
            }}
          >
            View more comments
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Comments
