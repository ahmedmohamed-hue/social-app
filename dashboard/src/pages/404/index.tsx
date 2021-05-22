import { Center, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link as RouterLink } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <Center
        minH="100vh"
        w="full"
        bg={useColorModeValue('gray.100', 'gray.800')}
      >
        <VStack
          flexDir="column"
          justify="center"
          align="center"
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'md'}
          minW="lg"
          p={8}
        >
          <Text color={useColorModeValue('red.300', 'red.500')} fontSize="2xl">
            404
          </Text>
          <Text
            mt={2}
            color={useColorModeValue('gray.400', 'gray.100')}
            fontWeight="400"
          >
            Whooops! you reached a not found page.
          </Text>
          <Link as={RouterLink} to="/" color="blue.300">
            Go back home
          </Link>
        </VStack>
      </Center>
    </>
  )
}

export default NotFound
