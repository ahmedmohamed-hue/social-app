import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import User from './User'
import Like from './Like'

@ObjectType()
@Entity('Post')
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field()
  id: number

  @Column()
  @Field()
  title: string

  @Column()
  @Field()
  body: string

  @Column()
  @Field()
  creatorId: string

  @Field()
  @Column({ type: 'int', default: 0 })
  likes: number

  @OneToMany(() => Like, (like) => like.post)
  like: Like

  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @CreateDateColumn()
  updateAt: Date
}
