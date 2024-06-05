import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Post } from './post-entity'
import StandardEntity from './standard-entity'
import { User } from './user-entity'

@Entity()
export class PostLike extends StandardEntity {
  @Column({ unsigned: true })
  user_id: number

  @Column({ unsigned: true })
  post_id: number

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Post, (post) => post)
  @JoinColumn({ name: 'post_id' })
  post: Post

  constructor(user: User, post: Post) {
    super()
    this.user = user
    this.post = post
  }
}
