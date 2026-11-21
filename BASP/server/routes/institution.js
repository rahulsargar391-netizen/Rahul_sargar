import express from 'express'
import fs from 'fs'
import path from 'path'
import { protect, authorize } from '../middleware/auth.js'
import { Certificate, User } from '../models/index.js'
import { sequelize } from '../config/db.js'
import { uploadDir } from '../middleware/upload.js'
import { sha256File } from '../utils/hash.js'
import { appendToLedger } from '../utils/ledger.js'
import { logActivity } from '../utils/log.js'

const router = express.Router()

// Every route here is for institution accounts only
router.use(protect, authorize('institution'))

// An institution must be approved by an admin first
router.use((req, res, next) => {
  if (!req.user.isApproved) {
    return res
      .status(403)
      .json({ message: 'Your institution is waiting for admin approval' })
  }
  next()
})

const include = [{ model: User, as: 'student', attributes: ['id', 'name', 'email'] }]

const safeCert = (c) => ({
  id: c.id,
  certCode: c.certCode,
  title: c.title,
  description: c.description,
  issueDate: c.issueDate,
  originalName: c.originalName,
  mimeType: c.mimeType,
  fileSize: c.fileSize,
  fileHash: c.fileHash,
  status: c.status,
  reviewNote: c.reviewNote,
  reviewedAt: c.reviewedAt,
  createdAt: c.createdAt,
  student: c.student ? { id: c.student.id, name: c.student.name, email: c.student.email } : null,
})

// GET /api/institution/certificates?status=pending
router.get('/certificates', async (req, res) => {
  const where = { institutionId: req.user.id }
  if (['pending', 'approved', 'rejected'].includes(req.query.status)) {
    where.status = req.query.status
  }
  const list = await Certificate.findAll({ where, include, order: [['createdAt', 'DESC']] })
  res.json({ certificates: list.map(safeCert) })
})

// GET /api/institution/certificates/:id
router.get('/certificates/:id', async (req, res) => {
  const cert = await Certificate.findOne({
    where: { id: req.params.id, institutionId: req.user.id },
    include,
  })
  if (!cert) return res.status(404).json({ message: 'Certificate not found' })
  res.json({ certificate: safeCert(cert) })
})

// PATCH /api/institution/certificates/:id/review
router.patch('/certificates/:id/review', async (req, res) => {
  const { decision, note } = req.body || {}

  if (!['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ message: 'Decision must be approved or rejected' })
  }
  if (decision === 'rejected' && (!note || !note.trim())) {
    return res.status(400).json({ message: 'Please write a reason for rejecting' })
  }

  const cert = await Certificate.findOne({
    where: { id: req.params.id, institutionId: req.user.id },
  })
  if (!cert) return res.status(404).json({ message: 'Certificate not found' })
  if (cert.status !== 'pending') {
    return res.status(409).json({ message: 'This certificate was already reviewed' })
  }

  if (decision === 'approved') {
    // Step 2 of verification: re-hash the stored file and compare with the
    // fingerprint taken at upload time. A difference means the file changed.
    const filePath = path.join(uploadDir, cert.storedName)
    if (!fs.existsSync(filePath)) {
      return res.status(409).json({ message: 'The stored file is missing, cannot approve' })
    }
    const nowHash = await sha256File(filePath)
    if (nowHash !== cert.fileHash) {
      return res
        .status(409)
        .json({ message: 'The file was changed after upload. It cannot be approved.' })
    }
  }

  await sequelize.transaction(async (t) => {
    cert.status = decision
    cert.reviewNote = note ? note.trim().slice(0, 300) : null
    cert.reviewedAt = new Date()
    await cert.save({ transaction: t })

    // Approved certificates are written to the (simulated) ledger
    if (decision === 'approved') await appendToLedger(cert, t)
  })

  await logActivity({
    userId: req.user.id,
    action: decision === 'approved' ? 'APPROVE' : 'REJECT',
    details: cert.certCode,
    targetId: cert.id,
  })

  res.json({ certificate: { id: cert.id, status: cert.status } })
})

export default router
