import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import StandardEntity from './standard-entity'
import { User } from './user-entity'

@Entity()
export class Post extends StandardEntity {
  @Column({ length: 30 })
  title: string

  @Column({ length: 1000 })
  content: string

  @Column({ type: 'integer', default: 0 })
  like_count: number

  @ManyToOne(() => User, (user) => user)
  user: User

  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable()
  likedBy: User[]

  constructor(title: string, content: string, user: User) {
    super()
    this.title = title
    this.content = content
    this.user = user
  }
}
