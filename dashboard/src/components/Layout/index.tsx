import { useColorModeValue } from '@chakra-ui/color-mode'
import { Flex } from '@chakra-ui/layout'
import React, { FC } from 'react'
import Drawer from './Drawer'
import Navbar from './Navbar'

const Layout: FC = React.memo(({ children }) => (
  <Flex
    flexDir="row"
    maxW="100%"
    bg={useColorModeValue('gray.50', 'gray.800')}
    transition="background 0.2s"
  >
    <Flex minHeight="100vh">
      <Drawer />
    </Flex>
    <Flex flexDir="column" flex={1} overflow="auto">
      <Navbar />
      {children}
    </Flex>
  </Flex>
))

export default Layout
