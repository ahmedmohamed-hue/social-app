import { AuthChecker } from 'type-graphql'
import { Context } from '../types'

export const authChecker: AuthChecker<Context> = async ({ context: { req, prisma } }, roles) => {
  const user = await prisma.user.findUnique({ where: { id: req.session.userId } })

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
