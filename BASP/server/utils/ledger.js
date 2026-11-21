import crypto from 'crypto'
import { LedgerEntry } from '../models/index.js'

// SIMULATED blockchain. Every entry stores the hash of the entry before it,
// so changing an old entry breaks the chain. This is a teaching model only.
const ZERO = '0'.repeat(64)

const makeHash = (prev, code, fileHash, time) =>
  crypto.createHash('sha256').update(`${prev}|${code}|${fileHash}|${time}`).digest('hex')

export async function appendToLedger(cert, transaction) {
  const last = await LedgerEntry.findOne({ order: [['id', 'DESC']], transaction })
  const prevHash = last ? last.entryHash : ZERO

  const recordedAt = new Date()
  recordedAt.setMilliseconds(0)

  const entryHash = makeHash(prevHash, cert.certCode, cert.fileHash, recordedAt.toISOString())

  return LedgerEntry.create(
    {
      certificateId: cert.id,
      certCode: cert.certCode,
      fileHash: cert.fileHash,
      prevHash,
      entryHash,
      recordedAt,
    },
    { transaction }
  )
}

// Re-computes the whole chain and reports whether it is intact
export async function checkLedger() {
  const all = await LedgerEntry.findAll({ order: [['id', 'ASC']] })
  let prev = ZERO
  for (const e of all) {
    const expected = makeHash(prev, e.certCode, e.fileHash, new Date(e.recordedAt).toISOString())
    if (e.prevHash !== prev || e.entryHash !== expected) {
      return { ok: false, brokenAt: e.id, total: all.length }
    }
    prev = e.entryHash
  }
  return { ok: true, total: all.length }
}
