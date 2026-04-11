import { getInvitations as getInvitationsAPI, acceptInvitation as acceptInvitationAPI, declineInvitation as declineInvitationAPI } from './invitations.js'
import { getMyCommunities } from './communities.js'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return m <= 1 ? 'just now' : `${m} minutes ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  const d = Math.floor(h / 24)
  return `${d} day${d > 1 ? 's' : ''} ago`
}

export async function getFeed() {
  const res = await fetch('/api/feed', { credentials: 'include' })
  const result = await res.json()
  if (result.error) throw new Error(result.error)
  return result.data.map(thread => ({
    ...thread,
    timeAgo: timeAgo(thread.CreatedAt)
  }))
}

export async function getInvitations() {
  const data = await getInvitationsAPI()
  return data
}

export async function getMyClubs() {
  const data = await getMyCommunities()
  return data
}

export async function getRecommendedClubs() {
  const res = await fetch('/api/communities/public', { credentials: 'include' })
  const result = await res.json()
  if (result.error) throw new Error(result.error)
  return result.data
}

export async function acceptInvitation(inviteID) {
  return acceptInvitationAPI(inviteID)
}

export async function declineInvitation(inviteID) {
  return declineInvitationAPI(inviteID)
}
