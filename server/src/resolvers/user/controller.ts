import { UserInputError } from 'apollo-server-errors'
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { hash } from 'argon2'
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { v4 } from 'uuid'
import { Post, Role, User } from '../../../prisma/generated/type-graphql'
import { CONFIRM_EMAIL_PREFIX } from '../../config'
import { sendConfirmEmail } from '../../lib/mailer/templates/ConfirmEmailMail'
import { Context } from '../../types'
import { capitalizeDisplayName } from '../../utils/capitalize'
import {
  CreateUserInput,
  EditUserInput,
  PaginatedUsers,
  ToggleOnline,
} from './types'
import { deleteObject, uploadFile } from '../../lib/aws'
import { extension } from 'mime-types'

@Resolver(User)
export default class UserControllerResolver {
  @FieldResolver(() => [Post])
  posts(@Root() user: User, @Ctx() { prisma }: Context) {
    return prisma.user.findUnique({ where: { id: user.id } }).post()
  }

  @Authorized([Role.ADMIN])
  @Mutation(() => User)
  async createUser(
    @Arg('options', { validate: { stopAtFirstError: false } })
    { sendEmail, ...data }: CreateUserInput,
    @Ctx() { prisma, redis }: Context
  ) {
    let newUser

    try {
      const hashedPassword = await hash(data.password)

      const displayName =
        data.displayName.length <= 0
          ? capitalizeDisplayName(data.firstName, data.lastName)
          : data.displayName
      newUser = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          displayName,
        },
      })
    } catch (e) {
      if (e.code === 'P2002') {
        throw new UserInputError(`Field: ${e.meta?.target[0]} is duplicate`)
      }
      throw new Error('Whoops something went wrong')
    }

    if (sendEmail) {
      const token = v4()
      await redis.set(CONFIRM_EMAIL_PREFIX + token, newUser.id)

      sendConfirmEmail(newUser.email, token)
    }

    return newUser
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => User)
  editUser(
    @Arg('id') id: string,
    @Arg('data', { validate: { stopAtFirstError: false } }) data: EditUserInput,
    @Ctx() { prisma }: Context
  ) {
    return prisma.user.update({ where: { id }, data })
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

    // FIXME: Fix types post -> posts
    return { ...user, posts: [...user.post] }
  }

  @Authorized(Role.ADMIN)
  @Mutation(() => User)
  async deleteUser(@Arg('id') id: string, @Ctx() { prisma }: Context) {
    let result
    try {
      result = await prisma.user.delete({ where: { id } })
    } catch (e) {
      if (e.code === 'P2025') {
        throw Error(`Couldn't find a user with id : ${id}`)
      }

      throw new Error('Whoops something went wrong')
    }

    return result
  }

  @Authorized(Role.ADMIN)
  @Query(() => [User])
  users(@Ctx() { prisma }: Context) {
    return prisma.user.findMany()
  }

  @Authorized(Role.ADMIN)
  @Query(() => PaginatedUsers)
  async paginatedUsers(
    @Arg('limit') limit: number,
    @Arg('cursor', { nullable: true }) cursor: string,
    @Ctx() { prisma }: Context
  ) {
    const realLimit = Math.min(50, limit)
    const limitPlusOne = realLimit + 1

    const dateCursor = new Date(cursor)

    const validCursor =
      dateCursor.toString() !== 'Invalid Date'
        ? dateCursor.toISOString()
        : undefined

    const users = await prisma.user.findMany({
      take: limitPlusOne,
      where: {
        createdAt: { gt: validCursor },
      },
      orderBy: { createdAt: 'asc' },
    })

    return {
      users: users.slice(0, realLimit),
      hasMore: limitPlusOne === users.length,
    }
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
    if (user && user.avatar_url) {
      const fileName = user.avatar_url.split('/')[
        user.avatar_url.split('/').length - 1
      ]
      console.log('HAS IMAGE')
      try {
        await deleteObject(fileName)
      } catch (e) {
        console.log('e')
      }
    }
    const fileName = `${user ? user.username : ''}-${Date.now()}.${extension(
      file.mimetype
    )}`
    const location = await uploadFile(file, fileName)
    await prisma.user.update({
      where: { id: userId },
      data: {
        avatar_url: location,
      },
    })

    return location
  }

  @Authorized()
  @Mutation(() => String)
  async addCover(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Ctx() { req, prisma }: Context
  ) {
    const { userId } = req.session
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user && user.cover_url) {
      const fileName = user.cover_url.split('/')[
        user.cover_url.split('/').length - 1
      ]
      try {
        await deleteObject(fileName)
      } catch (e) {
        console.log('e')
      }
    }

    const fileName = `${user ? user.username : ''}-${Date.now()}.${extension(
      file.mimetype
    )}`
    const location = await uploadFile(file, fileName)
    await prisma.user.update({
      where: { id: userId },
      data: {
        cover_url: location,
      },
    })

    return location
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeCover(@Ctx() { req, prisma }: Context) {
    const { userId } = req.session
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (user && user.cover_url) {
      const fileName = user.cover_url.split('/')[
        user.cover_url.split('/').length - 1
      ]
      try {
        await deleteObject(fileName)
        await prisma.user.update({
          where: { id: userId },
          data: { cover_url: '' },
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      return false
    }
    return true
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeAvatar(@Ctx() { req, prisma }: Context) {
    const { userId } = req.session
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (user && user.avatar_url) {
      const fileName = user.avatar_url.split('/')[
        user.avatar_url.split('/').length - 1
      ]
      try {
        await deleteObject(fileName)
        await prisma.user.update({
          where: { id: userId },
          data: { avatar_url: '' },
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      return false
    }
    return true
  }
}
