import dotenv from 'dotenv'

type DBType = 'mysql' | 'postgres' | 'mongodb'
type NodeEnv = 'prod' | 'dev'
interface EnvVariables {
  ENV: NodeEnv
  PORT: number
  DB_TYPE: DBType
  DB_HOST: string
  DB_PORT: number
  DB_USER: string
  DB_PASS: string
  DB_NAME: string
  EMAIL_ID: string
  EMAIL_PASSWORD: string
  INITIAL_VECTOR: string
  CRYPTO_PASSWORD: string
  JWT_SECRET: string
}

// Load environment variables
const result = dotenv.config()

if (result.error) {
  throw result.error
}

const {
  ENV,
  PORT,
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  EMAIL_ID,
  EMAIL_PASSWORD,
  INITIAL_VECTOR,
  CRYPTO_PASSWORD,
  JWT_SECRET,
} = process.env

if (
  !ENV ||
  !PORT ||
  !DB_TYPE ||
  !DB_HOST ||
  !DB_PORT ||
  !DB_USER ||
  !DB_NAME ||
  !DB_PASS ||
  !EMAIL_ID ||
  !EMAIL_PASSWORD ||
  !INITIAL_VECTOR ||
  !CRYPTO_PASSWORD ||
  !JWT_SECRET
) {
  throw new Error('Required environment variables are missing.')
}

export const envVariables: EnvVariables = {
  ENV: ENV as NodeEnv,
  PORT: parseInt(PORT, 10),
  DB_TYPE: DB_TYPE as DBType,
  DB_HOST,
  DB_PORT: parseInt(DB_PORT, 10),
  DB_USER,
  DB_PASS,
  DB_NAME,
  EMAIL_ID,
  EMAIL_PASSWORD,
  INITIAL_VECTOR,
  CRYPTO_PASSWORD,
  JWT_SECRET,
}
