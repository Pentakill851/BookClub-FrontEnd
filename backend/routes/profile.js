import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT UserID AS userId, Email AS email, Username AS username FROM User WHERE UserID = ?',
      [req.session.userID]
    )

    if (rows.length === 0) {
      return res.status(404).json({ data: null, error: 'User not found' })
    }

    res.json({ data: rows[0], error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
