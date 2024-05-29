import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
declare let process: {
  env: {
    DB_TYPE: 'mysql' | 'postgres'
    DB_HOST: string
    DB_PORT: number
    DB_USER: string
    DB_PASS: string
    DB_NAME: string
  }
}

dotenv.config()

console.log(
  'Connection to the DB  $$$$$$=> ',
  process.env.DB_TYPE +
    ' ' +
    process.env.DB_HOST +
    ' ' +
    process.env.DB_PORT +
    ' ' +
    process.env.DB_USER +
    ' ' +
    process.env.DB_PASS +
    ' ' +
    process.env.DB_NAME +
    ' '
)
const connectDB = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // logging: true,
  //   synchronize: true,
  //   entities: ['./src/models/**/*.ts'],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
})

connectDB
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch((err: any) => {
    console.error('Error during Data Source initialization', err)
  })

export default connectDB
