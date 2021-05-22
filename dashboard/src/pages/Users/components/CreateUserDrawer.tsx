import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Select,
  UseDisclosureProps,
  VStack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import React from 'react'
import {
  Role,
  useCreateUserMutation,
  UsersDocument,
  UsersQuery,
} from '../../../generated/graphql'
import { formatValidationError } from '../../../utils/formatGraphqlErrors'

interface CreateUserDrawerProps extends UseDisclosureProps {}

const CreateUserDrawer: React.FC<CreateUserDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const toast = useToast()

  const [action] = useCreateUserMutation({
    update: (cache, { data }) => {
      const existingUsers = cache.readQuery({
        query: UsersDocument,
      }) as UsersQuery
      cache.writeQuery({
        query: UsersDocument,
        data: { users: [...existingUsers.users, data?.createUser] },
      })
      cache.evict({ fieldName: 'users:{}' })
    },
  })

  const {
    handleSubmit,
    getFieldProps,
    isSubmitting,
    resetForm,
    setErrors,
    errors,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      displayName: '',
      username: '',
      email: '',
      password: '',
      role: Role.User,
      sendEmail: true,
    },
    onSubmit: async (values) => {
      try {
        await action({ variables: { ...values } })
        resetForm()
        onClose!()
      } catch (e) {
        if (e.message === 'Argument Validation Error') {
          setErrors(formatValidationError(e))
          return
        }

        toast({
          status: 'error',
          title: 'Something went wrong while creating user',
          isClosable: true,
          position: 'bottom-left',
        })
      }
    },
  })
  return (
    <Drawer isOpen={isOpen!} placement="right" size="md" onClose={onClose!}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader fontSize="xl">Create new user</DrawerHeader>
        <form onSubmit={handleSubmit} noValidate>
          <DrawerBody>
            <VStack spacing={4}>
              <HStack w="full" spacing={4}>
                <FormControl
                  isRequired
                  id="firstName"
                  isInvalid={!!errors.firstName}
                >
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" {...getFieldProps('firstName')} />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  id="lastName"
                  isInvalid={!!errors.lastName}
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" {...getFieldProps('lastName')} />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
              </HStack>
              <FormControl id="displayName" isInvalid={!!errors.displayName}>
                <FormLabel>Display Name</FormLabel>
                <Input type="text" {...getFieldProps('displayName')} />
                <FormHelperText>
                  Default is combining first name and last name
                </FormHelperText>
                <FormErrorMessage>{errors.displayName}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired id="email" isInvalid={!!errors.email}>
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
              <FormControl
                isRequired
                id="password"
                isInvalid={!!errors.password}
              >
                <FormLabel>Password</FormLabel>
                <Input type="password" {...getFieldProps('password')} />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl id="role" isInvalid={!!errors.role}>
                <FormLabel>Role</FormLabel>
                <Select {...getFieldProps('role')}>
                  <option value={Role.User}>User</option>
                  <option value={Role.Admin}>Admin</option>
                </Select>
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Options</FormLabel>
                <VStack
                  w="full"
                  justify="flex-start"
                  align="flex-start"
                  spacing={2}
                >
                  <Checkbox defaultChecked {...getFieldProps('sendEmail')}>
                    Send email verification
                  </Checkbox>
                  <Checkbox isDisabled>Send mobile verification</Checkbox>
                </VStack>
              </FormControl>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              variant="solid"
              colorScheme="telegram"
              type="submit"
            >
              Create
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateUserDrawer
