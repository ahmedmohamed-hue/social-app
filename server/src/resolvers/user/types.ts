import { Role } from '.prisma/client'
import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  Length,
} from 'class-validator'
import { Field, InputType, ObjectType } from 'type-graphql'
import { User } from '../../../prisma/generated/type-graphql'

@InputType()
export class RegisterInput {
  @Field()
  @Length(2, 255, { message: 'First name must be at least 2 letters' })
  @IsAlpha(undefined, { message: 'First name must contain only letters' })
  firstName: string

  @Field()
  @Length(2, 255, { message: 'Last name must be at least 2 letters' })
  @IsAlpha(undefined, { message: 'Last name must contain only letters' })
  lastName: string

  @Field()
  @IsEmail(undefined, { message: 'Email must be a valid email' })
  email: string

  @Field()
  @Length(5, 255, { message: 'Username must be at least 5 characters' })
  username: string

  @Field()
  @Length(8, 255, { message: 'Password must contain at least 8 characters' })
  @IsAlphanumeric(undefined, {
    message: 'Password must contain letters and numbers',
  })
  password: string
}

@InputType()
export class CreateUserInput extends RegisterInput {
  @Field({ nullable: true })
  displayName: string

  @Field({ nullable: true })
  @IsEnum(Role, { each: true, message: 'Role must be type of Enum Role' })
  role: Role

  @Field({ nullable: true })
  sendEmail: boolean
}

@InputType()
export class EditUserInput {
  @Field({ nullable: true })
  @Length(2, 255, { message: 'First name must be at least 2 letters' })
  @IsAlpha(undefined, { message: 'First name must contain only letters' })
  firstName: string

  @Field({ nullable: true })
  @Length(2, 255, { message: 'Last name must be at least 2 letters' })
  @IsAlpha(undefined, { message: 'Last name must contain only letters' })
  lastName: string

  @Field({ nullable: true })
  @IsEmail(undefined, { message: 'Email must be a valid email' })
  email: string

  @Field()
  @Length(5, 255, { message: 'Username must be at least 5 characters' })
  username: string

  @Field({ nullable: true })
  @Length(2, 255, { message: 'Display name must be at least 2 letters' })
  displayName: string

  @Field({ nullable: true })
  role: Role
}

@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail: string

  @Field()
  password: string
}

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users: User[]

  @Field()
  hasMore: boolean
}

@ObjectType()
export class ToggleOnline {
  @Field()
  onlineStatus: boolean

  @Field()
  lastSeen: Date
}
