import React from 'react'
import { FaUsers } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { RouteProps } from 'react-router'
import { Role } from '../generated/graphql'
import Home from '../pages/Home'
import Users from '../pages/Users'

interface RoutesType extends RouteProps {
  name: string
  premission: Role[]
  icon: JSX.Element
  animated?: boolean
}

const ICON_SIZE = '24px'

const routes: RoutesType[] = [
  {
    name: 'Dashboard',
    icon: <MdDashboard size={ICON_SIZE} />,
    premission: [],
    exact: true,
    children: <Home />,
    path: '',
  },
  {
    name: 'Users',
    icon: <FaUsers size={ICON_SIZE} />,
    path: '/users',
    premission: [Role.Admin],
    children: <Users />,
  },
]

export default routes
