import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

// Checks that the request carries a valid login token
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Please log in first' })
    }

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id)

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Account not found or disabled' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// Allows only certain roles, for example authorize('admin')
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission' })
  }
  next()
}
