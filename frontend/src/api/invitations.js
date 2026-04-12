async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) {
    throw new Error(json.error || `Request failed (${res.status})`)
  }
  return json.data
}

export async function getInvitations() {
  return api('/api/invitations')
}

export async function acceptInvitation(inviteID) {
  return api(`/api/invitations/${inviteID}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'Accepted' })
  })
}

export async function declineInvitation(inviteID) {
  return api(`/api/invitations/${inviteID}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'Declined' })
  })
}

export async function sendInvitation(identifier, clubId) {
  return api('/api/invitations', {
    method: 'POST',
    body: JSON.stringify({ identifier, clubId })
  })
}

export async function getInvitationCount() {
  return api('/api/invitations/count')
}
