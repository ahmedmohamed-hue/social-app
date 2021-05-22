import { useApolloClient } from '@apollo/client'
import { Divider, Flex, HStack, Spacer, Text } from '@chakra-ui/layout'
import {
  Avatar,
  Box,
  Center,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FaBars, FaBell } from 'react-icons/fa'
import { IoIosArrowDown, IoMdSettings, IoMdExit } from 'react-icons/io'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'
import { devices } from '../../constants'
import { useLogoutMutation, useMeQuery } from '../../generated/graphql'
import useLayoutStore from '../../store/layoutStore'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import routes from '../../routes/routesList'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const history = useHistory()
  const location = useLocation()
  const match = useRouteMatch()

  const { data } = useMeQuery()
  const [logout] = useLogoutMutation()
  const apolloClient = useApolloClient()

  const [tablet] = useMediaQuery(devices.tablet)

  const toggleDrawer = useLayoutStore((state) => state.toggleDrawer)

  return (
    <Flex
      align="center"
      w="100%"
      p={2}
      bg={useColorModeValue('white', 'gray.700')}
    >
      <IconButton
        display={['flex', 'none']}
        aria-label="drawer button"
        onClick={toggleDrawer}
      >
        <FaBars />
      </IconButton>
      <Heading display={['none', 'block']} size="md" ml={3}>
        {routes.map(
          (route) => match.path + route.path === location.pathname && route.name
        )}
      </Heading>
      <Spacer />
      <Flex>
        <HStack spacing={2}>
          <Box pos="relative" mr={2}>
            <FaBell size="25px" />
            <Flex
              pos="absolute"
              top={-1.5}
              right={-0.5}
              w={3}
              h={3}
              rounded="full"
              bg={useColorModeValue('#E53E3E', '#E53E3E')}
              justify="center"
              align="center"
              fontSize="9px"
              fontWeight="bold"
              textAlign="center"
            />
          </Box>
          <Box display={['none', 'none', 'block']}>
            <Avatar
              size="sm"
              bg="teal.500"
              color="white"
              name={data?.me?.displayName}
            />
          </Box>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Dropdown options"
              icon={
                <HStack spacing={[0, 0, 2]} px={[0, 0, 2]}>
                  <Text display={['none', 'none', 'block']}>
                    {data?.me?.displayName}
                  </Text>
                  <IoIosArrowDown />
                </HStack>
              }
              rounded={{ base: 'base', sm: 'full', xs: 'full' }}
            >
              {tablet && data?.me?.displayName}
            </MenuButton>
            <MenuList pt={0}>
              <Center w="100%">
                <Box
                  display={['block', 'block', 'none']}
                  py={2}
                  px={3}
                  w="full"
                >
                  <VStack spacing={2}>
                    <Avatar
                      bg="teal.500"
                      color="white"
                      name={data?.me?.displayName}
                      size="md"
                    />
                    <Text>{data?.me?.displayName}</Text>
                  </VStack>
                </Box>
              </Center>
              <Divider />
              <MenuItem isDisabled icon={<IoMdSettings size="1.5em" />}>
                Settings
              </MenuItem>
              <MenuItem
                icon={<IoMdExit size="1.5em" />}
                onClick={async () => {
                  try {
                    history.push('/login')
                    await logout()
                    await apolloClient.resetStore()
                  } catch (e) {}
                }}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
          <ColorModeSwitcher ml={0} />
        </HStack>
      </Flex>
    </Flex>
  )
}

export default Navbar
