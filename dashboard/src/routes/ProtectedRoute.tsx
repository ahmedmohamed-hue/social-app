import { chakra, HTMLChakraProps } from '@chakra-ui/react'
import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import { Redirect, Route, RouteProps, useRouteMatch } from 'react-router-dom'
import { Role, useMeQuery } from '../generated/graphql'

interface ProtectedRouteProps extends RouteProps {
  premission?: Role[]
  animated?: boolean
}

type Merge<P, T> = Omit<P, keyof T> & T
type MotionBoxProps = Merge<HTMLChakraProps<'div'>, HTMLMotionProps<'div'>>
export const MotionBox: React.FC<MotionBoxProps> = motion(chakra.div)

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  premission = [],
  path: propPath,
  children,
  animated = true,
  ...props
}) => {
  const { path } = useRouteMatch()
  const { data, loading } = useMeQuery({
    fetchPolicy: 'cache-first',
  })

  if (loading) return null

  if (data?.me === null) return <Redirect to="/login" />

  return (
    <Route {...props} path={path + propPath}>
      {premission.length !== 0 &&
      !premission?.some((role) => role === data?.me?.role) ? (
        <Redirect to={'/dashboard'} />
      ) : animated ? (
        <MotionBox
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          width="full"
          h="100%"
        >
          {children}
        </MotionBox>
      ) : (
        children
      )}
    </Route>
  )
}

export default ProtectedRoute
