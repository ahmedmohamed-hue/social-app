import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { hash, verify } from 'argon2'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import User from '../entities/User'
import { Context, registerInput, Upload } from '../utils/types'
import { createWriteStream, unlink } from 'fs'
import { extension } from 'mime-types'

@Resolver(User)
export default class UserResovler {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: Context) {
    if (user.id === req.session.userId) {
      return user.email
    }
    return ''
  }

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
    if (!user.isVisible) {
      user.onlineStatus = true
    }

    return user.save()
  }

  @Query(() => User, { nullable: true })
  currentUser(@Ctx() { req }: Context) {
    if (!req.session.userId) {
      return null
    }

    return User.findOne(req.session.userId)
  }

  @Mutation(() => Boolean, {})
  async logout(@Ctx() { req, res }: Context) {
    const user = await User.findOne({ where: { id: req.session.userId } })
    return new Promise((resolve) =>
      req.session.destroy((e) => {
        res.clearCookie('eid')
        if (e) {
          console.log(e)
          resolve(false)
          return
        }

        if (user) {
          user.onlineStatus = false
          user.lastSeen = new Date()
          user.save().then()
        }

        resolve(true)
      })
    )
  }

  @Query(() => User, { nullable: true })
  async getUser(@Arg('username') username: string) {
    const user = await getConnection()
      .createQueryBuilder(User, 'user')
      .where('user.username = :username', { username })
      .leftJoinAndSelect('user.posts', 'post')
      .orderBy('post.createdAt', 'DESC')
      .getOneOrFail()

    if (!user) {
      return null
    }
    return user
  }

  @Query(() => [User])
  getUsers() {
    return User.find({ order: { lastSeen: 'DESC', onlineStatus: 'DESC' } })
  }

  @Authorized()
  @Mutation(() => User, { nullable: true })
  async toggleStatus(@Ctx() ctx: Context) {
    const user = await User.findOne({ where: { id: ctx.req.session.userId } })
    if (!user) {
      return null
    }

    user.onlineStatus = !user.onlineStatus

    if (!user.onlineStatus) {
      user.isVisible = true
      user.lastSeen = new Date()
    } else {
      user.isVisible = false
    }

    return user.save()
  }

  @Authorized()
  @Mutation(() => Boolean)
  async addAvatar(@Arg('file', (type) => GraphQLUpload) file: FileUpload, @Ctx() { req }: Context) {
    const user = await User.findOne({ id: req.session.userId })
    console.log(file.mimetype)
    const fileName = `${user ? user.username : ''}-${Date.now()}.${extension(file.mimetype)}`

    return new Promise(async (resolve, reject) =>
      file
        .createReadStream()
        .pipe(createWriteStream(__dirname + `../../public/avatars/${fileName}`))
        .on('finish', async () => {
          if (user) {
            user.avatar_url = `http://localhost:4000/static/avatars/${fileName}`
            await user.save()
            resolve(true)
          }
        })
        .on('error', (e) => {
          console.log(e)
          return reject(false)
        })
    )
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeAvatar(@Ctx() { req: { session } }: Context) {
    const user = await User.findOne({ id: session.userId })

    if (user && user.avatar_url) {
      const fileName = user.avatar_url.split('/')[5]
      unlink(__dirname + `../../public/avatars/${fileName}`, async (e) => {
        if (e) throw new Error('Something went wrong while removing the image')
        user.avatar_url = ''
        await user.save()
      })
    } else {
      return false
    }
    return true
  }
}
