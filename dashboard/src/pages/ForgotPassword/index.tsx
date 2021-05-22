import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FlexProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { HTMLMotionProps, motion, Variants } from 'framer-motion'
import React, { useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { useForgotPasswordMutation } from '../../generated/graphql'
import { Helmet } from 'react-helmet'

const variants: Variants = {
  enter: {
    opacity: 0,
  },
  active: {
    y: 0,
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

type Merge<P, T> = Omit<P, keyof T> & T
type MotionFlexProps = Merge<FlexProps, HTMLMotionProps<'div'>>
export const MotionFlex: React.FC<MotionFlexProps> = motion(Flex)

const ForgotPassword: React.FC = () => {
  const containerBg = useColorModeValue('gray.50', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')

  const [email, setEmail] = useState('')

  const history = useHistory()

  const [forgotPassword, { error, loading, data }] = useForgotPasswordMutation({
    variables: { email },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await forgotPassword()
      await new Promise((res) =>
        setTimeout(() => {
          history.push('/')
          res()
        }, 2000)
      )
    } catch (e) {}
  }

  return (
    <>
      <Helmet>
        <title>Forgot password</title>
      </Helmet>
      <MotionFlex
        variants={variants}
        overflow="hidden"
        initial="enter"
        animate="active"
        exit="exit"
        w="full"
        minH="100vh"
        align="center"
        justify="center"
        px={4}
        bg={containerBg}
      >
        <Box boxShadow="lg" borderRadius="lg" bg={cardBg} p={6} maxW="lg">
          <form onSubmit={handleSubmit}>
            <Heading fontSize="xl">Reset Password</Heading>
            <Text mt={2} fontSize="md" color={'gray'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit
              amet erat non libero semper posuere ut nec orci.
            </Text>
            <VStack mt={4} spacing={4}>
              <FormControl
                border={data?.forgotPassword ? 'green' : undefined}
                id="email"
                isInvalid={!!error}
                isRequired
              >
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  disabled={loading || data?.forgotPassword}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  type="email"
                />

                <FormErrorMessage>{error?.message}</FormErrorMessage>
                {data?.forgotPassword && (
                  <Text fontSize="sm" mt={2} color="green">
                    Email sent successfully
                  </Text>
                )}
              </FormControl>
              <Button
                type="submit"
                colorScheme="telegram"
                variant="solid"
                w="full"
                disabled={loading || data?.forgotPassword}
              >
                {loading ? (
                  <CircularProgress size="1.33em" isIndeterminate />
                ) : (
                  'Submit'
                )}
              </Button>
            </VStack>
          </form>
        </Box>
        <BackButton />
      </MotionFlex>
    </>
  )
}

const BackButton: React.FC = () => {
  const history = useHistory()

  return (
    <IconButton
      aria-label="Go back"
      position="absolute"
      top="4"
      left="4"
      size="lg"
      rounded="full"
      onClick={() => {
        history.goBack()
      }}
    >
      <FaArrowLeft />
    </IconButton>
  )
}

export default ForgotPassword
