import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import {
  Comment,
  Like,
  Post,
  User,
} from '../../../prisma/generated/type-graphql'
import { Context } from '../../types'
import { PostInput, PaginatedPosts, LikeResponse } from './types'

@Resolver(Post)
export default class PostResolver {
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { prisma }: Context) {
    return prisma.post.findUnique({ where: { id: post.id } }).user()
  }

  @FieldResolver(() => Boolean, { nullable: true })
  async likeStatus(@Root() post: Post, @Ctx() { req, prisma }: Context) {
    if (!req.session.userId) {
      return null
    }

    const like = await prisma.like.findUnique({
      where: { userId_postId: { userId: req.session.userId, postId: post.id } },
    })

    return like ? like.value : false
  }

  @FieldResolver(() => [User], { nullable: true })
  async likes(@Root() post: Post, @Ctx() { prisma }: Context) {
    const likes = await prisma.like.findMany({
      where: { postId: post.id },
      include: { user: true },
    })

    const users = likes.map((like: Like) => like.user)

    return users
  }

  @FieldResolver(() => [Comment], { nullable: true })
  comments(@Root() post: Post, @Ctx() { prisma }: Context) {
    return prisma.comment.findMany({ where: { postId: post.id } })
  }

  @FieldResolver(() => Boolean)
  owner(@Root() post: Post, @Ctx() { req }: Context) {
    return post.creatorId === req.session.userId
  }

  @Authorized(['USER', 'ADMIN'])
  @Mutation(() => Post)
  createPost(
    @Arg('options') options: PostInput,
    @Ctx() { req, prisma }: Context
  ) {
    return prisma.post.create({
      data: { ...options, creatorId: req.session.userId },
    })
  }

  @Query(() => [Post])
  @Authorized('USER')
  async postByUser(@Ctx() { req, prisma }: Context) {
    return prisma.post.findMany({ where: { creatorId: req.session.userId } })
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number, @Ctx() { prisma }: Context) {
    return prisma.post.findUnique({ where: { id } })
  }

  @Query(() => PaginatedPosts)
  async paginatedPosts(
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

    const posts = await prisma.post.findMany({
      take: limitPlusOne,
      where: {
        createdAt: { lt: validCursor },
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      posts: posts.slice(0, realLimit),
      hasMore: limitPlusOne === posts.length,
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { req, prisma }: Context
  ) {
    try {
      await prisma.comment.deleteMany({ where: { postId: id } })
      await prisma.like.deleteMany({ where: { postId: id } })
      await prisma.post.deleteMany({
        where: { creatorId: req.session.userId, id },
      })
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }

  @Authorized()
  @Mutation(() => LikeResponse, { nullable: true })
  async like(@Arg('postId') postId: number, @Ctx() { req, prisma }: Context) {
    const { userId } = req.session

    const like = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    })

    let likeStatus: boolean

    if (like) {
      await prisma.like.delete({ where: { userId_postId: { postId, userId } } })
      likeStatus = false
    } else {
      await prisma.like.create({ data: { postId, value: true, userId } })
      likeStatus = true
    }

    const likes = await prisma.like.findMany({
      where: { postId },
      include: { user: true },
    })

    const usersLike = likes.map((like) => like.user)

    return { likeStatus, likes: usersLike }
  }
}
