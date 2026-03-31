export async function getInvitations() {
  const res = await fetch('/api/invitations', { credentials: 'include' })
  return res.json()
}

export async function updateInvitation(id, status) {
  const res = await fetch(`/api/invitations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status })
  })
  return res.json()
}
