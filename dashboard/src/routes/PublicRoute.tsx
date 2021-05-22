import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useMeQuery } from '../generated/graphql'

interface PublicRouteProps extends RouteProps {}

const PublicRoute: React.FC<PublicRouteProps> = ({ ...props }) => {
  const { data, loading } = useMeQuery({ notifyOnNetworkStatusChange: true })

  if (loading) return null

  if (data?.me !== null) return <Redirect to="/dashboard" />
  return <Route {...props} />
}

export default PublicRoute
