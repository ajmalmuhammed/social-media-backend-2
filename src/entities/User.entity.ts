import { Entity, Column } from 'typeorm'
import StandardEntity from './Standard.entity'

@Entity()
export class User extends StandardEntity {
  @Column()
  email: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ type: 'boolean', default: false })
  isVerified: boolean
}
