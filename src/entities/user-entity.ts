import { Entity, Column } from 'typeorm'
import StandardEntity from './standard-entity'

@Entity()
export class User extends StandardEntity {
  @Column()
  email: string

  @Column()
  firstName: string

  @Column()
  lastName: string
}
