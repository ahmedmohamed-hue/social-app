import { Avatar, Box, Divider, IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import dayjs from 'dayjs'
import { ChatOutline, DotsHorizontalOutline, HeartOutline } from 'heroicons-react'
import React from 'react'
import { Post as PostType, User } from '../generated/graphql'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from './Link'

dayjs.extend(relativeTime)

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '500px',
    marginBottom: theme.spacing(2),
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}))

interface PostProps {
  post?: {
    __typename?: 'Post' | undefined
  } & Pick<PostType, 'body' | 'title' | 'id' | 'createdAt' | 'creatorId'> & {
      creator: {
        __typename?: 'User' | undefined
      } & Pick<User, 'username' | 'firstName' | 'lastName'>
    }

  user?: User | undefined
}

function isRTL(s: string) {
  let ltrChars =
      'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
      '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
    rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
    rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']')

  return rtlDirCheck.test(s)
}

const Post: React.FC<PostProps> = ({ post, user }) => {
  const classes = useStyles()

  // const formattedDate = dayjs(parseInt(post?.createdAt!)).format('MMMM DD [at] hh:mmA')
  const formattedDate = dayjs(parseInt(post?.createdAt!)).fromNow()
  const owner = user?.id === post?.creatorId

  return (
    <Paper className={classes.paper}>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar
            src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"
            className={classes.avatar}
          />
          <Box>
            <Typography variant="h6" color="textPrimary">
              {post?.creator?.firstName} {post?.creator?.lastName} {owner ? '(Owner)' : null}
            </Typography>
            <Link href={`/post/${post?.id}`}>
              <Typography variant="body2" color="textSecondary">
                {formattedDate}
              </Typography>
            </Link>
          </Box>
        </Box>
        <IconButton>
          <DotsHorizontalOutline />
        </IconButton>
      </Box>
      <Divider />
      <Box p={2} textAlign={isRTL(post?.title!) ? 'right' : 'left'}>
        <Typography variant="h6" gutterBottom>
          {post?.title}
        </Typography>
        <Typography variant="body1">{post?.body}</Typography>
      </Box>
      <Divider />
      <Box></Box>
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
    </Paper>
  )
}

export default Post
