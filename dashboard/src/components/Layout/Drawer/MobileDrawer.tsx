import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
} from '@chakra-ui/react'
import React from 'react'
import { FaBuffer } from 'react-icons/fa'
import useLayoutStore from '../../../store/layoutStore'
import DrawerList from './DrawerList'

const MobileDrawer: React.FC = () => {
  const isOpen = useLayoutStore((state) => state.drawerIsOpen)
  const onClose = useLayoutStore((state) => state.onDrawerClose)

  return (
    <Drawer size="full" isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton align="flex-end" />
        <Flex p={4} direction="row" align="center">
          <HStack spacing={2}>
            <Box>
              <FaBuffer size="25px" />
            </Box>
            <Heading flexGrow={1} size="md">
              Logo
            </Heading>
          </HStack>
        </Flex>

        <DrawerBody p={0}>
          <Flex
            direction="column"
            align="center"
            flexDirection="column"
            w="100%"
          >
            <DrawerList />
          </Flex>
        </DrawerBody>

        <DrawerFooter>
          <Flex justify="center" align="flex-end" flex={2}>
            v.0.01
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileDrawer
