import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

const READING_STATUS_VALUES = ['Not Started', 'In Progress', 'Finished']

async function requireModerator(req, res, clubId) {
  const [[row]] = await pool.execute(
    'SELECT 1 FROM Moderates WHERE UserID = ? AND ClubID = ?',
    [req.session.userID, clubId]
  )
  if (!row) {
    res.status(403).json({ data: null, error: 'Only moderators can modify the reading list' })
    return false
  }
  return true
}

router.get('/:id', requireAuth, async (req, res) => {
  const clubId = Number(req.params.id)
  if (!Number.isFinite(clubId)) {
    return res.status(400).json({ data: null, error: 'Invalid club ID' })
  }

  const userId = req.session.userID

  try {
    const [[club]] = await pool.execute(
      `SELECT c.ClubID, c.Name, c.Description,
              IF(EXISTS(SELECT 1 FROM PrivateClub WHERE ClubID = c.ClubID), 'Private', 'Public') AS type,
              (SELECT COUNT(*) FROM Joins j WHERE j.ClubID = c.ClubID) AS memberCount,
              IF((SELECT COUNT(*) FROM Joins WHERE UserID = ? AND ClubID = c.ClubID) > 0, 1, 0) AS isMember,
              IF((SELECT COUNT(*) FROM Moderates WHERE UserID = ? AND ClubID = c.ClubID) > 0, 1, 0) AS isModerator
       FROM Club c
       WHERE c.ClubID = ?`,
      [userId, userId, clubId]
    )

    if (!club) {
      return res.status(404).json({ data: null, error: 'Club not found' })
    }

    const [moderators] = await pool.execute(
      `SELECT u.UserID, u.Username
       FROM Moderates m
       INNER JOIN User u ON u.UserID = m.UserID
       WHERE m.ClubID = ?`,
      [clubId]
    )

    const [recentThreads] = await pool.execute(
      `SELECT t.ThreadID, t.Topic, t.CreatedAt,
              u.Username AS AuthorName,
              IF(br.ThreadID IS NOT NULL, 1, 0) AS isReview
       FROM Thread t
       INNER JOIN User u ON u.UserID = t.UserID
       LEFT JOIN BookReview br ON br.ThreadID = t.ThreadID
       WHERE t.ClubID = ?
       ORDER BY t.CreatedAt DESC
       LIMIT 10`,
      [clubId]
    )

    const [books] = await pool.execute(
      `SELECT b.ISBN, b.Title, b.Author, b.Genre, b.PublishedYear,
              r.ReadingStatus, r.DateFinished
       FROM \`Reads\` r
       INNER JOIN Book b ON b.ISBN = r.ISBN
       WHERE r.ClubID = ?
       ORDER BY b.Title ASC`,
      [clubId]
    )

    res.json({
      data: {
        ...club,
        memberCount: Number(club.memberCount),
        isMember: !!club.isMember,
        isModerator: !!club.isModerator,
        moderators,
        books,
        recentThreads: recentThreads.map(t => ({ ...t, isReview: !!t.isReview }))
      },
      error: null
    })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

// POST /api/club/:id/books — add a book to the club reading list (moderators only)
router.post('/:id/books', requireAuth, async (req, res) => {
  const clubId = Number(req.params.id)
  if (!Number.isFinite(clubId)) {
    return res.status(400).json({ data: null, error: 'Invalid club ID' })
  }
  if (!await requireModerator(req, res, clubId)) return

  const isbn = typeof req.body?.isbn === 'string' ? req.body.isbn.trim() : ''
  if (!isbn) {
    return res.status(400).json({ data: null, error: 'isbn is required' })
  }

  const statusRaw = typeof req.body?.status === 'string' ? req.body.status.trim() : ''
  const status = READING_STATUS_VALUES.includes(statusRaw) ? statusRaw : 'Not Started'

  try {
    const [[book]] = await pool.execute(
      'SELECT ISBN, Title, Author, Genre, PublishedYear FROM Book WHERE ISBN = ?',
      [isbn]
    )
    if (!book) {
      return res.status(404).json({ data: null, error: 'Book not found' })
    }

    await pool.execute(
      `INSERT INTO \`Reads\` (ISBN, ClubID, ReadingStatus, DateFinished)
       VALUES (?, ?, ?, NULL)
       ON DUPLICATE KEY UPDATE ReadingStatus = VALUES(ReadingStatus)`,
      [isbn, clubId, status]
    )

    res.json({ data: { ...book, ReadingStatus: status, DateFinished: null }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

// PATCH /api/club/:id/books/:isbn/status — update reading status (moderators only)
router.patch('/:id/books/:isbn/status', requireAuth, async (req, res) => {
  const clubId = Number(req.params.id)
  if (!Number.isFinite(clubId)) {
    return res.status(400).json({ data: null, error: 'Invalid club ID' })
  }
  if (!await requireModerator(req, res, clubId)) return

  const { isbn } = req.params
  const statusRaw = typeof req.body?.status === 'string' ? req.body.status.trim() : ''
  if (!READING_STATUS_VALUES.includes(statusRaw)) {
    return res.status(400).json({
      data: null,
      error: 'status must be Not Started, In Progress, or Finished'
    })
  }

  const dateFinished = statusRaw === 'Finished' ? new Date().toISOString().slice(0, 10) : null

  try {
    const [result] = await pool.execute(
      'UPDATE `Reads` SET ReadingStatus = ?, DateFinished = ? WHERE ISBN = ? AND ClubID = ?',
      [statusRaw, dateFinished, isbn, clubId]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ data: null, error: 'Book not in this club\'s reading list' })
    }
    res.json({ data: { ISBN: isbn, ReadingStatus: statusRaw, DateFinished: dateFinished }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

// DELETE /api/club/:id/books/:isbn — remove a book from the reading list (moderators only)
router.delete('/:id/books/:isbn', requireAuth, async (req, res) => {
  const clubId = Number(req.params.id)
  if (!Number.isFinite(clubId)) {
    return res.status(400).json({ data: null, error: 'Invalid club ID' })
  }
  if (!await requireModerator(req, res, clubId)) return

  const { isbn } = req.params
  try {
    const [result] = await pool.execute(
      'DELETE FROM `Reads` WHERE ISBN = ? AND ClubID = ?',
      [isbn, clubId]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ data: null, error: 'Book not in this club\'s reading list' })
    }
    res.json({ data: { success: true }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
