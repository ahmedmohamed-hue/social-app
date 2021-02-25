import { gql } from '@apollo/client'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Pencil } from 'heroicons-react'
import React, { Fragment, useState } from 'react'
import DeleteConfirmModal from './Modals/DeleteConfirmModal'
import ProfileAvtarModal from './Modals/ProfileAvatarModal'
import useMenu from '../lib/hooks/useMenu'
import useModal from '../lib/hooks/useModal'
import {
  CurrentUserFragment,
  RegularUserFragment,
  useRemoveAvatarMutation,
} from '../generated/graphql'

const useStyles = makeStyles((theme) => ({
  avatarBox: {
    position: 'absolute',
    bottom: -theme.spacing(6),
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderRadius: '50%',
  },
  badge: {
    position: 'absolute',
    bottom: theme.spacing(-1),
    right: theme.spacing(-1),
    zIndex: 10000,
    '&:hover': {
      backgroundColor: 'inherit',
    },
  },
  avatar: {
    width: '100%',
    height: theme.spacing(16),
    border: `solid 3px ${theme.palette.primary.main}`,
  },
}))

interface ProfilePictureProps {
  currentUser: CurrentUserFragment
  user: RegularUserFragment
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ currentUser, user }) => {
  const classes = useStyles()
  const { anchorEl, handleClick, handleClose } = useMenu()
  const [props, handleOpen] = useModal()
  const [deleteProps, handleDeleteOpen] = useModal()
  const [image, setImage] = useState<any>(null)

  const [removeAvatar] = useRemoveAvatarMutation({
    update: (cache) => {
      cache.writeFragment({
        id: 'User:' + currentUser.id,
        fragment: gql`
          fragment __ on User {
            avatar_url
          }
        `,
        data: { avatar_url: '' },
      })
    },
  })

  const handleRemove = async () => {
    handleClose()
    await removeAvatar()
    props.handleClose()
  }

  const onChange = (e: any) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as any)
    }
    reader.readAsDataURL(files[0])
    handleOpen()
  }

  return (
    <Box className={classes.avatarBox}>
      <Box position="relative">
        {currentUser?.id === user.id ? (
          <Fragment>
            <IconButton onClick={handleClick} className={classes.badge}>
              <Avatar>
                <Pencil />
              </Avatar>
            </IconButton>

            {user.avatar_url ? (
              <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem component="label" onClick={handleClose}>
                  Change avatar <input hidden onChange={onChange} type="file" accept="image/*" />
                </MenuItem>
                <MenuItem onClick={handleOpen}>Edit avatar</MenuItem>
                <MenuItem onClick={handleDeleteOpen}>Remove avatar</MenuItem>
                <DeleteConfirmModal
                  {...deleteProps}
                  action={handleRemove}
                  message="Are you sure?"
                />
              </Menu>
            ) : (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component="label" onClick={handleClose}>
                  Add Profile image
                  <input hidden onChange={onChange} type="file" accept="image/*" />
                </MenuItem>
              </Menu>
            )}
            <ProfileAvtarModal
              {...props}
              img={user.avatar_url}
              file={image}
              userId={currentUser.id}
            />
          </Fragment>
        ) : null}
        <Avatar src={user.avatar_url!} className={classes.avatar} />
      </Box>
    </Box>
  )
}

export default ProfilePicture
