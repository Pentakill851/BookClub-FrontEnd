import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/books', async (req, res) => {
  try {
    const q = req.query.q || ''
    let sql, params

    if (q) {
      const pattern = `%${q}%`
      sql = `
        SELECT ISBN, Title, Author, Genre, PublishedYear
        FROM Book
        WHERE Title LIKE ? OR Author LIKE ? OR Genre LIKE ?
        ORDER BY Title ASC
        LIMIT 50
      `
      params = [pattern, pattern, pattern]
    } else {
      sql = `
        SELECT ISBN, Title, Author, Genre, PublishedYear
        FROM Book
        ORDER BY Title ASC
        LIMIT 50
      `
      params = []
    }

    const [rows] = await pool.execute(sql, params)
    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/threads', async (req, res) => {
  try {
    const q = req.query.q || ''
    let sql, params

    if (q) {
      const pattern = `%${q}%`
      sql = `
        SELECT
          t.ThreadID,
          t.Topic,
          t.CreatedAt,
          c.Name AS ClubName,
          b.Title AS BookTitle,
          u.Username AS AuthorName,
          (SELECT COUNT(*) - 1 FROM Message WHERE ThreadID = t.ThreadID) AS replyCount
        FROM Thread t
        INNER JOIN Club c ON c.ClubID = t.ClubID
        LEFT JOIN Book b ON b.ISBN = t.ISBN
        INNER JOIN User u ON u.UserID = t.UserID
        WHERE t.Topic LIKE ? OR b.Title LIKE ? OR u.Username LIKE ?
        ORDER BY t.CreatedAt DESC
        LIMIT 50
      `
      params = [pattern, pattern, pattern]
    } else {
      sql = `
        SELECT
          t.ThreadID,
          t.Topic,
          t.CreatedAt,
          c.Name AS ClubName,
          b.Title AS BookTitle,
          u.Username AS AuthorName,
          (SELECT COUNT(*) - 1 FROM Message WHERE ThreadID = t.ThreadID) AS replyCount
        FROM Thread t
        INNER JOIN Club c ON c.ClubID = t.ClubID
        LEFT JOIN Book b ON b.ISBN = t.ISBN
        INNER JOIN User u ON u.UserID = t.UserID
        ORDER BY t.CreatedAt DESC
        LIMIT 50
      `
      params = []
    }

    const [rows] = await pool.execute(sql, params)
    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
