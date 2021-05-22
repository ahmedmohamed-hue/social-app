import { Field, ObjectType, Query, Resolver } from 'type-graphql'

@ObjectType()
class TestResponse {
  @Field()
  message: string

  @Field()
  version: string
}

@Resolver()
export class TestResovler {
  @Query()
  test(): TestResponse {
    return {
      message: 'Apollo graphql API',
      version: process.env.APP_VERSION || '0.0.1',
    }
  }
}
