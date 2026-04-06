const DELAY = 500

export function getInvitations() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { InviteID: 5, ClubName: 'Mystery Solvers', ClubID: 4, InvitedBy: 'Dana', SentAt: '2026-04-03T14:00:00' },
      { InviteID: 6, ClubName: 'Local Authors', ClubID: 5, InvitedBy: 'Evan', SentAt: '2026-04-04T09:30:00' },
    ]), DELAY)
  )
}

export function acceptInvitation(inviteID) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, inviteID }), DELAY))
}

export function declineInvitation(inviteID) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, inviteID }), DELAY))
}
