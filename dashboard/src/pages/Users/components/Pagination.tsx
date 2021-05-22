import {
  Flex,
  HStack,
  IconButton,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import {
  FaBackward,
  FaCaretLeft,
  FaCaretRight,
  FaForward,
} from 'react-icons/fa'
import { Row } from 'react-table'
import { ColumnProps } from './columns'

interface PaginationProps {
  rows: Row<ColumnProps>[]
  canNextPage: boolean
  canPreviousPage: boolean
  nextPage: () => void
  previousPage: () => void
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void
  setPageSize: (pageSize: number) => void
  pageIndex: number
  pageSize: number
  pageCount: number
}

const Pagination: React.FC<PaginationProps> = ({
  rows,
  canNextPage,
  canPreviousPage,
  gotoPage,
  nextPage,
  previousPage,
  pageCount,
  pageIndex,
  pageSize,
  setPageSize,
}) => {
  return (
    <Flex
      color={useColorModeValue('gray.500', 'gray.400')}
      alignItems="center"
      justify="space-between"
      p={4}
      fontSize={{ base: '10px', md: '16px', sm: '14px' }}
    >
      <Text>
        Showing {rows.length < pageSize ? rows.length : pageSize} -{' '}
        {rows.length < pageSize ? rows.length : pageSize * pageIndex} of{' '}
        {rows.length} results
      </Text>
      <HStack>
        <IconButton
          disabled={!canPreviousPage}
          onClick={() => gotoPage(0)}
          aria-label="next page"
        >
          <FaBackward />
        </IconButton>
        <IconButton
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          aria-label="next page"
        >
          <FaCaretLeft size={24} />
        </IconButton>
        <IconButton
          onClick={() => nextPage()}
          disabled={!canNextPage}
          aria-label="next page"
        >
          <FaCaretRight size={24} />
        </IconButton>
        <IconButton
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          aria-label="next page"
        >
          <FaForward />
        </IconButton>
        <Text>Results per page:</Text>
        <Select
          defaultValue={pageSize}
          onChange={({ target: { value } }) => {
            setPageSize(Number(value))
          }}
          w="20"
        >
          {[10, 20, 50, 100].map((n, i) => (
            <option key={i}>{n}</option>
          ))}
        </Select>
      </HStack>
    </Flex>
  )
}

export default Pagination
