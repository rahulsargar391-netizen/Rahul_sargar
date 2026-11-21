import express from 'express'
import { Op } from 'sequelize'
import { protect, authorize } from '../middleware/auth.js'
import { User, Certificate, LedgerEntry, ActivityLog } from '../models/index.js'
import { checkLedger } from '../utils/ledger.js'
import { logActivity } from '../utils/log.js'

const router = express.Router()

router.use(protect, authorize('admin'))

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const count = (model, where = {}) => model.count({ where })

  const [students, institutions, pendingInstitutions, admins] = await Promise.all([
    count(User, { role: 'student' }),
    count(User, { role: 'institution' }),
    count(User, { role: 'institution', isApproved: false }),
    count(User, { role: 'admin' }),
  ])
  const [pending, approved, rejected, ledgerEntries] = await Promise.all([
    count(Certificate, { status: 'pending' }),
    count(Certificate, { status: 'approved' }),
    count(Certificate, { status: 'rejected' }),
    count(LedgerEntry),
  ])
  const verifications = await count(ActivityLog, {
    action: { [Op.in]: ['VERIFY_VIEW', 'VERIFY_CHECK'] },
  })

  res.json({
    users: { students, institutions, pendingInstitutions, admins },
    certificates: { pending, approved, rejected, total: pending + approved + rejected },
    ledger: await checkLedger(),
    ledgerEntries,
    verifications,
  })
})

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'institutionName', 'isApproved', 'isActive', 'createdAt'],
    order: [['createdAt', 'DESC']],
  })
  res.json({ users })
})

// PATCH /api/admin/users/:id   { isActive?, isApproved?, role? }
router.patch('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  if (user.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot change your own account here' })
  }

  const { isActive, isApproved, role } = req.body || {}
  const changes = []

  if (typeof isActive === 'boolean') {
    user.isActive = isActive
    changes.push(isActive ? 'enabled' : 'disabled')
  }
  if (typeof isApproved === 'boolean') {
    user.isApproved = isApproved
    changes.push(isApproved ? 'approved' : 'approval removed')
  }
  if (role) {
    if (!['student', 'institution', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    user.role = role
    changes.push(`role set to ${role}`)
  }

  await user.save()
  await logActivity({
    userId: req.user.id,
    action: 'ADMIN_USER_UPDATE',
    details: `${user.email}: ${changes.join(', ')}`,
    targetId: user.id,
  })
  res.json({ ok: true })
})

// GET /api/admin/certificates
router.get('/certificates', async (req, res) => {
  const list = await Certificate.findAll({
    include: [
      { model: User, as: 'student', attributes: ['name', 'email'] },
      { model: User, as: 'institution', attributes: ['institutionName'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: 300,
  })
  res.json({
    certificates: list.map((c) => ({
      id: c.id,
      certCode: c.certCode,
      title: c.title,
      status: c.status,
      student: c.student?.name,
      studentEmail: c.student?.email,
      institution: c.institution?.institutionName,
      createdAt: c.createdAt,
    })),
  })
})

// GET /api/admin/logs
router.get('/logs', async (req, res) => {
  const logs = await ActivityLog.findAll({
    include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    order: [['createdAt', 'DESC']],
    limit: 200,
  })
  res.json({
    logs: logs.map((l) => ({
      id: l.id,
      action: l.action,
      details: l.details,
      user: l.user ? `${l.user.name} (${l.user.email})` : 'Public / system',
      createdAt: l.createdAt,
    })),
  })
})

export default router
