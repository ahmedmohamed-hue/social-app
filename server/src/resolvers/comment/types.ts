import { Field, ObjectType } from 'type-graphql'
import { Comment } from '../../../prisma/generated/type-graphql'

@ObjectType()
export class PaginatedComments {
  @Field(() => [Comment])
  comments: [Comment]

  @Field()
  hasMore: boolean
}
