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
import { Comment, User } from '../../../prisma/generated/type-graphql'
import { Context } from '../../types'
import { PaginatedComments } from './types'

@Resolver(Comment)
export default class CommentResolver {
  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { prisma }: Context) {
    return prisma.comment
      .findUnique({
        where: {
          id: comment.id,
        },
      })
      .user()
  }

  @FieldResolver(() => Boolean)
  owner(@Root() comment: Comment, @Ctx() { req }: Context) {
    return comment.userId === req.session.userId
  }

  @Query(() => [Comment])
  comments(
    @Arg('postId', () => Int) postId: number,
    @Ctx() { prisma }: Context
  ) {
    return prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    })
  }

  @Query(() => PaginatedComments)
  async paginatedComments(
    @Arg('limit') limit: number,
    @Arg('postId', () => Int) postId: number,
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

    const posts = await prisma.comment.findMany({
      take: limitPlusOne,
      where: {
        createdAt: { lt: validCursor },
        postId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      comments: posts.slice(0, realLimit),
      hasMore: limitPlusOne === posts.length,
    }
  }

  @Authorized()
  @Mutation(() => Comment)
  addComment(
    @Arg('commnet') comment: string,
    @Arg('postId', () => Int) postId: number,
    @Ctx() { prisma, req }: Context
  ) {
    const { userId } = req.session
    return prisma.comment.create({ data: { postId, userId, comment } })
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeComment(
    @Arg('commentId', () => Int) commentId: number,
    @Ctx() { prisma, req }: Context
  ) {
    const { userId } = req.session
    try {
      await prisma.comment.deleteMany({ where: { id: commentId, userId } })
    } catch (e) {
      return false
    }

    return true
  }
}
