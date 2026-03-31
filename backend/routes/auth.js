import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ data: null, error: 'Email and password required' })
  }

  try {
    const [rows] = await pool.execute(
      'SELECT UserID, Username FROM User WHERE Email = ? AND Password = ?',
      [email, password]
    )

    if (rows.length === 0) {
      return res.status(401).json({ data: null, error: 'Invalid email or password' })
    }

    const user = rows[0]
    req.session.userID = user.UserID
    req.session.username = user.Username

    res.json({ data: { userID: user.UserID, username: user.Username }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ data: null, error: null })
  })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({
    data: { userID: req.session.userID, username: req.session.username },
    error: null
  })
})

export default router
