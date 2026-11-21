import express from 'express'
import multer from 'multer'
import { Certificate, User, LedgerEntry } from '../models/index.js'
import { sha256Buffer } from '../utils/hash.js'
import { rateLimit } from '../utils/rateLimit.js'
import { logActivity } from '../utils/log.js'
import { MAX_FILE_SIZE } from '../middleware/upload.js'

// PUBLIC routes: no login needed, and no private data is ever returned
const router = express.Router()
router.use(rateLimit({ windowMs: 60 * 1000, max: 40 }))

// The checked file stays in memory and is never saved
const checkUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
})

const codePattern = /^BASP-[0-9A-F]{10}$/

const findApproved = async (code) => {
  if (!codePattern.test(code)) return null
  return Certificate.findOne({
    where: { certCode: code, status: 'approved' },
    include: [
      { model: User, as: 'student', attributes: ['name'] },
      { model: User, as: 'institution', attributes: ['institutionName'] },
      { model: LedgerEntry, as: 'ledger' },
    ],
  })
}

// Only information the student agreed to share
const publicView = (c) => ({
  certCode: c.certCode,
  title: c.title,
  studentName: c.showName ? c.student.name : 'Name withheld by the student',
  institution: c.institution.institutionName,
  issueDate: c.issueDate,
  approvedOn: c.reviewedAt,
  status: 'APPROVED',
  recordedHash: c.fileHash,
  ledger: c.ledger
    ? { block: c.ledger.id, entryHash: c.ledger.entryHash, simulated: true }
    : null,
})

// GET /api/verify/:code
router.get('/:code', async (req, res) => {
  const cert = await findApproved(req.params.code)
  if (!cert) return res.status(404).json({ result: 'NOT_FOUND' })

  await logActivity({ action: 'VERIFY_VIEW', details: 'Page opened', targetId: cert.id })
  res.json({ result: 'FOUND', certificate: publicView(cert) })
})

// POST /api/verify/:code/check  (send a file, compare its SHA-256 hash)
router.post('/:code/check', (req, res) => {
  checkUpload.single('file')(req, res, async (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (maximum 5 MB)' : err.message
      return res.status(400).json({ message })
    }
    if (!req.file) return res.status(400).json({ message: 'Please choose a file' })

    const cert = await findApproved(req.params.code)
    if (!cert) return res.status(404).json({ result: 'NOT_FOUND' })

    const uploadedHash = sha256Buffer(req.file.buffer)
    const ledgerMatches = !cert.ledger || cert.ledger.fileHash === cert.fileHash
    const verified = uploadedHash === cert.fileHash && ledgerMatches

    await logActivity({
      action: 'VERIFY_CHECK',
      details: verified ? 'Result: VERIFIED' : 'Result: INVALID',
      targetId: cert.id,
    })

    res.json({
      result: verified ? 'VERIFIED' : 'INVALID',
      uploadedHash,
      recordedHash: cert.fileHash,
      certificate: publicView(cert),
    })
  })
})

export default router
