import { Context, registerInput } from '../types'
import { hash, verify } from 'argon2'
import { createWriteStream, unlink } from 'fs'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { extension } from 'mime-types'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { Post, User } from '../../prisma/generated/type-graphql'

@ObjectType()
class ToggleOnline {
  @Field()
  onlineStatus: boolean

  @Field()
  lastSeen: Date
}

@Resolver(User)
export default class UserResovler {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: Context) {
    if (user.id === req.session.userId) {
      return user.email
    }
    return ''
  }

  @FieldResolver(() => [Post])
  posts(@Root() user: User, @Ctx() { prisma }: Context) {
    return prisma.user.findUnique({ where: { id: user.id } }).post()
  }

  @Mutation(() => User)
  async register(@Arg('options') options: registerInput, @Ctx() { req, prisma }: Context) {
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

  @Query(() => User, { nullable: true })
  async user(@Arg('username') username: string, @Ctx() { prisma }: Context) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { post: { orderBy: { createdAt: 'desc' } } },
    })

    if (!user) {
      return null
    }

    // TODO: Fix types post -> posts
    return { ...user, posts: [...user.post] }
  }

  @Query(() => [User])
  users(@Ctx() { prisma }: Context) {
    return prisma.user.findMany({ orderBy: { lastSeen: 'desc' } })
  }

  @Authorized()
  @Mutation(() => ToggleOnline, { nullable: true })
  async toggleStatus(@Ctx() { req, prisma }: Context) {
    const { userId } = req.session
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      return null
    }

    await prisma.user.update({
      where: { id: userId },
      data: { onlineStatus: !user.onlineStatus },
    })

    let result: ToggleOnline

    if (!user.onlineStatus) {
      result = await prisma.user.update({
        where: { id: userId },
        data: { lastSeen: new Date(), isVisible: true },
        select: { onlineStatus: true, lastSeen: true },
      })
    } else {
      result = await prisma.user.update({
        where: { id: userId },
        data: { lastSeen: new Date(), isVisible: true },
        select: { onlineStatus: true, lastSeen: true },
      })
    }

    return result
  }

  @Authorized()
  @Mutation(() => String)
  async addAvatar(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Ctx() { req, prisma }: Context
  ) {
    const { userId } = req.session
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const fileName = `${user ? user.username : ''}-${Date.now()}.${extension(file.mimetype)}`

    return new Promise(async (resolve, reject) =>
      file
        .createReadStream()
        .pipe(createWriteStream(__dirname + `../../public/avatars/${fileName}`))
        .on('finish', async () => {
          if (user) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                avatar_url: `http://localhost:4000/static/avatars/${fileName}`,
              },
            })

            resolve(user.avatar_url)
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
  async removeAvatar(@Ctx() { req, prisma }: Context) {
    const { userId } = req.session
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (user && user.avatar_url) {
      const fileName = user.avatar_url.split('/')[5]
      unlink(__dirname + `../../public/avatars/${fileName}`, async (e) => {
        if (e) throw new Error('Something went wrong while removing the image')
        await prisma.user.update({ where: { id: userId }, data: { avatar_url: '' } })
      })
    } else {
      return false
    }
    return true
  }
}
