import crypto from 'crypto'
import { envVariables } from '../config/initilize-env-variables-config'

const algorithm = 'aes-256-cbc'
const iv = Buffer.from(envVariables.INITIAL_VECTOR)
const password = envVariables.CRYPTO_PASSWORD

const key = crypto.pbkdf2Sync(password, '', 100, 32, 'sha256')

export async function encode(text: string) {
  let cipher = crypto.createCipheriv(algorithm, key, iv)
  let part1 = cipher.update(text, 'utf8')
  let part2 = cipher.final()
  const encrypted = Buffer.concat([part1, part2]).toString('base64')
  return encrypted
}

export async function decode(text: string) {
  let decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(text, 'base64', 'utf8')
  decrypted += decipher.final()
  return decrypted
}
