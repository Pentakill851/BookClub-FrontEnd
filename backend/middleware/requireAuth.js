export function requireAuth(req, res, next) {
  if (!req.session.userID) {
    return res.status(401).json({ data: null, error: 'Not logged in' })
  }
  next()
}
