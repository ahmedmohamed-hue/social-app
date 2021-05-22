import { useColorModeValue } from '@chakra-ui/color-mode'
import { Box, Flex, Heading } from '@chakra-ui/layout'
import { IconButton, useMediaQuery } from '@chakra-ui/react'
import React from 'react'
import { FaBuffer } from 'react-icons/fa'
import { IoIosArrowForward } from 'react-icons/io'
import { devices } from '../../../constants'
import useLayoutStore from '../../../store/layoutStore'
import DrawerList from './DrawerList'
import MobileDrawer from './MobileDrawer'

interface DrawerProps {}

const Drawer: React.FC<DrawerProps> = () => {
  const [mobile] = useMediaQuery(devices.mobile)
  const bg = useColorModeValue('white', 'gray.700')

  const isOpen = useLayoutStore((state) => state.drawerIsOpen)
  const toggleDrawer = useLayoutStore((state) => state.toggleDrawer)

  if (mobile) return <MobileDrawer />

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      height="100%"
      bg={bg}
      py={2}
      display="inline-flex"
    >
      <Flex direction="column" justify="start" align="center">
        <Flex direction="row" align="center" mb={10}>
          <Box mr={3} ml={2}>
            <FaBuffer size="20px" />
          </Box>
          {isOpen && (
            <Heading mr={20} size="md">
              Logo
            </Heading>
          )}
          <IconButton
            aria-label="toggle drawer"
            variant="ghost"
            size="sm"
            onClick={toggleDrawer}
          >
            <Box
              transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
              transition="transform 0.5s"
            >
              <IoIosArrowForward />
            </Box>
          </IconButton>
        </Flex>
        <Flex direction="column" align="center" flexDirection="column" w="100%">
          <DrawerList />
        </Flex>
      </Flex>
      <Flex justify="center" align="flex-end">
        v.0.01
      </Flex>
    </Flex>
  )
}

export default Drawer
