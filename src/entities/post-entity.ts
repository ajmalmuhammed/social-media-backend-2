import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm'
import StandardEntity from './standard-entity'
import { User } from './user-entity'
import { PostLike } from './post-likes-entity'

@Entity()
export class Post extends StandardEntity {
  @Column({ length: 30 })
  title: string

  @Column({ length: 1000 })
  content: string

  @Column({ type: 'integer', default: 0 })
  like_count: number

  @Column({ unsigned: true, nullable: false })
  created_by_id: number

  @Column({ type: 'boolean', default: false })
  deleted: boolean

  @Column({ nullable: true })
  deletedAt: Date

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'created_by_id' })
  created_by: User

  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable()
  likedBy: User[]

  constructor(title: string, content: string, user: User) {
    super()
    this.title = title
    this.content = content
    this.created_by = user
  }

  markAsDeleted() {
    this.deleted = true
    this.deletedAt = new Date()
  }
}
