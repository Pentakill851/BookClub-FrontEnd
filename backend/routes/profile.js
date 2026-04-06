import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

function timeAgo(date) {
  if (!date) return ''
  const t = new Date(date).getTime()
  if (Number.isNaN(t)) return ''
  const sec = Math.floor((Date.now() - t) / 1000)
  if (sec < 45) return 'just now'
  if (sec < 3600) return `${Math.floor(sec / 60)} minutes ago`
  if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`
  if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

router.get('/stats', requireAuth, async (req, res) => {
  const userId = req.session.userID
  try {
    const [rows] = await pool.execute(
      `SELECT
        (SELECT COUNT(*) FROM Rates WHERE UserID = ? AND PersonalStatus = 'Read') AS booksRead,
        (SELECT COUNT(*) FROM Rates WHERE UserID = ? AND PersonalStatus = 'Reading') AS booksReading,
        (SELECT COUNT(*) FROM Rates WHERE UserID = ? AND PersonalStatus = 'Want to Read') AS wantToRead,
        (SELECT COUNT(*) FROM Thread t
         INNER JOIN BookReview br ON br.ThreadID = t.ThreadID
         WHERE t.UserID = ?) AS reviewsWritten,
        (SELECT COUNT(*) FROM Joins WHERE UserID = ?) AS clubsJoined,
        (SELECT COUNT(*) FROM Thread WHERE UserID = ?) AS threadsStarted`,
      [userId, userId, userId, userId, userId, userId]
    )
    const r = rows[0] || {}
    const n = (a, b) => Number(r[a] ?? r[b]) || 0
    res.json({
      data: {
        booksRead: n('booksRead', 'booksread'),
        booksReading: n('booksReading', 'booksreading'),
        wantToRead: n('wantToRead', 'wanttoread'),
        reviewsWritten: n('reviewsWritten', 'reviewswritten'),
        clubsJoined: n('clubsJoined', 'clubsjoined'),
        threadsStarted: n('threadsStarted', 'threadsstarted')
      },
      error: null
    })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/books', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.ISBN AS ISBN, b.Title AS Title, b.Author AS Author, b.Genre AS Genre,
              r.PersonalStatus AS Status, r.Rating AS PersonalRating
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

router.get('/reviews', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT t.ThreadID AS ThreadID, t.Topic AS Topic,
              b.Title AS BookTitle, cl.Name AS ClubName,
              br.StarRating AS starRating, t.CreatedAt AS createdAt,
              (SELECT GREATEST(0, COUNT(*) - 1) FROM Message msg WHERE msg.ThreadID = t.ThreadID) AS replyCount
       FROM Thread t
       INNER JOIN BookReview br ON br.ThreadID = t.ThreadID
       LEFT JOIN Book b ON b.ISBN = COALESCE(t.ISBN, br.ISBN)
       LEFT JOIN Club cl ON cl.ClubID = t.ClubID
       WHERE t.UserID = ?
       ORDER BY t.CreatedAt DESC`,
      [req.session.userID]
    )
    const data = rows.map((row) => ({
      ThreadID: row.ThreadID,
      Topic: row.Topic,
      BookTitle: row.BookTitle,
      ClubName: row.ClubName,
      starRating: row.starRating,
      replyCount: Number(row.replyCount) || 0,
      timeAgo: timeAgo(row.createdAt)
    }))
    res.json({ data, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/clubs', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userID
    const [rows] = await pool.execute(
      `SELECT c.ClubID AS ClubID, c.Name AS Name,
              CASE WHEN pc.ClubID IS NOT NULL THEN 'Private' ELSE 'Public' END AS type,
              CASE WHEN m.UserID IS NOT NULL THEN 1 ELSE 0 END AS isModerator,
              (SELECT COUNT(*) FROM Joins j2 WHERE j2.ClubID = c.ClubID) AS memberCount
       FROM Joins j
       INNER JOIN Club c ON c.ClubID = j.ClubID
       LEFT JOIN PrivateClub pc ON pc.ClubID = c.ClubID
       LEFT JOIN Moderates m ON m.ClubID = c.ClubID AND m.UserID = ?
       WHERE j.UserID = ?
       ORDER BY c.Name ASC`,
      [userId, userId]
    )
    const data = rows.map((row) => ({
      ClubID: row.ClubID,
      Name: row.Name,
      type: row.type,
      isModerator: Boolean(row.isModerator),
      memberCount: Number(row.memberCount)
    }))
    res.json({ data, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT u.UserID AS UserID, u.Username AS Username, u.Email AS Email,
              (SELECT MIN(j.JoinDate) FROM Joins j WHERE j.UserID = u.UserID) AS JoinDate
       FROM User u
       WHERE u.UserID = ?`,
      [req.session.userID]
    )

    if (rows.length === 0) {
      return res.status(404).json({ data: null, error: 'User not found' })
    }

    const row = rows[0]
    res.json({
      data: {
        UserID: row.UserID,
        Username: row.Username,
        Email: row.Email,
        JoinDate: row.JoinDate
      },
      error: null
    })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
