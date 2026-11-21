import multer from 'multer'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Private folder: never shared as a public web folder
export const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'))
fs.mkdirSync(uploadDir, { recursive: true })

export const allowedTypes = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  // Random file name, so the original name is never used on disk
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString('hex') + allowedTypes[file.mimetype])
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes[file.mimetype]) {
      return cb(new Error('Only PDF, JPG and PNG files are allowed'))
    }
    cb(null, true)
  },
})

// The browser can lie about the file type, so we also check the first bytes
export function hasValidSignature(filePath, mimeType) {
  const fd = fs.openSync(filePath, 'r')
  const buf = Buffer.alloc(8)
  fs.readSync(fd, buf, 0, 8, 0)
  fs.closeSync(fd)

  if (mimeType === 'application/pdf') return buf.subarray(0, 4).toString() === '%PDF'
  if (mimeType === 'image/png') return buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))
  if (mimeType === 'image/jpeg') return buf.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
  return false
}

export default upload
