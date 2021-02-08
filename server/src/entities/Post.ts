import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import User from './User'

@Entity('Post')
@ObjectType()
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

  @ManyToOne(() => User, (user) => user.posts)
  creator: User
}
