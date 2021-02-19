import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import Post from './Post'
import User from './User'

@Entity('like')
export default class Like extends BaseEntity {
  @PrimaryColumn()
  userId: string

  @PrimaryColumn()
  postId: number

  @Column({ type: 'boolean' })
  value: boolean

  @ManyToOne(() => User, (user) => user.likes)
  user: User

  @ManyToOne(() => Post, (post) => post.like)
  post: Post
}
