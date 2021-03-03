import { hash, verify } from 'argon2'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { v4 } from 'uuid'
import { User } from '../../prisma/generated/type-graphql'
import { CONFIRM_EMAIL_PREFIX, FORGOT_PASSWORD_PREFIX } from '../constants'
import { registerInput, Context } from '../types'
import { sendEmail } from '../utils/mailer'

@Resolver()
export default class AuthResolver {
  @Mutation(() => User)
  async register(@Arg('options') options: registerInput, @Ctx() { req, prisma, redis }: Context) {
    const hashedPassword = await hash(options.password)

    let result
    try {
      result = await prisma.user.create({ data: { ...options, password: hashedPassword } })
    } catch (e) {
      if (e.code == '23505') {
        throw new Error('Username or email already exists')
      }
      console.log(e.code)
      throw new Error('sm weent wrong')
    }

    req.session.userId = result.id

    const token = v4()

    await redis.set(CONFIRM_EMAIL_PREFIX + token, result.id)

    await sendEmail({
      subject: 'Confirm your email',
      html: `<a href="http:/localhost:4000/confirm-email/${token}">confirm your email</a>`,
      to: result.email,
    })

    return result
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('usernameOrEmail') usernameOrPassword: string,
    @Arg('password') password: string,
    @Ctx() { req, prisma }: Context
  ) {
    const where = usernameOrPassword.includes('@')
      ? { where: { email: usernameOrPassword } }
      : { where: { username: usernameOrPassword } }

    //@ts-ignore
    const user = await prisma.user.findUnique(where)

    if (!user) {
      throw new Error('No user exists')
    }

    const verfied = await verify(user.password, password)

    if (!verfied) {
      return new Error('Wrong password')
    }

    req.session.userId = user.id
    if (!user.isVisible) {
      user.onlineStatus = true
    }

    return user
  }

  @Query(() => User, { nullable: true })
  currentUser(@Ctx() { req, prisma }: Context) {
    if (!req.session.userId) {
      return null
    }

    return prisma.user.findUnique({ where: { id: req.session.userId } })
  }

  @Mutation(() => Boolean, {})
  async logout(@Ctx() { req, res, prisma }: Context) {
    const { userId } = req.session

    const user = await prisma.user.findUnique({ where: { id: userId } })
    return new Promise((resolve) =>
      req.session.destroy(async (e) => {
        res.clearCookie('eid')
        if (e) {
          console.log(e)
          resolve(false)
          return
        }

        if (user) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              lastSeen: new Date(),
              onlineStatus: false,
            },
          })
        }

        resolve(true)
      })
    )
  }

  @Mutation(() => User)
  async confirmEmail(@Arg('token') token: string, @Ctx() { prisma, redis }: Context) {
    const userId = await redis.get(CONFIRM_EMAIL_PREFIX + token)

    if (!userId) {
      throw new Error('Invalid token')
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new Error('User no longer exists')
    }

    return prisma.user.update({ where: { id: userId }, data: { isEmailVerfied: true } })
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() { prisma, redis }: Context) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new Error('User no longer exists')
    }

    const token = v4()

    await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 15) // 15min

    await sendEmail({
      subject: 'Change your password',
      to: email,
      html: `<a href="http://localhost:3000/change-password/${token}"> Change your password </a>`,
    })

    return true
  }

  @Mutation(() => User)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, prisma, req }: Context
  ) {
    if (newPassword.length <= 2) {
      throw new Error('validation error')
    }

    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token)

    if (!userId) {
      throw new Error('Invalid token or the token has been expired')
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new Error('User no longer exists')
    }

    const hashedPassword = await hash(newPassword)

    let result = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    req.session.userId = result.id

    return result
  }

  @Query(() => Boolean)
  async isValidRestoreToken(@Arg('token') token: string, @Ctx() { prisma, redis }: Context) {
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
