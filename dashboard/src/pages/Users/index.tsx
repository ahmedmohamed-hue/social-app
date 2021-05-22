import { Box } from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import React from 'react'
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { useUsersQuery } from '../../generated/graphql'
import Actions from './components/Actions'
import columns, { ColumnProps } from './components/columns'
import Pagination from './components/Pagination'
import Table from './components/Table'
import Tabs from './components/Tabs'

export type DataTableProps<Data extends object> = {
  data: Data[]
}

export function Users({ data }: DataTableProps<ColumnProps>) {
  const instance = useTable(
    { columns, data, initialState: { pageSize: 10 } },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    canNextPage,
    canPreviousPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageCount,
    state: { pageIndex, pageSize },
  } = instance

  return (
    <Box width="100%">
      <Actions setGlobalFilter={instance.setGlobalFilter} />
      <Tabs data={data} setFilter={instance.setFilter} />
      <Pagination
        rows={instance.rows}
        {...{
          canNextPage,
          canPreviousPage,
          previousPage,
          nextPage,
          gotoPage,
          pageIndex,
          setPageSize,
          pageSize,
          pageCount,
        }}
      />
      <Table {...instance} />
    </Box>
  )
}

const UsersContainer: React.FC = () => {
  const { data, loading } = useUsersQuery()

  if (loading) return null

  if (!data) return null

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <Users data={data.users as []} />
    </>
  )
}

export default UsersContainer
