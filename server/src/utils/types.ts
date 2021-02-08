import { IsEmail, Length, Min } from 'class-validator'
import { Request, Response, Express } from 'express'
import { SessionData } from 'express-session'
import { Field, InputType, ObjectType } from 'type-graphql'

declare module 'express-session' {
  export interface SessionData {
    userId: string
  }
}

export type Context = {
  req: Request & { session: SessionData }
  res: Response
}

@InputType()
export class registerInput {
  @Field(() => String)
  @IsEmail()
  email: string

  @Field(() => String)
  username: string

  @Field(() => String)
  @Length(2, 255)
  firstName: string

  @Field(() => String)
  @Length(2, 255)
  lastName: string

  @Field(() => String)
  @Length(2, 255)
  password: string
}

@InputType()
export class postInput {
  @Field()
  title: string

  @Field()
  body: string
}
