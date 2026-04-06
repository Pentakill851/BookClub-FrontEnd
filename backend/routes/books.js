import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/my', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.ISBN AS isbn, b.Title AS title, b.Author AS author, b.Genre AS genre,
              b.PublishedYear AS publishedYear, r.PersonalStatus AS personalStatus,
              r.AddedToListAt AS addedToListAt, r.Rating AS rating
       FROM Rates r
       INNER JOIN Book b ON b.ISBN = r.ISBN
       WHERE r.UserID = ?
       ORDER BY r.AddedToListAt IS NULL, r.AddedToListAt DESC, b.Title ASC`,
      [req.session.userID]
    )
    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
