import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

const STATUS_VALUES = ['Read', 'Reading', 'Want to Read']

router.post('/my', requireAuth, async (req, res) => {
  const isbn = typeof req.body?.isbn === 'string' ? req.body.isbn.trim() : ''
  const statusRaw = typeof req.body?.status === 'string' ? req.body.status.trim() : ''
  const status = STATUS_VALUES.includes(statusRaw) ? statusRaw : 'Want to Read'

  if (!isbn) {
    return res.status(400).json({ data: null, error: 'isbn is required' })
  }

  try {
    const [bookRows] = await pool.execute('SELECT ISBN FROM Book WHERE ISBN = ?', [isbn])
    if (bookRows.length === 0) {
      return res.status(404).json({ data: null, error: 'Book not found' })
    }

    await pool.execute(
      `INSERT INTO Rates (ISBN, UserID, PersonalStatus, AddedToListAt, Rating)
       VALUES (?, ?, ?, CURDATE(), NULL)
       ON DUPLICATE KEY UPDATE PersonalStatus = VALUES(PersonalStatus)`,
      [isbn, req.session.userID, status]
    )

    res.json({
      data: { ISBN: isbn, Status: status, AddedToListAt: new Date().toISOString().slice(0, 10) },
      error: null
    })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/my', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.ISBN AS ISBN, b.Title AS Title, b.Author AS Author, b.Genre AS Genre,
              b.PublishedYear AS PublishedYear, r.PersonalStatus AS Status,
              r.AddedToListAt AS AddedToListAt, r.Rating AS PersonalRating
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

router.patch('/my/:isbn/status', requireAuth, async (req, res) => {
  const { isbn } = req.params
  const { status } = req.body ?? {}

  if (typeof status !== 'string' || !STATUS_VALUES.includes(status)) {
    return res.status(400).json({
      data: null,
      error: 'status must be Read, Reading, or Want to Read'
    })
  }

  try {
    const [result] = await pool.execute(
      `UPDATE Rates SET PersonalStatus = ? WHERE ISBN = ? AND UserID = ?`,
      [status, isbn, req.session.userID]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ data: null, error: 'Book not in your list' })
    }

    res.json({ data: { ISBN: isbn, Status: status }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.patch('/my/:isbn/rating', requireAuth, async (req, res) => {
  const { isbn } = req.params
  const { rating } = req.body ?? {}

  if (rating !== null && rating !== undefined) {
    const n = Number(rating)
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      return res.status(400).json({
        data: null,
        error: 'rating must be null or an integer 1–5'
      })
    }
  }

  const value = rating === null || rating === undefined ? null : Number(rating)

  try {
    const [result] = await pool.execute(
      `UPDATE Rates SET Rating = ? WHERE ISBN = ? AND UserID = ?`,
      [value, isbn, req.session.userID]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ data: null, error: 'Book not in your list' })
    }

    res.json({ data: { ISBN: isbn, PersonalRating: value }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
