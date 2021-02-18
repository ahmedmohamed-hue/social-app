import { IsEmail, Length, Min } from 'class-validator'
import { Request, Response, Express } from 'express'
import { SessionData } from 'express-session'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { userLoader } from './userLoader'
import { Stream } from 'stream'

declare module 'express-session' {
  export interface SessionData {
    userId: string
  }
}

export type Context = {
  req: Request & { session: SessionData }
  res: Response
  userLoader: ReturnType<typeof userLoader>
}

export type Upload = {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
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

@ObjectType()
export class Notification {
  @Field((type) => ID)
  id: number

  @Field({ nullable: true })
  message?: string

  @Field((type) => Date)
  date: Date
}

export interface NotificationPayload {
  id: number
  message?: string
}
