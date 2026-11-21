// Very small in-memory rate limiter (enough for a college demo)
export function rateLimit({ windowMs, max, message }) {
  const hits = new Map()

  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of hits) {
      if (value.reset < now) hits.delete(key)
    }
  }, windowMs).unref()

  return (req, res, next) => {
    const now = Date.now()
    let entry = hits.get(req.ip)
    if (!entry || entry.reset < now) {
      entry = { count: 0, reset: now + windowMs }
      hits.set(req.ip, entry)
    }
    entry.count += 1
    if (entry.count > max) {
      return res
        .status(429)
        .json({ message: message || 'Too many requests, please wait a minute and try again' })
    }
    next()
  }
}
