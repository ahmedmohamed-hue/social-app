import {
  Box,
  Button,
  Checkbox,
  Flex,
  FlexProps,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { HTMLMotionProps, motion, Variants } from 'framer-motion'
import React from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { MeDocument, MeQuery, useLoginMutation } from '../../generated/graphql'
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

const Login: React.FC = () => {
  const history = useHistory()

  const [login, { error }] = useLoginMutation({
    update: (cache, { data }) => {
      cache.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          me: data?.login,
        },
      })
    },
  })

  const { handleSubmit, getFieldProps, isSubmitting } = useFormik({
    initialValues: {
      usernameOrEmail: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        await login({ variables: values })
        history.push('/dashboard')
      } catch (e) {}
    },
  })

  return (
    <>
      <Helmet>
        <title>Login</title>
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
        <Stack
          overflow="hidden"
          spacing={8}
          mx={'auto'}
          maxW={'lg'}
          py={12}
          px={6}
        >
          <Stack align={'center'}>
            <Heading textAlign="center" fontSize={'4xl'}>
              Sign in to your account
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <Link color={'blue.400'}>features</Link>{' '}
              ✌️
            </Text>
          </Stack>
          <Box
            overflowY="hidden"
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
          >
            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input {...getFieldProps('usernameOrEmail')} type="email" />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    isInvalid={!!error}
                    {...getFieldProps('password')}
                    type="password"
                  />
                </FormControl>
                {error && <Text color="red.500">{error.message}</Text>}
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <Link
                      as={RouterLink}
                      to="/forgot-password"
                      color={'blue.400'}
                    >
                      Forgot password?
                    </Link>
                  </Stack>
                  <Button
                    bg={'teal.600'}
                    color={'white'}
                    type="submit"
                    disabled={isSubmitting}
                    _hover={{
                      bg: 'teal.500',
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </MotionFlex>
    </>
  )
}

export default Login
