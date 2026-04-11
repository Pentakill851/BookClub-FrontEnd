import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        t.ThreadID,
        t.Topic,
        t.CreatedAt,
        c.Name AS ClubName,
        b.Title AS BookTitle,
        u.Username AS AuthorName,
        t.UserID AS AuthorID,
        IF(br.ThreadID IS NOT NULL, 1, 0) AS isReview,
        br.StarRating AS starRating,
        m1.Content AS initialMessage,
        (SELECT COUNT(*) FROM Message WHERE ThreadID = t.ThreadID) - 1 AS replyCount,
        ureply.Username AS latestReplyAuthor,
        mlatest.Content AS latestReplyContent
      FROM Thread t
      INNER JOIN Joins j ON j.ClubID = t.ClubID AND j.UserID = ?
      INNER JOIN Club c ON c.ClubID = t.ClubID
      LEFT JOIN Book b ON b.ISBN = t.ISBN
      INNER JOIN User u ON u.UserID = t.UserID
      LEFT JOIN BookReview br ON br.ThreadID = t.ThreadID
      LEFT JOIN Message m1 ON m1.ThreadID = t.ThreadID AND m1.MessageNum = 1
      LEFT JOIN (
        SELECT ThreadID, MAX(MessageNum) AS MaxNum
        FROM Message WHERE MessageNum > 1 GROUP BY ThreadID
      ) latest ON latest.ThreadID = t.ThreadID
      LEFT JOIN Message mlatest ON mlatest.ThreadID = latest.ThreadID AND mlatest.MessageNum = latest.MaxNum
      LEFT JOIN User ureply ON ureply.UserID = mlatest.UserID
      ORDER BY t.CreatedAt DESC
      LIMIT 50
    `, [req.session.userID])

    const mapped = rows.map(row => ({
      ThreadID: row.ThreadID,
      Topic: row.Topic,
      CreatedAt: row.CreatedAt,
      ClubName: row.ClubName,
      BookTitle: row.BookTitle,
      AuthorName: row.AuthorName,
      AuthorID: row.AuthorID,
      isReview: !!row.isReview,
      starRating: row.starRating ?? null,
      initialMessage: row.initialMessage ?? '',
      replyCount: Math.max(0, row.replyCount ?? 0),
      latestReply: row.latestReplyAuthor
        ? { author: row.latestReplyAuthor, content: row.latestReplyContent }
        : null,
    }))

    res.json({ data: mapped, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
