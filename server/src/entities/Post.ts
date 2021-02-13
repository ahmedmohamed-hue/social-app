import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from './User'

@ObjectType()
@Entity('Post')
export default class Post extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field()
  id: string

  @Column()
  @Field()
  title: string

  @Column()
  @Field()
  body: string

  @Column()
  @Field()
  creatorId: string

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @CreateDateColumn()
  updateAt: Date
}
