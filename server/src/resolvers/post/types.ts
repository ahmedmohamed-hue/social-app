import { Field, InputType, ObjectType } from 'type-graphql'
import { Post, Comment, User } from '../../../prisma/generated/type-graphql'

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: [Post]

  @Field()
  hasMore: boolean
}

@ObjectType()
export class PaginatedComments {
  @Field(() => [Comment])
  comments: [Comment]

  @Field()
  hasMore: boolean
}

@InputType()
export class PostInput {
  @Field()
  title: string

  @Field()
  body: string
}

@ObjectType()
export class LikeResponse {
  @Field(() => [User])
  likes: User[]

  @Field()
  likeStatus: boolean
}
