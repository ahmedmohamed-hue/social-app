import { gql } from '@apollo/client'
import { Box, Avatar, TextField } from '@material-ui/core'
import { useFormik } from 'formik'
import React from 'react'
import { PaginatedComments, useAddCommentMutation, useCurrentUserQuery } from '../generated/graphql'
import Link from './Link'

const AddComment: React.FC<{ postId: number }> = ({ postId }) => {
  const { data, loading } = useCurrentUserQuery()
  const [addComment, commentResult] = useAddCommentMutation()
  const { handleSubmit, getFieldProps, resetForm } = useFormik({
    initialValues: {
      comment: '',
    },
    onSubmit: async ({ comment }) => {
      await addComment({
        variables: { postId, comment },
        update: (cache, { data }) => {
          const fragment = gql`
            fragment __ on Post {
              comments {
                id
                comment
                createdAt
                creator {
                  id
                  firstName
                  lastName
                  username
                  onlineStatus
                  lastSeen
                  avatar_url
                }
              }
            }
          `
          const existingComments: PaginatedComments | null = cache.readFragment<PaginatedComments>({
            id: `Post:${postId}`,
            fragment,
          })

          cache.writeFragment({
            fragment,
            id: `Post:${postId}`,
            data: { comments: [...(existingComments?.comments || []), data?.addComment!] },
          })
          cache.evict({
            fieldName: `paginatedComments:{"postId":${postId}}`,
          })
        },
      })
      resetForm()
    },
  })

  if (!data?.currentUser && !loading) {
    return null
  }
  return (
    <Box display="flex" p={2}>
      <Box mr={2}>
        <Avatar
          component={Link}
          href={`/${data?.currentUser?.username}`}
          src={data?.currentUser?.avatar_url!}
        />
      </Box>
      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <TextField
          placeholder="Write a comment ..."
          fullWidth
          variant="outlined"
          size="small"
          disabled={commentResult.loading}
          {...getFieldProps('comment')}
        />
      </form>
    </Box>
  )
}

export default AddComment
