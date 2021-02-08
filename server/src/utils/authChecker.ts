import { AuthChecker } from 'type-graphql'
import User from '../entities/User'
import { Context } from './types'

export const authChecker: AuthChecker<Context> = async ({ context: { req } }, roles) => {
  const user = await User.findOne({ where: { id: req.session.userId } })

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
