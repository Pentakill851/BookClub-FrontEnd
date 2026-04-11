import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/:id', requireAuth, async (req, res) => {
  const clubId = Number(req.params.id)
  if (!Number.isFinite(clubId)) {
    return res.status(400).json({ data: null, error: 'Invalid club ID' })
  }

  const userId = req.session.userID

  try {
    const [[club]] = await pool.execute(
      `SELECT c.ClubID, c.Name, c.Description,
              CASE WHEN pc.ClubID IS NOT NULL THEN 'Private' ELSE 'Public' END AS type,
              (SELECT COUNT(*) FROM Joins j WHERE j.ClubID = c.ClubID) AS memberCount,
              IF((SELECT COUNT(*) FROM Joins WHERE UserID = ? AND ClubID = c.ClubID) > 0, 1, 0) AS isMember,
              IF((SELECT COUNT(*) FROM Moderates WHERE UserID = ? AND ClubID = c.ClubID) > 0, 1, 0) AS isModerator
       FROM Club c
       LEFT JOIN PrivateClub pc ON pc.ClubID = c.ClubID
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

    res.json({
      data: {
        ...club,
        memberCount: Number(club.memberCount),
        isMember: !!club.isMember,
        isModerator: !!club.isModerator,
        moderators,
        recentThreads: recentThreads.map(t => ({ ...t, isReview: !!t.isReview }))
      },
      error: null
    })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
