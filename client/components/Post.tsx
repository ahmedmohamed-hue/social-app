import { gql } from '@apollo/client'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ChatOutline, DotsHorizontalOutline, Heart, HeartOutline } from 'heroicons-react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
  Post as PostType,
  PostsDocument,
  PostsQuery,
  useDeletePostMutation,
  useLikeMutation,
} from '../generated/graphql'
import isRTL from '../lib/isRTL'
import Link from './Link'
import DeleteModal from './Modals/DeleteConfirmModal'
import useModal from './useModal'

dayjs.extend(relativeTime)

const useStyles = makeStyles((theme) => ({
  paper: {
    // minWidth: '500px',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}))

interface PostProps {
  post?: PostType
  refetch?: any
  isUser: boolean
}

const Post: React.FC<PostProps> = ({ post, refetch, isUser }) => {
  const classes = useStyles()
  const formattedDate = dayjs(parseInt(post?.createdAt!)).fromNow()

  const router = useRouter()
  const [props, handleOpen] = useModal()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [like] = useLikeMutation({
    update: (cache, { data }) => {
      cache.writeFragment({
        id: 'Post:' + post?.id!,
        fragment: gql`
          fragment __ on Post {
            likeStatus
            likes
          }
        `,
        data: { likeStatus: data?.like?.likeStatus, likes: data?.like?.likes },
      })
    },
    variables: {
      postId: parseFloat(String(post?.id!)),
      value: !post?.likeStatus!,
    },
  })

  const [deletePost] = useDeletePostMutation({
    variables: {
      id: post?.id!,
    },
  })

  const handleDelete = () => {
    deletePost({
      update: async (cache) => {
        const oldPosts = cache.readQuery<PostsQuery>({ query: PostsDocument })
        const newPosts = oldPosts?.getAllPosts.filter((p) => p.id !== post?.id!)

        cache.writeQuery<PostsQuery>({
          query: PostsDocument,
          data: { getAllPosts: [...newPosts!] },
        })
        if (router.pathname !== '/' && !router.pathname.includes('/post')) {
          await refetch()
        }
      },
    })
      .then(() => {
        handleClose()
        if (router.pathname.includes('/post')) {
          router.push('/')
        }
      })
      .catch(console.log)
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    console.log(post?.owner)
  }

  if (!post) {
    return null
  }

  console.log(post.creator)

  return (
    <Paper className={classes.paper}>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Link href={`/${post.creator.username}`}>
            <Avatar src={post.creator.avatar_url!} className={classes.avatar} />
          </Link>
          <Box>
            <Typography variant="h6" color="textPrimary">
              {post.creator.firstName} {post.creator.lastName}
            </Typography>
            <Link href={`/post/${post.id}`}>
              <Typography variant="body2" color="textSecondary">
                {formattedDate}
              </Typography>
            </Link>
          </Box>
        </Box>
        <IconButton onClick={handleClick}>
          <DotsHorizontalOutline />
        </IconButton>
      </Box>
      <Menu anchorEl={anchorEl} keepMounted={false} open={Boolean(anchorEl)} onClose={handleClose}>
        {post.owner ? <MenuItem onClick={handleOpen}>Delete</MenuItem> : null}
        <MenuItem>Open in new tab</MenuItem>
      </Menu>
      <Divider />
      <Box p={2} textAlign={isRTL(post.title) ? 'right' : 'left'}>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1">{post.body}</Typography>
      </Box>
      <Divider />
      <Box display="flex" alignItems="center" pl={1} pb={1}>
        <IconButton
          disabled={!isUser}
          onClick={async () => {
            await like()
          }}
        >
          {post.likeStatus ? <Heart color="red" /> : <HeartOutline color="red" />}
        </IconButton>
        <Typography variant="subtitle2" color="textSecondary">
          {post.likes}
        </Typography>
        <Box display="flex" alignItems="center" ml={1}>
          <IconButton>
            <ChatOutline />
          </IconButton>
          <Typography variant="subtitle2" color="textSecondary">
            0
          </Typography>
        </Box>
      </Box>
      <DeleteModal
        {...props}
        action={handleDelete}
        message="are you sure want you don't delete your post?"
      />
    </Paper>
  )
}

export default Post
