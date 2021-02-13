import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Post from './Post'

@ObjectType()
@Entity('user')
export default class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field(() => String)
  @Column('text', { unique: true })
  email: string

  @Field(() => String)
  @Column('text', { unique: true })
  username: string

  @Field(() => String)
  @Column('text')
  firstName: string

  @Field(() => String)
  @Column('text')
  lastName: string

  @Column('text')
  password: string

  @Column('text', { default: 'USER' })
  role: string

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[]

  @Column({ default: true })
  @Field()
  onlineStatus: boolean

  @Column({ default: false })
  isVisible: boolean

  @Field()
  @CreateDateColumn()
  lastSeen: Date
}
