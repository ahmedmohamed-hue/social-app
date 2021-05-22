import { Center, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'
import { Helmet } from 'react-helmet'
import { IoIosClose } from 'react-icons/io'

const ServerDown: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Server down</title>
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
          spacing={4}
        >
          <Center p={1} bg="red.500" borderRadius="50%">
            <IoIosClose color="white" size="2em" />
          </Center>
          <Text color="gray" fontWeight="bold">
            Oh no! looks like the server is down.
          </Text>
        </VStack>
      </Center>
    </>
  )
}

export default ServerDown
