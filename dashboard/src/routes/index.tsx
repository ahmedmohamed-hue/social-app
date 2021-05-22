import { AnimatePresence } from 'framer-motion'
import React, { FC } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import ConfirmEmail from '../pages/ConfirmEmail'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import ServerDown from '../pages/ServerDown'
import Layout from './../components/Layout'
import { useMeQuery } from './../generated/graphql'
import Login from './../pages/Login'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import routes from './routesList'
import NotFound from '../pages/404'

const Routes: FC = () => {
  const { loading, error } = useMeQuery()

  if (loading) return null

  if (error) return <ServerDown />

  return (
    <Switch>
      <Route path="/" exact render={() => <Redirect to="/dashboard" />} />
      <Route
        path="/dashboard"
        render={({ location }) => (
          <AnimatePresence exitBeforeEnter initial={false}>
            <Switch location={location} key={location.key}>
              <Layout>
                {routes.map((route, index) => (
                  <ProtectedRoute key={index} {...route} />
                ))}
              </Layout>
            </Switch>
          </AnimatePresence>
        )}
      />
      <Route
        render={({ location }) => (
          <Switch key={location.key} location={location}>
            <PublicRoute path="/login" exact component={Login} />
            <PublicRoute path="/forgot-password" component={ForgotPassword} />
            <Route
              path="/reset-password/:token"
              exact
              component={ResetPassword}
            />
            <Route path="/confirm-email/:token" component={ConfirmEmail} />
            <Route path="*" render={() => <NotFound />} />
          </Switch>
        )}
      />
    </Switch>
  )
}

export default Routes
