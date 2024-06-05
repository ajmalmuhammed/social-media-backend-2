import { Entity, Column, ManyToOne } from 'typeorm'
import StandardEntity from './standard-entity'
import { User } from './user-entity'

@Entity()
export class Post extends StandardEntity {
  @Column({ length: 30 })
  title: string

  @Column({ length: 1000 })
  content: string

  @Column({ type: 'integer', default: 0 })
  likes: number

  @ManyToOne(() => User, (user) => user.id)
  user: User

  constructor(title: string, content: string, user: User) {
    super()
    this.title = title
    this.content = content
    this.user = user
  }
}
