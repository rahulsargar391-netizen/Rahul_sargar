import { ActivityLog } from '../models/index.js'

// Writes one line to the activity log. Never crashes the request.
export async function logActivity({ userId = null, action, details = null, targetId = null }) {
  try {
    await ActivityLog.create({
      userId,
      action,
      details: details ? String(details).slice(0, 500) : null,
      targetId,
    })
  } catch (error) {
    console.error('Activity log error:', error.message)
  }
}
