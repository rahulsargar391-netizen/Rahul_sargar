// Creates server/.env from .env.example with a random JWT secret
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const target = path.join(dir, '.env')
const example = path.join(dir, '.env.example')

if (fs.existsSync(target)) {
  console.log('server/.env already exists, leaving it as it is.')
  process.exit(0)
}

const secret = crypto.randomBytes(32).toString('hex')
const text = fs.readFileSync(example, 'utf8').replace('JWT_SECRET=CHANGE_ME', `JWT_SECRET=${secret}`)
fs.writeFileSync(target, text)
console.log('Created server/.env with a new random JWT secret.')
