import {
  HStack,
  Tab,
  TabList,
  Tabs as ChakraTabs,
  Text,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { FaUserFriends, FaUserInjured, FaUserNinja } from 'react-icons/fa'
import { FilterValue, IdType } from 'react-table'
import { Role } from '../../../generated/graphql'
import { ColumnProps } from './columns'

interface TabsProps {
  setFilter: (
    columnId: IdType<ColumnProps>,
    updater: ((filterValue: FilterValue) => FilterValue) | FilterValue
  ) => void
  data: ColumnProps[]
}

const Tabs: React.FC<TabsProps> = ({ setFilter, data }) => {
  const tabs = useMemo(() => {
    return [
      {
        name: 'All',
        icon: <FaUserFriends />,
        count: data.length,
      },
      {
        name: 'Users',
        filterValue: Role.User,
        icon: <FaUserInjured />,
        count: data.reduce(
          (prev, curr) => (curr.role === Role.User ? prev + 1 : prev),
          0
        ),
      },
      {
        name: 'Admins',
        filterValue: Role.Admin,
        icon: <FaUserNinja />,
        count: data.reduce(
          (prev, curr) => (curr.role === Role.Admin ? prev + 1 : prev),
          0
        ),
      },
    ]
  }, [data])

  return (
    <ChakraTabs mx={4} variant="line" colorScheme="telegram" size="md">
      <TabList>
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={index}
              onClick={() => {
                setFilter('role', tab.filterValue)
              }}
            >
              <HStack spacing={2}>
                {tab.icon}
                <Text>{tab.name}</Text>
                <Text>{tab.count}</Text>
              </HStack>
            </Tab>
          )
        })}
      </TabList>
    </ChakraTabs>
  )
}

export default Tabs
