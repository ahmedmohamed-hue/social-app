import {
  Button,
  Center,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { HTMLMotionProps, motion, Variants } from 'framer-motion'
import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { useHistory, useParams } from 'react-router-dom'
import {
  MeDocument,
  MeQuery,
  useIsValidResetPasswordTokenQuery,
  useResetPasswordMutation,
} from '../../generated/graphql'
import { Helmet } from 'react-helmet'

type Merge<P, T> = Omit<P, keyof T> & T
type MotionFlexProps = Merge<FlexProps, HTMLMotionProps<'div'>>
export const MotionFlex: React.FC<MotionFlexProps> = motion(Flex)

const variants: Variants = {
  enter: {
    opacity: 0,
  },
  active: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const ResetPassword: React.FC = () => {
  const history = useHistory()
  const { token } = useParams()

  const [resetPassword, { error }] = useResetPasswordMutation({
    update: (cache, { data }) => {
      cache.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          me: data?.resetPassword,
        },
      })
    },
  })

  const {
    handleSubmit,
    getFieldProps,
    isSubmitting,
    setFieldError,
    errors,
  } = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    onSubmit: async (values) => {
      if (values.confirmNewPassword !== values.newPassword) {
        setFieldError('confirmNewPassword', "Passwords doesn't match")
        return
      }
      try {
        await resetPassword({
          variables: { token, newPassword: values.newPassword },
        })
        history.push('/dashboard')
      } catch (e) {}
    },
  })

  return (
    <>
      <Helmet>
        <title>Reset password</title>
      </Helmet>
      <MotionFlex
        variants={variants}
        initial="enter"
        overflowY="hidden"
        animate="active"
        exit="exit"
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Flex
          overflowY="hidden"
          flexDir="column"
          justify="center"
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'md'}
          minW="lg"
          p={8}
        >
          <Heading fontSize={'2xl'} mb={4}>
            Reset Password
          </Heading>
          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={4}>
              <FormControl id="newPassword">
                <FormLabel>New password</FormLabel>
                <Input {...getFieldProps('newPassword')} type="password" />
              </FormControl>
              <FormControl
                id="confirmNewPassword"
                isInvalid={!!errors.confirmNewPassword}
              >
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  {...getFieldProps('confirmNewPassword')}
                  type="password"
                />
                <FormErrorMessage>{errors.confirmNewPassword}</FormErrorMessage>
              </FormControl>
              {error && <Text color="red.500">{error.message}</Text>}
              <Button
                bg={'teal.600'}
                color={'white'}
                type="submit"
                disabled={isSubmitting}
                _hover={{
                  bg: 'teal.500',
                }}
              >
                Reset password
              </Button>
            </Stack>
          </form>
        </Flex>
      </MotionFlex>
    </>
  )
}

const ResetPasswordContainer: React.FC = () => {
  const { token } = useParams()

  const bg = useColorModeValue('white', 'gray.700')
  const iconBg = useColorModeValue('gray.100', 'gray.800')

  const { data, loading, error } = useIsValidResetPasswordTokenQuery({
    variables: { token },
  })

  if (loading) return null

  if (!data?.isValidResetPasswordToken || error)
    return (
      <>
        <Helmet>
          <title>Expired link</title>
        </Helmet>
        <Center minH="100vh">
          <Flex
            overflowY="hidden"
            flexDir="column"
            justify="center"
            rounded={'lg'}
            boxShadow={'md'}
            bg={bg}
            minW="lg"
            p={8}
          >
            <VStack justify="center" spacing={4}>
              <Center w="full">
                <Center p={2} bg={iconBg} rounded="full">
                  <IoMdClose color="red" size="1.6em" />
                </Center>
              </Center>
              <Text fontSize="lg">
                Whoops! looks like the link is wrong or expired
              </Text>
            </VStack>
          </Flex>
        </Center>
      </>
    )

  return <ResetPassword />
}
export default ResetPasswordContainer
