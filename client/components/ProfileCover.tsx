import { gql } from '@apollo/client'
import { Box, CircularProgress, IconButton, Button, MenuItem, Menu } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import clsx from 'clsx'
import { DotsVertical } from 'heroicons-react'
import React, { useState } from 'react'
import {
  RegularUserFragment,
  useAddCoverMutation,
  useCurrentUserQuery,
  useRemoveCoverMutation,
} from '../generated/graphql'
import useMenu from '../lib/hooks/useMenu'

const useStyles = makeStyles((theme) => ({
  gradient: {
    background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))',
  },
  loading: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    width: '100%',
    backgroundColor: `rgba(0,0,0,${theme.palette.type === 'dark' ? '0.6' : '0.3'})`,
  },
  coverImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
}))

interface ProfileCoverProps {
  user: RegularUserFragment
}

const ProfileCover: React.FC<ProfileCoverProps> = ({ user }) => {
  const { data: currentUser } = useCurrentUserQuery()

  const classes = useStyles()

  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.down('md'))

  const { anchorEl, handleClick, handleClose } = useMenu()

  const [file, setFile] = useState<File | null>()
  const [upload, { loading: uploadLoading }] = useAddCoverMutation({
    variables: { file },
    update: (cache, { data }) => {
      cache.writeFragment({
        fragment: gql`
          fragment __ on User {
            cover_url
          }
        `,
        id: 'User:' + currentUser?.currentUser?.id!,
        data: { cover_url: data?.addCover },
      })
    },
  })

  const [removeCover, { loading: removeLoading }] = useRemoveCoverMutation({
    update: (cache) => {
      cache.writeFragment({
        fragment: gql`
          fragment __ on User {
            cover_url
          }
        `,
        id: 'User:' + currentUser?.currentUser?.id!,
        data: { cover_url: '' },
      })
    },
  })
  if (!user) {
    return null
  }

  return (
    <Box width="100%">
      <Box className={classes.coverImage}>
        {user.cover_url && (
          <img src={user?.cover_url!} style={{ width: '100%', height: 'auto' }} alt="" />
        )}
      </Box>
      {uploadLoading || removeLoading ? (
        <Box className={classes.loading}>
          <CircularProgress />
        </Box>
      ) : null}
      <Box
        height="50px"
        className={clsx({
          [classes.gradient]: !user.cover_url,
        })}
        display="flex"
        justifyContent="flex-end"
        px={4}
      >
        {currentUser?.currentUser?.id === user.id && (
          <Box>
            {md && (
              <IconButton onClick={handleClick} color="primary">
                <DotsVertical />
              </IconButton>
            )}
            {currentUser.currentUser.cover_url ? (
              <>
                <Menu
                  open={!!anchorEl}
                  keepMounted={false}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                >
                  <MenuItem component="label" onClick={handleClose}>
                    Change cover
                    <input
                      type="file"
                      hidden
                      onChange={async (e: any) => {
                        const isFile = e.currentTarget.files?.length !== 0 || undefined
                        if (isFile) {
                          setFile(e.currentTarget.files[0])
                          await upload({ variables: { file: e.target.files[0] } })
                        }
                      }}
                    />
                  </MenuItem>
                  <MenuItem
                    onClick={async () => {
                      handleClose()
                      await removeCover()
                    }}
                  >
                    Remove Cover
                  </MenuItem>
                </Menu>
                <Box hidden={md}>
                  <Box display="inline-block" mr={2}>
                    <Button color="primary" component="label" variant="contained" size="small">
                      Change Cover
                      <input
                        type="file"
                        hidden
                        onChange={async (e: any) => {
                          const isFile = e.currentTarget.files?.length !== 0 || undefined
                          if (isFile) {
                            setFile(e.currentTarget.files[0])
                            await upload({ variables: { file: e.target.files[0] } })
                          }
                        }}
                      />
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={async () => {
                      await removeCover()
                    }}
                  >
                    Remove cover
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box hidden={md}>
                  <Button component="label" variant="contained">
                    Add Cover
                    <input
                      type="file"
                      hidden
                      onChange={async (e: any) => {
                        const isFile = e.target.files?.length !== 0 || undefined
                        if (isFile) {
                          await upload({ variables: { file: e.target.files[0] } })
                        }
                      }}
                    />
                  </Button>
                </Box>
                <Menu
                  keepMounted={false}
                  open={!!anchorEl}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                >
                  <MenuItem component="label">
                    Add cover
                    <input
                      type="file"
                      hidden
                      onChange={async (e: any) => {
                        const isFile = e.currentTarget.files?.length !== 0 || undefined
                        if (isFile) {
                          setFile(e.currentTarget.files[0])
                          await upload({ variables: { file: e.target.files[0] } })
                          handleClose()
                        }
                      }}
                    />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ProfileCover
