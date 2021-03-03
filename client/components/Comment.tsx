import { Avatar, Box, IconButton, makeStyles, MenuItem, Typography } from '@material-ui/core'
import { Comment as CommentType, useRemoveCommentMutation } from '../generated/graphql'
import React, { useState } from 'react'
import { grey } from '@material-ui/core/colors'
import dayjs from 'dayjs'
import Link from './Link'
import { DotsHorizontal } from 'heroicons-react'
import useMenu from '../lib/hooks/useMenu'
import Menu from '@material-ui/core/Menu'
import useModal from '../lib/hooks/useModal'
import DeleteModal from './Modals/DeleteConfirmModal'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.type === 'dark' ? grey[700] : grey[200],
    display: 'flex',
    width: '100%',
    borderRadius: 15,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  name: {
    fontWeight: 500,
  },
  date: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
}))

interface CommentProps {
  comment: CommentType
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const classes = useStyles()
  const [show, setShow] = useState(false)

  const [removeComment] = useRemoveCommentMutation({
    update: (cache) => {
      cache.evict({ id: 'Comment:' + comment.id })
    },
    variables: { commentId: comment.id },
  })
  const { anchorEl, handleClick, handleClose } = useMenu()
  const [props, handleOpen] = useModal()

  const handleDelete = async () => {
    await removeComment()

    props.handleClose()
  }
  const enhancedOpen = () => {
    handleClose()
    handleOpen()
  }

  const formattedDate = dayjs(comment.createdAt).fromNow()

  return (
    <Box
      display="flex"
      mt={1.5}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Box mr={2}>
        <Avatar
          component={Link}
          href={`/${comment.creator.username}`}
          src={comment.creator.avatar_url!}
        />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box display="flex">
          <Box className={classes.root}>
            <Box display="flex" flexDirection="column">
              <Typography
                className={classes.name}
                component={Link}
                href={`/${comment.creator.username}`}
                variant="body1"
                naked
              >
                {comment.creator.firstName} {comment.creator.lastName}
              </Typography>
              <Typography variant="body2">{comment.comment}</Typography>
            </Box>
          </Box>
          {comment.owner && show && (
            <Box ml={1} display="flex" alignItems="center">
              <IconButton onClick={handleClick}>
                <DotsHorizontal />
              </IconButton>
              <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                <MenuItem onClick={enhancedOpen}>Delete</MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
        <Box>
          <Typography variant="caption" className={classes.date}>
            {formattedDate}
          </Typography>
        </Box>
      </Box>
      <DeleteModal
        {...props}
        message="Are you are you want to delete your comment ?"
        action={handleDelete}
      />
    </Box>
  )
}

export default Comment
