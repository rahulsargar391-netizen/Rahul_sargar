import crypto from 'crypto'
import fs from 'fs'

// SHA-256 fingerprint of a file already saved on disk
export const sha256File = (filePath) =>
  new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256')
    fs.createReadStream(filePath)
      .on('error', reject)
      .on('data', (chunk) => h.update(chunk))
      .on('end', () => resolve(h.digest('hex')))
  })

// SHA-256 fingerprint of a file held in memory
export const sha256Buffer = (buf) =>
  crypto.createHash('sha256').update(buf).digest('hex')

// A short public code printed in the QR link, for example BASP-9F3A1C0B7E
export const makeCertCode = () =>
  'BASP-' + crypto.randomBytes(5).toString('hex').toUpperCase()
