import { IsEmail, Length } from 'class-validator'
import { Request, Response } from 'express'
import { SessionData } from 'express-session'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Stream } from 'stream'
import { PrismaClient } from '@prisma/client'
import { Post, User } from '../prisma/generated/type-graphql'

declare module 'express-session' {
  export interface SessionData {
    userId: string
  }
}

export type Context = {
  req: Request & { session: SessionData }
  res: Response
  prisma: PrismaClient
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

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: [Post]

  @Field()
  hasMore: boolean
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
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  message?: string

  @Field(() => Date)
  date: Date
}

export interface NotificationPayload {
  id: number
  message?: string
}

@ObjectType()
export class LikeResponse {
  @Field(() => [User])
  likes: User[]

  @Field()
  likeStatus: boolean
}
