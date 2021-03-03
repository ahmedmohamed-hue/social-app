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
import { deleteObject, uploadFile } from '../utils/aws'
import { v4 } from 'uuid'
import { sendEmail } from '../utils/mailer'

const FORGOT_PASSWORD_PREFIX = 'forgot-password'

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
    if (user && user.avatar_url) {
      const fileName = user.avatar_url.split('/')[user.avatar_url.split('/').length - 1]
      console.log('HAS IMAGE')
      try {
        await deleteObject(fileName)
      } catch (e) {
        console.log('e')
      }
    }
    const fileName = `${user ? user.username : ''}-${Date.now()}.${extension(file.mimetype)}`
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
      const fileName = user.cover_url.split('/')[user.cover_url.split('/').length - 1]
      try {
        await deleteObject(fileName)
      } catch (e) {
        console.log('e')
      }
    }

    const fileName = `${user ? user.username : ''}-${Date.now()}.${extension(file.mimetype)}`
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
      const fileName = user.cover_url.split('/')[user.cover_url.split('/').length - 1]
      try {
        await deleteObject(fileName)
        await prisma.user.update({ where: { id: userId }, data: { cover_url: '' } })
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
      const fileName = user.avatar_url.split('/')[user.avatar_url.split('/').length - 1]
      try {
        await deleteObject(fileName)
        await prisma.user.update({ where: { id: userId }, data: { avatar_url: '' } })
      } catch (e) {
        console.log(e)
      }
    } else {
      return false
    }
    return true
  }
}
