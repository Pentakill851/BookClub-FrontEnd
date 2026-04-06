import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

const FINAL_STATUSES = new Set(['Accepted', 'Declined'])

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT i.InviteID AS inviteId, i.Status AS status, i.Timestamp AS inviteTimestamp,
              i.ClubID AS clubId, c.Name AS clubName,
              i.SenderUserID AS senderUserId, u.Username AS senderUsername
       FROM Invitation i
       LEFT JOIN Club c ON c.ClubID = i.ClubID
       LEFT JOIN User u ON u.UserID = i.SenderUserID
       WHERE i.ReceiverUserID = ?
       ORDER BY i.Timestamp DESC`,
      [req.session.userID]
    )
    res.json({ data: rows, error: null })
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
      data: { inviteId, status: normalized, clubId: inv.ClubID },
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
