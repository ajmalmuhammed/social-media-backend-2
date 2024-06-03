import dotenv from 'dotenv'

type DBType = 'mysql' | 'postgres' | 'mongodb'

interface EnvVariables {
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
}

// Load environment variables
const result = dotenv.config()

if (result.error) {
  throw result.error
}

const {
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
} = process.env

if (
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
  !CRYPTO_PASSWORD
) {
  throw new Error('Required environment variables are missing.')
}

export const envVariables: EnvVariables = {
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
}
