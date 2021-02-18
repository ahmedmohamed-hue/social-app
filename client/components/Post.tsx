import {
  Avatar,
  Box,
  Divider,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@material-ui/core'
import dayjs from 'dayjs'
import { ChatOutline, DotsHorizontalOutline, HeartOutline } from 'heroicons-react'
import React, { useState } from 'react'
import {
  GetPostsDocument,
  GetPostsQuery,
  Post as PostType,
  useDeletePostMutation,
} from '../generated/graphql'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from './Link'
import { useRouter } from 'next/router'
import useModal from './useModal'
import DeleteModal from './Modals/DeleteConfirmModal'

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
}

function isRTL(s: string) {
  let ltrChars =
      'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
      '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
    rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
    rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']')

  return rtlDirCheck.test(s)
}

const Post: React.FC<PostProps> = ({ post, refetch }) => {
  const classes = useStyles()

  const [props, handleOpen] = useModal()

  const router = useRouter()

  // const formattedDate = dayjs(parseInt(post?.createdAt!)).format('MMMM DD [at] hh:mmA')
  const formattedDate = dayjs(parseInt(post?.createdAt!)).fromNow()

  const [deletePost] = useDeletePostMutation({
    variables: {
      id: post?.id!,
    },
  })

  const handleDelete = () => {
    deletePost({
      update: async (cache) => {
        const oldPosts = cache.readQuery<GetPostsQuery>({ query: GetPostsDocument })
        const newPosts = oldPosts?.getAllPosts.filter((p) => p.id !== post?.id!)

        cache.writeQuery<GetPostsQuery>({
          query: GetPostsDocument,
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
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

  return (
    <Paper className={classes.paper}>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar src={post.creator.avatar_url!} className={classes.avatar} />
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
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
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
        <IconButton>
          <HeartOutline color="red" />
        </IconButton>
        <Typography variant="subtitle2" color="textSecondary">
          0
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
