import {
  Box,
  chakra,
  Flex,
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go'
import { TableInstance } from 'react-table'
import { ColumnProps } from './columns'

// interface TableProps extends TableInstance<ColumnProps> {}

const Table: React.FC<TableInstance<ColumnProps>> = ({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  page,
  prepareRow,
}) => {
  return (
    <Box width="100%" overflowX="auto">
      <ChakraTable
        {...getTableProps()}
        variant="simple"
        colorScheme="telegram"
        size="md"
      >
        <Thead bg={useColorModeValue('white', 'gray.700')}>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  {...column.getHeaderProps(
                    column.id !== 'actions'
                      ? column.getSortByToggleProps()
                      : undefined
                  )}
                >
                  <Flex align="center">
                    {column.render('Header')}
                    <chakra.span pl="4">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <GoTriangleDown aria-label="sorted descending" />
                        ) : (
                          <GoTriangleUp aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            )
          })}
        </Tbody>
      </ChakraTable>
    </Box>
  )
}

export default Table
