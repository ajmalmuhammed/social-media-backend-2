import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { envVariables } from './initilize-env-variables-config'
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

const connectDB = new DataSource({
  type: envVariables.DB_TYPE,
  host: envVariables.DB_HOST,
  port: envVariables.DB_PORT,
  username: envVariables.DB_USER,
  password: envVariables.DB_PASS,
  database: envVariables.DB_NAME,
  // logging: true,
  synchronize: true,
  entities: ['./src/entities/**/*.ts'],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
})
const initializeDB = async () => {
  try {
    await connectDB.initialize()
    console.log('Data Source has been initialized!')
  } catch (error) {
    console.error('Error during Data Source initialization', error)
    throw error
  }
}

export { connectDB, initializeDB }
