import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/my', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.ClubID AS clubId, c.Name AS name, c.Description AS description,
              CASE WHEN pc.ClubID IS NOT NULL THEN 'private' ELSE 'public' END AS visibility,
              j.JoinDate AS joinDate
       FROM Joins j
       INNER JOIN Club c ON c.ClubID = j.ClubID
       LEFT JOIN PrivateClub pc ON pc.ClubID = c.ClubID
       WHERE j.UserID = ?
       ORDER BY c.Name ASC`,
      [req.session.userID]
    )
    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
