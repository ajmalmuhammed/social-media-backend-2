import { Entity, Column } from 'typeorm'
import StandardEntity from './standard-entity'

@Entity()
export class User extends StandardEntity {
  @Column()
  emailId: string

  @Column()
  firstName: string

  @Column()
  lastName: string
}
