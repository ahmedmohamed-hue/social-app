import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  useDisclosure,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AiFillPrinter } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { HiFilter } from 'react-icons/hi'
import { IoMdAdd, IoMdArrowDropdown } from 'react-icons/io'
import CreateUserDrawer from './CreateUserDrawer'

interface ActionsProps {
  setGlobalFilter: (filterValue: any) => void
}

const Actions: React.FC<ActionsProps> = ({ setGlobalFilter }) => {
  const [filterInput, setFilterInput] = useState('')

  const createUserDrawerDisclosure = useDisclosure()

  const searchInputSize = useBreakpointValue({
    base: 'sm',
    md: 'md',
    lg: 'lg',
    sm: 'sm',
  })

  useEffect(() => {
    setGlobalFilter(filterInput || undefined)
  }, [filterInput, setGlobalFilter])

  return (
    <>
      <VStack spacing={4} w="full" py={8} px={4}>
        <Flex w="100%" justify="flex-end">
          <Button
            mr={2}
            size="sm"
            disabled
            fontWeight="bold"
            leftIcon={<AiFillPrinter />}
          >
            PRINT
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              disabled
              size="sm"
              fontWeight="bold"
              rightIcon={<IoMdArrowDropdown />}
            >
              EXPORT
            </MenuButton>
            <MenuList>
              <MenuItem closeOnSelect={false}>Export as json</MenuItem>
            </MenuList>
          </Menu>
          <Button
            ml={2}
            colorScheme="green"
            size="sm"
            fontWeight="bold"
            rounded="3xl"
            leftIcon={<IoMdAdd />}
            onClick={createUserDrawerDisclosure.onOpen}
          >
            CREATE A USER
          </Button>
        </Flex>
        <Flex width="100%" align="center" justify="space-between">
          <Box>
            <InputGroup size={searchInputSize}>
              <InputLeftElement>
                <BiSearch color={useColorModeValue('#718096', '#F7FAFC')} />
              </InputLeftElement>
              <Input
                variant="filled"
                colorScheme="telegram"
                placeholder="Search"
                value={filterInput}
                onChange={(e) => {
                  setFilterInput(e.target.value)
                }}
                rounded="md"
              />
            </InputGroup>
          </Box>
          <Menu>
            <MenuButton
              as={Button}
              disabled
              size="sm"
              variant="solid"
              leftIcon={<HiFilter />}
              rightIcon={<IoMdArrowDropdown />}
            >
              More filters
            </MenuButton>
            <MenuList>
              <MenuItem closeOnSelect={false}>
                <Checkbox>Admins</Checkbox>
              </MenuItem>
              <MenuItem closeOnSelect={false}>
                <Checkbox>Users</Checkbox>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </VStack>
      <CreateUserDrawer {...createUserDrawerDisclosure} />
    </>
  )
}

export default Actions
