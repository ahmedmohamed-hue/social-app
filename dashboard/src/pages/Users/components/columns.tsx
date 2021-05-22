import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
  useToast,
  VStack,
  FormErrorMessage,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import React from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { Column as ColumnType } from 'react-table'
import {
  Role,
  useDeleteUserMutation,
  useEditUserMutation,
  useForgotPasswordMutation,
  UserFragment,
  UserFragmentDoc,
} from '../../../generated/graphql'
import { formatValidationError } from '../../../utils/formatGraphqlErrors'

type Column<D extends object> = ColumnType<D>[]

export interface ColumnProps extends UserFragment {
  actions: any
}

const columns: Column<ColumnProps> = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Display name', accessor: 'displayName' },
  { Header: 'Email', accessor: 'email' },
  {
    Header: 'Role',
    accessor: 'role',
    Cell: ({ value }) => (
      <Badge
        colorScheme={value === Role.Admin ? 'green' : 'pink'}
        px={3}
        py={1}
        borderRadius={999}
      >
        {value}
      </Badge>
    ),
    filter: 'equals',
    id: 'role',
  },
  {
    Header: 'Created At',
    accessor: 'createdAt',
    Cell: ({ value }) => (
      <Text width="full">{dayjs(value).format('llll')}</Text>
    ),
  },
  {
    Header: 'Last update',
    accessor: 'updatedAt',
    Cell: ({ value }) => dayjs(value).format('llll'),
  },
  {
    Header: 'Email Verfied',
    accessor: 'isEmailVerfied',
    Cell: ({ value }) => (
      <Badge
        colorScheme={value ? 'green' : 'red'}
        px={2}
        py={1}
        borderRadius={999}
      >
        {value ? 'verified' : 'not verified'}
      </Badge>
    ),
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    id: 'actions',
    Cell: ({ cell }) => {
      const { email, firstName, role, displayName, lastName, id } = cell.row
        .values as ColumnProps

      const toast = useToast()
      const { isOpen, onOpen, onClose: close } = useDisclosure()

      const [deleteAction, { loading: deleteLoading }] = useDeleteUserMutation({
        variables: { id },
        update: (cache) => {
          cache.evict({ id: 'User:' + id })
        },
      })

      const [forgotPassword] = useForgotPasswordMutation({
        variables: { email },
      })

      const [editAction, { loading: editLoading }] = useEditUserMutation({
        update: (cache, { data }) => {
          cache.writeFragment({
            id: 'User:' + id,
            fragment: UserFragmentDoc,
            data: data?.editUser,
          })
        },
      })

      const {
        handleSubmit,
        getFieldProps,
        setErrors,
        errors,
        resetForm,
      } = useFormik({
        initialValues: {
          firstName,
          lastName,
          displayName,
          email,
          role,
          username: '',
        },
        onSubmit: async (values) => {
          try {
            await editAction({ variables: { ...values, id } })
            toast({
              status: 'success',
              title: 'User updated successfully',
              description: `user with id ${id} has been updated`,
              isClosable: true,
            })
            close!()
          } catch (e) {
            if (e.message === 'Argument Validation Error') {
              setErrors(formatValidationError(e))
              return
            }

            toast({
              status: 'error',
              title: 'Error while updating the user',
              description: `Something went wrong while updating the user`,
              isClosable: true,
            })
          }
        },
      })

      const onClose = () => {
        resetForm()
        close()
      }

      return (
        <>
          <HStack spacing={2}>
            <IconButton
              onClick={onOpen}
              aria-label="Edit User"
              icon={<AiFillEdit />}
            />
            <IconButton
              onClick={async () => {
                try {
                  await deleteAction()
                  toast({
                    status: 'success',
                    title: 'User successfully delete',
                    description: `User with ${id} id has been delete`,
                    isClosable: true,
                  })
                } catch {
                  toast({
                    status: 'error',
                    title: 'Error while deleting user',
                    isClosable: true,
                  })
                }
              }}
              aria-label="Delete User"
              disabled={deleteLoading}
              icon={<AiFillDelete />}
            />
          </HStack>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit user</ModalHeader>
              <ModalCloseButton />
              <form noValidate onSubmit={handleSubmit}>
                <ModalBody>
                  <VStack spacing={4}>
                    <HStack w="full" spacing={4}>
                      <FormControl
                        id="firstName"
                        isInvalid={!!errors.firstName}
                      >
                        <FormLabel>First Name</FormLabel>
                        <Input type="text" {...getFieldProps('firstName')} />
                        <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                      </FormControl>
                      <FormControl id="lastName" isInvalid={!!errors.lastName}>
                        <FormLabel>Last Name</FormLabel>
                        <Input type="text" {...getFieldProps('lastName')} />
                        <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                      </FormControl>
                    </HStack>
                    <FormControl
                      id="displayName"
                      isInvalid={!!errors.displayName}
                    >
                      <FormLabel>Display Name</FormLabel>
                      <Input type="text" {...getFieldProps('displayName')} />
                      <FormErrorMessage>{errors.displayName}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="email" isInvalid={!!errors.email}>
                      <FormLabel>Email address</FormLabel>
                      <Input type="email" {...getFieldProps('email')} />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      id="username"
                      isInvalid={!!errors.username}
                    >
                      <FormLabel>Username</FormLabel>
                      <Input type="email" {...getFieldProps('username')} />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="role" isInvalid={!!errors.role}>
                      <FormLabel>Role</FormLabel>
                      <Select {...getFieldProps('role')}>
                        <option value={Role.User}>User</option>
                        <option value={Role.Admin}>Admin</option>
                      </Select>
                      <FormErrorMessage>{errors.role}</FormErrorMessage>
                    </FormControl>
                    <FormControl my={2} id="role">
                      <Button
                        colorScheme="red"
                        onClick={async () => {
                          await forgotPassword()
                          toast({
                            status: 'success',
                            title: 'Email sent',
                            description: `Password reset email has been sent to ${email} successfully`,
                            isClosable: true,
                          })
                        }}
                      >
                        Reset password
                      </Button>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    disabled={editLoading}
                    colorScheme="telegram"
                    type="submit"
                  >
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </>
      )
    },
  },
]

export default columns
