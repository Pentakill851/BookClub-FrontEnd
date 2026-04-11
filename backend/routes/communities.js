import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

const currentBookSubquery = `(SELECT b.Title FROM \`Reads\` r
               INNER JOIN Book b ON b.ISBN = r.ISBN
               WHERE r.ClubID = c.ClubID
               ORDER BY CASE r.ReadingStatus
                 WHEN 'In Progress' THEN 1
                 WHEN 'Not Started' THEN 2
                 ELSE 3 END,
                 r.DateFinished IS NULL, r.DateFinished DESC
               LIMIT 1) AS currentBook`

router.get('/my', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userID
    const [rows] = await pool.execute(
      `SELECT c.ClubID AS ClubID, c.Name AS Name, c.Description AS Description,
              CASE WHEN pc.ClubID IS NOT NULL THEN 'Private' ELSE 'Public' END AS type,
              CASE WHEN m.UserID IS NOT NULL THEN 1 ELSE 0 END AS isModerator,
              (SELECT COUNT(*) FROM Joins j2 WHERE j2.ClubID = c.ClubID) AS memberCount,
              ${currentBookSubquery}
       FROM Joins j
       INNER JOIN Club c ON c.ClubID = j.ClubID
       LEFT JOIN PrivateClub pc ON pc.ClubID = c.ClubID
       LEFT JOIN Moderates m ON m.ClubID = c.ClubID AND m.UserID = ?
       WHERE j.UserID = ?
       ORDER BY c.Name ASC`,
      [userId, userId]
    )

    const data = rows.map((row) => ({
      ...row,
      isModerator: Boolean(row.isModerator),
      memberCount: Number(row.memberCount)
    }))

    res.json({ data, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/public', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.ClubID AS ClubID, c.Name AS Name, c.Description AS Description,
              'Public' AS type,
              (SELECT COUNT(*) FROM Joins j2 WHERE j2.ClubID = c.ClubID) AS memberCount,
              ${currentBookSubquery}
       FROM Club c
       INNER JOIN PublicClub pub ON pub.ClubID = c.ClubID
       ORDER BY c.Name ASC`
    )

    const data = rows.map((row) => ({
      ...row,
      memberCount: Number(row.memberCount)
    }))

    res.json({ data, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.post('/join', requireAuth, async (req, res) => {
  const clubId = Number.parseInt(req.body?.clubId ?? req.body?.ClubID, 10)
  const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : ''

  if (!Number.isFinite(clubId)) {
    return res.status(400).json({ data: null, error: 'clubId is required' })
  }

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const [clubRows] = await conn.execute(
      `SELECT c.ClubID, pc.JoinPasscode
       FROM Club c
       LEFT JOIN PrivateClub pc ON pc.ClubID = c.ClubID
       WHERE c.ClubID = ?`,
      [clubId]
    )
    const club = clubRows[0]

    if (!club) {
      await conn.rollback()
      return res.status(404).json({ data: null, error: 'Club not found' })
    }

    const isPrivate = club.JoinPasscode != null
    const isPublic = !isPrivate

    if (isPrivate && club.JoinPasscode !== passcode) {
      await conn.rollback()
      return res.status(403).json({ data: null, error: 'Incorrect passcode' })
    }

    if (isPublic) {
      const [pubRows] = await conn.execute(
        'SELECT ClubID FROM PublicClub WHERE ClubID = ?',
        [clubId]
      )
      if (!pubRows[0]) {
        await conn.rollback()
        return res.status(403).json({
          data: null,
          error: 'This club is not public; use an invitation or passcode'
        })
      }
    }

    await conn.execute(
      `INSERT INTO Joins (UserID, ClubID, JoinDate)
       VALUES (?, ?, CURDATE())
       ON DUPLICATE KEY UPDATE JoinDate = Joins.JoinDate`,
      [req.session.userID, clubId]
    )

    await conn.commit()
    res.json({ data: { success: true, ClubID: clubId }, error: null })
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ data: null, error: err.message })
  } finally {
    conn.release()
  }
})

router.post('/', requireAuth, async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const description =
    typeof req.body?.description === 'string' ? req.body.description.trim() : ''
  const typeRaw = typeof req.body?.type === 'string' ? req.body.type.trim() : ''
  const passcode =
    typeof req.body?.passcode === 'string' ? req.body.passcode : ''

  if (!name) {
    return res.status(400).json({ data: null, error: 'name is required' })
  }

  const type = typeRaw === 'Private' || typeRaw === 'Public' ? typeRaw : null
  if (!type) {
    return res.status(400).json({ data: null, error: 'type must be Public or Private' })
  }

  if (type === 'Private' && !passcode.trim()) {
    return res.status(400).json({
      data: null,
      error: 'Private clubs require a passcode'
    })
  }

  const userId = req.session.userID
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const [idRows] = await conn.execute('SELECT MAX(ClubID) AS maxId FROM Club')
    const maxId = idRows[0]?.maxId
    const newClubId = (maxId ?? 0) + 1

    await conn.execute(
      `INSERT INTO Club (ClubID, Name, Description, UserID)
       VALUES (?, ?, ?, ?)`,
      [newClubId, name, description || null, userId]
    )

    if (type === 'Private') {
      await conn.execute(
        `INSERT INTO PrivateClub (ClubID, JoinPasscode) VALUES (?, ?)`,
        [newClubId, passcode.trim()]
      )
    } else {
      await conn.execute(
        `INSERT INTO PublicClub (ClubID) VALUES (?)`,
        [newClubId]
      )
    }

    await conn.execute(
      `INSERT INTO Joins (UserID, ClubID, JoinDate) VALUES (?, ?, CURDATE())`,
      [userId, newClubId]
    )

    await conn.execute(
      `INSERT INTO Moderates (UserID, ClubID, AssignedAt) VALUES (?, ?, CURDATE())`,
      [userId, newClubId]
    )

    await conn.commit()

    res.json({
      data: {
        ClubID: newClubId,
        Name: name,
        Description: description || null,
        type,
        isModerator: true,
        memberCount: 1,
        currentBook: null
      },
      error: null
    })
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ data: null, error: err.message })
  } finally {
    conn.release()
  }
})

export default router
