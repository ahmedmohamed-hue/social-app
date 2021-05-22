import { AuthChecker } from 'type-graphql'
import { Context } from '../types'

const authChecker: AuthChecker<Context> = async (
  { context: { req, prisma } },
  roles
) => {
  if (!req.session.userId) return false

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
  })

  if (roles.length === 0) {
    return !!user
  }

  if (!user) {
    return false
  }

  if (roles.some((role) => role === user.role)) {
    return true
  }

  return false
}

export default authChecker
