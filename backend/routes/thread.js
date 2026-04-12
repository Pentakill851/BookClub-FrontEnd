import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        t.ThreadID,
        t.Topic,
        t.CreatedAt,
        c.Name AS ClubName,
        c.ClubID,
        b.Title AS BookTitle,
        t.ISBN,
        u.Username AS AuthorName,
        t.UserID AS AuthorID,
        IF(br.ThreadID IS NOT NULL, 1, 0) AS isReview,
        br.StarRating AS starRating
      FROM Thread t
      INNER JOIN Club c ON c.ClubID = t.ClubID
      LEFT JOIN Book b ON b.ISBN = t.ISBN
      INNER JOIN User u ON u.UserID = t.UserID
      LEFT JOIN BookReview br ON br.ThreadID = t.ThreadID
      WHERE t.ThreadID = ?
    `, [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ data: null, error: 'Thread not found' })
    }

    const thread = {
      ThreadID: rows[0].ThreadID,
      Topic: rows[0].Topic,
      CreatedAt: rows[0].CreatedAt,
      ClubName: rows[0].ClubName,
      ClubID: rows[0].ClubID,
      BookTitle: rows[0].BookTitle,
      ISBN: rows[0].ISBN,
      AuthorName: rows[0].AuthorName,
      AuthorID: rows[0].AuthorID,
      isReview: !!rows[0].isReview,
      starRating: rows[0].starRating ?? null,
    }

    res.json({ data: thread, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/:id/messages', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        m.ThreadID,
        m.MessageNum,
        m.UserID,
        u.Username AS AuthorName,
        m.Content,
        m.Timestamp
      FROM Message m
      INNER JOIN User u ON u.UserID = m.UserID
      WHERE m.ThreadID = ?
      ORDER BY m.MessageNum ASC
    `, [req.params.id])

    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.post('/:id/reply', requireAuth, async (req, res) => {
  try {
    const { content } = req.body

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ data: null, error: 'Content is required' })
    }

    const threadID = Number(req.params.id)

    // Generate next MessageNum
    const [[{ maxNum }]] = await pool.execute(
      'SELECT MAX(MessageNum) as maxNum FROM Message WHERE ThreadID = ?',
      [threadID]
    )
    const newNum = (maxNum ?? 0) + 1

    // Insert the message
    await pool.execute(
      'INSERT INTO Message (ThreadID, MessageNum, UserID, Content) VALUES (?, ?, ?, ?)',
      [threadID, newNum, req.session.userID, content.trim()]
    )

    // Fetch the inserted row with author name
    const [[inserted]] = await pool.execute(`
      SELECT
        m.ThreadID,
        m.MessageNum,
        m.UserID,
        u.Username AS AuthorName,
        m.Content,
        m.Timestamp
      FROM Message m
      INNER JOIN User u ON u.UserID = m.UserID
      WHERE m.ThreadID = ? AND m.MessageNum = ?
    `, [threadID, newNum])

    res.json({ data: inserted, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const threadID = Number(req.params.id)

    // Check if thread exists and user is the owner
    const [[thread]] = await pool.execute(
      'SELECT UserID FROM Thread WHERE ThreadID = ?',
      [threadID]
    )

    if (!thread) {
      return res.status(404).json({ data: null, error: 'Thread not found' })
    }

    if (thread.UserID !== req.session.userID) {
      return res.status(403).json({ data: null, error: 'Not authorized to delete this thread' })
    }

    // Delete child rows first (guards against live DB missing ON DELETE CASCADE)
    await pool.execute('DELETE FROM Message WHERE ThreadID = ?', [threadID])
    await pool.execute('DELETE FROM BookReview WHERE ThreadID = ?', [threadID])
    // Delete the thread
    await pool.execute('DELETE FROM Thread WHERE ThreadID = ?', [threadID])

    res.json({ data: { success: true }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
