import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import Post from '../entities/Post'
import { Context, postInput } from '../utils/types'

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  getAllPosts() {
    return Post.find()
  }

  @Authorized(['USER', 'ADMIN'])
  @Mutation(() => Post)
  createPost(@Arg('options') options: postInput, @Ctx() { req }: Context) {
    return Post.create({ ...options, creatorId: req.session.userId }).save()
  }

  @Query(() => [Post])
  @Authorized('USER')
  async getPostByUser(@Ctx() { req }: Context) {
    return Post.find({ where: { creatorId: req.session.userId } })
  }

  @Query(() => Post, { nullable: true })
  getPost(@Arg('id') id: number) {
    return Post.findOne({ where: { id } })
  }
}
