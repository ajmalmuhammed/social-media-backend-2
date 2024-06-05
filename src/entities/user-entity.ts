import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm'
import StandardEntity from './standard-entity'
import { Post } from './post-entity'
import { PostLike as PostLike } from './post-likes-entity'

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
