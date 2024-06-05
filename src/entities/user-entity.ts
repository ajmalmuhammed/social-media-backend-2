import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany
} from 'typeorm'
import { Post } from './post-entity's
import { PostLike } from './post-likes-entity'
import StandardEntity from './standard-entity'

@Entity()
export class User extends StandardEntity {
  @Column()
  emailId: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @ManyToMany(() => PostLike, (postlike) => postlike.user)
  @JoinTable()
  likedPosts: PostLike[]
}
