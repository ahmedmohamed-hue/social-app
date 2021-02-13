import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql'
import Post from '../entities/Post'
import { Context, Notification, NotificationPayload, postInput } from '../utils/types'

@Resolver()
export default class PostResolver {
  private autoIncrement = 0

  @Query(() => [Post])
  getAllPosts() {
    return Post.find({ relations: ['creator'], order: { createdAt: 'DESC' } })
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
  async getPost(@Arg('id') id: number) {
    const post = await Post.findOne({ where: { id }, relations: ['creator'] })

    console.log(post)

    return post
  }

  // Testing
  @Mutation((returns) => Boolean)
  async pubSubMutation(
    @PubSub() pubSub: PubSubEngine,
    @Arg('message', { nullable: true }) message?: string
  ): Promise<boolean> {
    const payload: NotificationPayload = { id: ++this.autoIncrement, message }
    await pubSub.publish('NOTIFICATIONS', payload)
    return true
  }

  @Mutation((returns) => Boolean)
  async publisherMutation(
    @PubSub('NOTIFICATIONS') publish: Publisher<NotificationPayload>,
    @Arg('message', { nullable: true }) message?: string
  ): Promise<boolean> {
    await publish({ id: ++this.autoIncrement, message })
    return true
  }

  @Subscription({ topics: 'NOTIFICATIONS' })
  normalSubscription(@Root() { id, message }: NotificationPayload): Notification {
    return { id, message, date: new Date() }
  }
}
