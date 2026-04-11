import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/top-books', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        b.ISBN, b.Title, b.Author, b.Genre,
        COUNT(DISTINCT r.UserID) AS readerCount,
        ROUND(COALESCE(AVG(br.StarRating), 0), 1) AS avgRating,
        COUNT(DISTINCT t.ClubID) AS clubCount
      FROM Book b
      LEFT JOIN Rates r ON r.ISBN = b.ISBN
      LEFT JOIN Thread t ON t.ISBN = b.ISBN
      LEFT JOIN BookReview br ON br.ThreadID = t.ThreadID
      GROUP BY b.ISBN, b.Title, b.Author, b.Genre
      HAVING readerCount > 0 OR clubCount > 0
      ORDER BY avgRating DESC, readerCount DESC
    `)

    // Cast count fields to Number
    const data = rows.map(row => ({
      ...row,
      readerCount: Number(row.readerCount),
      clubCount: Number(row.clubCount),
      avgRating: Number(row.avgRating)
    }))

    res.json({ data, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/clubs', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.ClubID, c.Name, c.Description,
             COUNT(j.UserID) AS memberCount
      FROM Club c
      INNER JOIN Joins j ON j.ClubID = c.ClubID
      WHERE NOT EXISTS (
        SELECT 1 FROM Joins j2
        WHERE j2.ClubID = c.ClubID
          AND NOT EXISTS (
            SELECT 1 FROM Rates r WHERE r.UserID = j2.UserID
          )
      )
      GROUP BY c.ClubID, c.Name, c.Description
      ORDER BY memberCount DESC
    `)

    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
