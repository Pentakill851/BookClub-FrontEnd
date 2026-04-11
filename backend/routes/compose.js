import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/clubs', requireAuth, async (req, res) => {
  try {
    const userID = req.session.userID

    const [rows] = await pool.execute(
      `SELECT
        c.ClubID,
        c.Name,
        CASE
          WHEN pc.ClubID IS NOT NULL THEN 'Private'
          ELSE 'Public'
        END AS Type
      FROM Joins j
      INNER JOIN Club c ON j.ClubID = c.ClubID
      LEFT JOIN PrivateClub pc ON c.ClubID = pc.ClubID
      WHERE j.UserID = ?
      ORDER BY c.Name ASC`,
      [userID]
    )

    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/books', async (req, res) => {
  try {
    const q = req.query.q || ''

    let query, params

    if (q.trim() === '') {
      query = 'SELECT ISBN, Title, Author, Genre FROM Book ORDER BY Title ASC LIMIT 20'
      params = []
    } else {
      query = `SELECT ISBN, Title, Author, Genre
               FROM Book
               WHERE Title LIKE ? OR Author LIKE ?
               ORDER BY Title ASC`
      const searchTerm = `%${q}%`
      params = [searchTerm, searchTerm]
    }

    const [rows] = await pool.execute(query, params)

    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.post('/thread', requireAuth, async (req, res) => {
  try {
    const { clubID, topic, content, isbn } = req.body
    const userID = req.session.userID

    // Validate required fields
    if (!clubID || !topic) {
      return res.status(400).json({ data: null, error: 'clubID and topic are required' })
    }

    // Verify club exists
    const [clubRows] = await pool.execute('SELECT ClubID FROM Club WHERE ClubID = ?', [clubID])
    if (clubRows.length === 0) {
      return res.status(404).json({ data: null, error: 'Club not found' })
    }

    // Verify user is a member of the club
    const [memberRows] = await pool.execute(
      'SELECT UserID FROM Joins WHERE UserID = ? AND ClubID = ?',
      [userID, clubID]
    )
    if (memberRows.length === 0) {
      return res.status(403).json({ data: null, error: 'You must be a member of this club to post' })
    }

    // Generate new ThreadID
    const [[{ maxId }]] = await pool.execute('SELECT MAX(ThreadID) as maxId FROM Thread')
    const newThreadID = (maxId ?? 0) + 1

    // Insert Thread
    await pool.execute(
      'INSERT INTO Thread (ThreadID, Topic, ISBN, UserID, ClubID) VALUES (?, ?, ?, ?, ?)',
      [newThreadID, topic, isbn || null, userID, clubID]
    )

    // Insert first Message as MessageNum 1
    await pool.execute(
      'INSERT INTO Message (ThreadID, MessageNum, UserID, Content) VALUES (?, ?, ?, ?)',
      [newThreadID, 1, userID, content]
    )

    res.json({ data: { threadID: newThreadID }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.post('/review', requireAuth, async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const { clubID, topic, content, isbn, starRating } = req.body
    const userID = req.session.userID

    // Validate required fields
    if (!clubID || !topic || !content || !isbn || starRating === undefined) {
      conn.release()
      return res.status(400).json({ data: null, error: 'All fields are required' })
    }

    // Validate starRating range
    const rating = parseInt(starRating, 10)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      conn.release()
      return res.status(400).json({ data: null, error: 'starRating must be an integer between 1 and 5' })
    }

    // Verify ISBN exists
    const [bookRows] = await conn.execute('SELECT ISBN FROM Book WHERE ISBN = ?', [isbn])
    if (bookRows.length === 0) {
      conn.release()
      return res.status(404).json({ data: null, error: 'Book not found' })
    }

    // Verify club exists
    const [clubRows] = await conn.execute('SELECT ClubID FROM Club WHERE ClubID = ?', [clubID])
    if (clubRows.length === 0) {
      conn.release()
      return res.status(404).json({ data: null, error: 'Club not found' })
    }

    // Verify user is a member of the club
    const [memberRows] = await conn.execute(
      'SELECT UserID FROM Joins WHERE UserID = ? AND ClubID = ?',
      [userID, clubID]
    )
    if (memberRows.length === 0) {
      conn.release()
      return res.status(403).json({ data: null, error: 'You must be a member of this club to post' })
    }

    // Begin transaction
    await conn.beginTransaction()

    // Generate new ThreadID
    const [[{ maxId }]] = await conn.execute('SELECT MAX(ThreadID) as maxId FROM Thread')
    const newThreadID = (maxId ?? 0) + 1

    // Insert Thread
    await conn.execute(
      'INSERT INTO Thread (ThreadID, Topic, ISBN, UserID, ClubID) VALUES (?, ?, ?, ?, ?)',
      [newThreadID, topic, isbn, userID, clubID]
    )

    // Insert first Message as MessageNum 1
    await conn.execute(
      'INSERT INTO Message (ThreadID, MessageNum, UserID, Content) VALUES (?, ?, ?, ?)',
      [newThreadID, 1, userID, content]
    )

    // Insert BookReview
    await conn.execute(
      'INSERT INTO BookReview (ThreadID, StarRating, ISBN) VALUES (?, ?, ?)',
      [newThreadID, rating, isbn]
    )

    await conn.commit()
    conn.release()

    res.json({ data: { threadID: newThreadID }, error: null })
  } catch (err) {
    await conn.rollback()
    conn.release()
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
