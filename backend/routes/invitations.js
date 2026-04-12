import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

const FINAL_STATUSES = new Set(['Accepted', 'Declined'])

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT i.InviteID AS InviteID, i.ClubID AS ClubID, c.Name AS ClubName,
              COALESCE(u.Username, 'A member') AS InvitedBy,
              i.Timestamp AS SentAt
       FROM Invitation i
       LEFT JOIN Club c ON c.ClubID = i.ClubID
       LEFT JOIN User u ON u.UserID = i.SenderUserID
       WHERE i.ReceiverUserID = ?
         AND (i.Status = 'Pending' OR i.Status IS NULL)
       ORDER BY i.Timestamp DESC`,
      [req.session.userID]
    )
    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.get('/count', requireAuth, async (req, res) => {
  try {
    const [[{ count }]] = await pool.execute(
      `SELECT COUNT(*) AS count FROM Invitation
       WHERE ReceiverUserID = ? AND (Status = 'Pending' OR Status IS NULL)`,
      [req.session.userID]
    )
    res.json({ data: { count: Number(count) }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.post('/', requireAuth, async (req, res) => {
  const { identifier, clubId } = req.body ?? {}

  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    return res.status(400).json({ data: null, error: 'username or email is required' })
  }
  if (!clubId) {
    return res.status(400).json({ data: null, error: 'clubId is required' })
  }

  const id = identifier.trim()

  try {
    // Look up target user by username OR email
    const [[targetUser]] = await pool.execute(
      'SELECT UserID, Username FROM User WHERE Username = ? OR Email = ?',
      [id, id]
    )
    if (!targetUser) {
      return res.status(404).json({ data: null, error: `No user found with username or email "${id}"` })
    }
    if (targetUser.UserID === req.session.userID) {
      return res.status(400).json({ data: null, error: 'You cannot invite yourself' })
    }
    const displayName = targetUser.Username

    // Check if already a member
    const [[alreadyMember]] = await pool.execute(
      'SELECT 1 FROM Joins WHERE UserID = ? AND ClubID = ?',
      [targetUser.UserID, clubId]
    )
    if (alreadyMember) {
      return res.status(400).json({ data: null, error: 'That user is already a member of this club' })
    }

    // Check for existing pending invitation
    const [[existing]] = await pool.execute(
      `SELECT 1 FROM Invitation WHERE ReceiverUserID = ? AND ClubID = ?
       AND (Status = 'Pending' OR Status IS NULL)`,
      [targetUser.UserID, clubId]
    )
    if (existing) {
      return res.status(400).json({ data: null, error: 'That user already has a pending invitation to this club' })
    }

    // Generate new InviteID
    const [[{ maxId }]] = await pool.execute('SELECT MAX(InviteID) AS maxId FROM Invitation')
    const newId = (maxId ?? 0) + 1

    await pool.execute(
      `INSERT INTO Invitation (InviteID, ClubID, SenderUserID, ReceiverUserID, Status)
       VALUES (?, ?, ?, ?, 'Pending')`,
      [newId, clubId, req.session.userID, targetUser.UserID]
    )

    res.json({ data: { success: true, inviteId: newId, invitedUsername: displayName }, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

router.put('/:id', requireAuth, async (req, res) => {
  const inviteId = Number.parseInt(req.params.id, 10)
  if (!Number.isFinite(inviteId)) {
    return res.status(400).json({ data: null, error: 'Invalid invitation id' })
  }

  const { status } = req.body ?? {}
  if (typeof status !== 'string' || !status.trim()) {
    return res.status(400).json({ data: null, error: 'status is required' })
  }

  const normalized = status.trim()
  const allowed = ['Pending', 'Accepted', 'Declined']
  if (!allowed.includes(normalized)) {
    return res.status(400).json({
      data: null,
      error: 'status must be Pending, Accepted, or Declined'
    })
  }

  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const [invRows] = await conn.execute(
      `SELECT ClubID, Status FROM Invitation
       WHERE InviteID = ? AND ReceiverUserID = ? FOR UPDATE`,
      [inviteId, req.session.userID]
    )
    const inv = invRows[0]

    if (!inv) {
      await conn.rollback()
      return res.status(404).json({ data: null, error: 'Invitation not found' })
    }

    if (inv.Status && FINAL_STATUSES.has(inv.Status) && inv.Status !== normalized) {
      await conn.rollback()
      return res.status(409).json({
        data: null,
        error: `Cannot change invitation from ${inv.Status}`
      })
    }

    await conn.execute(
      'UPDATE Invitation SET Status = ? WHERE InviteID = ? AND ReceiverUserID = ?',
      [normalized, inviteId, req.session.userID]
    )

    if (normalized === 'Accepted' && inv.ClubID != null) {
      await conn.execute(
        `INSERT INTO Joins (UserID, ClubID, JoinDate)
         VALUES (?, ?, CURDATE())
         ON DUPLICATE KEY UPDATE JoinDate = Joins.JoinDate`,
        [req.session.userID, inv.ClubID]
      )
    }

    await conn.commit()
    res.json({
      data: { success: true, inviteID: inviteId, status: normalized, ClubID: inv.ClubID },
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
