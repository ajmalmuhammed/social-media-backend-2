import { Entity, Column } from 'typeorm'
import StandardEntity from './standard-entity'

@Entity()
export class Otp extends StandardEntity {
  @Column()
  otp: string

  @Column()
  expiresAt: Date

  @Column({ type: 'boolean', default: false })
  used: boolean

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  usedAt: Date
}
