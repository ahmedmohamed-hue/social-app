import { hash, verify } from 'argon2'
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql'
import User from '../entities/User'
import { Context, registerInput } from '../utils/types'

@Resolver()
export default class UserResovler {
  @Mutation(() => User)
  async register(@Arg('options') options: registerInput, @Ctx() { req }: Context) {
    const hashedPassword = await hash(options.password)

    const newUser = User.create({ ...options, password: hashedPassword })

    let result
    try {
      result = await newUser.save()
    } catch (e) {
      if (e.code == '23505') {
        throw new Error('Username or email already exists')
      }
      console.log(e.code)
      throw new Error('sm weent wrong')
    }

    req.session.userId = result.id

    return result
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('usernameOrEmail') usernameOrPassword: string,
    @Arg('password') password: string,
    @Ctx() { req }: Context
  ) {
    const user = await User.findOne(
      usernameOrPassword.includes('@')
        ? { where: { email: usernameOrPassword } }
        : { where: { username: usernameOrPassword } }
    )

    if (!user) {
      throw new Error('No user exists')
    }

    const verfied = await verify(user.password, password)

    if (!verfied) {
      return new Error('Wrong password')
    }

    req.session.userId = user.id

    return user
  }

  @Query(() => User, { nullable: true })
  currentUser(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null
    }

    return User.findOne(req.session.userId)
  }

  @Mutation(() => Boolean, {})
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((e) => {
        res.clearCookie('eid')
        if (e) {
          console.log(e)
          resolve(false)
          return
        }

        resolve(true)
      })
    )
  }
}
