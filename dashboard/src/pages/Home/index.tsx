import { Flex, VStack } from '@chakra-ui/react'
import * as React from 'react'
import { Logo } from '../../components/Logo'
import { Helmet } from 'react-helmet'

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Flex
        justify="center"
        align="center"
        textAlign="center"
        height="100%"
        width="100%"
        fontSize="xl"
      >
        <VStack spacing={8}>
          <Logo alt="Chakra logo" h="40vmin" pointerEvents="none" />
        </VStack>
      </Flex>
    </>
  )
}

export default Home
