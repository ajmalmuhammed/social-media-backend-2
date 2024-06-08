import Redis from 'ioredis'
import { envVariables } from './initilize-env-variables-config'

const redisClient = new Redis({
  host: envVariables.REDIS_HOST,
  port: 6379,
})

export default redisClient
