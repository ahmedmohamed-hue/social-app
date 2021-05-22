import { Box, Button, Flex, Text, useMediaQuery } from '@chakra-ui/react'
import React from 'react'
import {
  Link as RouterLink,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'
import { devices } from '../../../constants'
import { useMeQuery } from '../../../generated/graphql'
import useLayoutStore from '../../../store/layoutStore'
import routes from '../../../routes/routesList'

const DrawerList: React.FC = () => {
  const onClose = useLayoutStore((state) => state.onDrawerClose)
  const [mobile] = useMediaQuery(devices.mobile)

  const location = useLocation()
  const { path } = useRouteMatch()

  const { data } = useMeQuery()
  const isOpen = useLayoutStore((state) => state.drawerIsOpen)
  return (
    <>
      {routes.map(
        (route, index) =>
          (route.premission.length === 0 ||
            route.premission.some((role) => role === data?.me?.role)) && (
            <Button
              key={index}
              as={RouterLink}
              to={`${path}${route.path}`}
              my={2}
              w="100%"
              onClick={mobile ? onClose : undefined}
              borderRadius={0}
              variant={
                location.pathname === path + route.path ? 'solid' : 'ghost'
              }
              colorScheme={
                location.pathname === path + route.path ? 'telegram' : undefined
              }
            >
              {isOpen ? (
                <Flex
                  w="100%"
                  justify="start"
                  align="center"
                  position="relative"
                >
                  <Box position="absolute" left={0}>
                    {route.icon}
                  </Box>
                  <Text ml="36px"> {route.name}</Text>
                </Flex>
              ) : (
                <Flex w="auto" justify="center" position="relative">
                  {route.icon}
                </Flex>
              )}
            </Button>
          )
      )}
    </>
  )
}

export default DrawerList
