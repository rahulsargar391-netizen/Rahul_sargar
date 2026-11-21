import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

export const User = sequelize.define('User', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(100), allowNull: false },
  role: {
    type: DataTypes.ENUM('student', 'institution', 'admin'),
    allowNull: false,
    defaultValue: 'student',
  },
  institutionName: { type: DataTypes.STRING(150), allowNull: true },
  // Institutions must be approved by an admin before they can review anything
  isApproved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
})

export const Certificate = sequelize.define('Certificate', {
  certCode: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  title: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  issueDate: { type: DataTypes.DATEONLY, allowNull: true },
  originalName: { type: DataTypes.STRING(255), allowNull: false },
  storedName: { type: DataTypes.STRING(100), allowNull: false },
  mimeType: { type: DataTypes.STRING(50), allowNull: false },
  fileSize: { type: DataTypes.INTEGER, allowNull: false },
  fileHash: { type: DataTypes.STRING(64), allowNull: false },
  showName: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  reviewNote: { type: DataTypes.STRING(300), allowNull: true },
  reviewedAt: { type: DataTypes.DATE, allowNull: true },
})

// SIMULATED blockchain: a local hash-chained ledger stored in MySQL.
// It is NOT a real blockchain. Phase 9 replaces it with a Solidity contract.
export const LedgerEntry = sequelize.define('LedgerEntry', {
  certCode: { type: DataTypes.STRING(20), allowNull: false },
  fileHash: { type: DataTypes.STRING(64), allowNull: false },
  prevHash: { type: DataTypes.STRING(64), allowNull: false },
  entryHash: { type: DataTypes.STRING(64), allowNull: false },
  recordedAt: { type: DataTypes.DATE, allowNull: false },
})

export const ActivityLog = sequelize.define(
  'ActivityLog',
  {
    action: { type: DataTypes.STRING(50), allowNull: false },
    details: { type: DataTypes.STRING(500), allowNull: true },
    targetId: { type: DataTypes.INTEGER, allowNull: true },
  },
  { updatedAt: false }
)

User.hasMany(Certificate, { foreignKey: 'studentId', as: 'certificates' })
Certificate.belongsTo(User, { foreignKey: 'studentId', as: 'student' })
Certificate.belongsTo(User, { foreignKey: 'institutionId', as: 'institution' })
Certificate.hasOne(LedgerEntry, { foreignKey: 'certificateId', as: 'ledger' })
LedgerEntry.belongsTo(Certificate, { foreignKey: 'certificateId' })
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' })
