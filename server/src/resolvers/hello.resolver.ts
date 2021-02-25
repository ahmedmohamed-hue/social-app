import { Authorized, Field, Int, ObjectType, Query, Resolver } from 'type-graphql'

@ObjectType()
class Response {
  @Field(() => String)
  message: string

  @Field(() => Int)
  code: number
}

@Resolver()
export class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return 'Hello World'
  }

  @Query(() => Response)
  @Authorized(['ADMIN', 'USER'])
  secert() {
    const myResponse: Response = {
      message: 'Hey there',
      code: 200,
    }

    return myResponse
  }
}
