import { Role } from '.prisma/client'
import { UserInputError } from 'apollo-server-errors'
import { hash, verify } from 'argon2'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { v4 } from 'uuid'
import { User } from '../../../prisma/generated/type-graphql'
import { CONFIRM_EMAIL_PREFIX, FORGOT_PASSWORD_PREFIX } from '../../config'
import { sendConfirmEmail } from '../../lib/mailer/templates/ConfirmEmailMail'
import { sendForgotPasswrodEmail } from '../../lib/mailer/templates/ForgotPasswordMail'
import { Context } from '../../types'
import { capitalizeDisplayName } from '../../utils/capitalize'
import { LoginInput, RegisterInput } from './types'

@Resolver()
export default class AuthResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, prisma }: Context) {
    const { userId } = req.session

    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return null

    return user
  }

  @Mutation(() => User)
  async login(
    @Arg('options') { usernameOrEmail, ...options }: LoginInput,
    @Ctx() { req, prisma }: Context
  ) {
    const where = usernameOrEmail.includes('@')
      ? { where: { email: usernameOrEmail } }
      : { where: { username: usernameOrEmail } }

    //@ts-ignore
    const user = await prisma.user.findUnique(where)

    if (!user)
      throw new UserInputError("Sorry but looks like your didn't register yet.")

    const isVerfiedPassword = await verify(user.password, options.password)

    if (!isVerfiedPassword)
      throw new UserInputError('Sorry but looks like your credentials is wrong')

    req.session.userId = user.id

    return user
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req }: Context) {
    return new Promise((res, rej) => {
      req.session.destroy((err) => {
        if (err) rej(false)
      })
      res(true)
    })
  }

  @Mutation(() => User)
  async register(
    @Arg('options', { validate: { stopAtFirstError: false } })
    options: RegisterInput,
    @Ctx() { prisma, req, redis }: Context
  ) {
    const existedUser = await prisma.user.findUnique({
      where: { email: options.email },
    })

    if (existedUser) {
      throw new UserInputError(
        `User with email ${options.email} is already exists`
      )
    }

    let newUser

    try {
      const hashedPassword = await hash(options.password)
      const displayName = capitalizeDisplayName(
        options.firstName,
        options.lastName
      )
      newUser = await prisma.user.create({
        data: {
          ...options,
          password: hashedPassword,
          displayName,
          role:
            !process.env.__PROD__ && options.email === 'admin'
              ? Role.ADMIN
              : undefined,
        },
      })
    } catch (e) {
      throw new Error('Whoops something went wrong')
    }

    const token = v4()

    await redis.set(CONFIRM_EMAIL_PREFIX + token, newUser.id)

    sendConfirmEmail(newUser.email, token)

    req.session.userId = newUser.id

    return newUser
  }

  @Mutation(() => User)
  async confirmEmail(
    @Arg('token') token: string,
    @Ctx() { prisma, redis, req }: Context
  ) {
    const userId = await redis.get(CONFIRM_EMAIL_PREFIX + token)

    if (!userId) {
      throw new Error('Invalid token')
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new Error('User no longer exists')
    }

    req.session.userId = user.id

    await redis.del(CONFIRM_EMAIL_PREFIX + token)

    return prisma.user.update({
      where: { id: userId },
      data: { isEmailVerfied: true },
    })
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { prisma, redis }: Context
  ) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new UserInputError("Whoops!! couldn't find a user with that email.")
    }

    const token = v4()

    await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'ex', 15 * 60) // 15min

    sendForgotPasswrodEmail(email, token)

    return true
  }

  @Mutation(() => User)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, prisma, req }: Context
  ) {
    if (newPassword.length <= 2) {
      throw new UserInputError('Password must be more than 2')
    }

    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token)

    if (!userId) {
      throw new Error('Invalid token or the token has been expired')
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new Error("Whoops! looks like the user doesn't exists anymore.")
    }

    const hashedPassword = await hash(newPassword)

    let result = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    await redis.del(FORGOT_PASSWORD_PREFIX + token)

    req.session.userId = result.id

    return result
  }

  @Query(() => Boolean)
  async isValidResetPasswordToken(
    @Arg('token') token: string,
    @Ctx() { redis, prisma }: Context
  ) {
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token)

    if (!userId) {
      return false
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      return false
    }

    return true
  }
}
