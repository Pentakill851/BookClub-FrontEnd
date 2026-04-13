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

export async function getClub(id) {
  const res = await fetch(`/api/club/${id}`, { credentials: 'include' })
  return res.json()
}

export async function joinClub(clubID) {
  return api('/api/communities/join', {
    method: 'POST',
    body: JSON.stringify({ clubId: clubID })
  })
}

export async function joinPrivateClub(clubID, passcode) {
  return api('/api/communities/join', {
    method: 'POST',
    body: JSON.stringify({ clubId: clubID, passcode })
  })
}

export async function leaveClub(clubID) {
  return api(`/api/communities/${clubID}/leave`, {
    method: 'DELETE'
  })
}

export async function addBookToClub(clubID, isbn, status = 'Not Started') {
  return api(`/api/club/${clubID}/books`, {
    method: 'POST',
    body: JSON.stringify({ isbn, status })
  })
}

export async function updateClubBookStatus(clubID, isbn, status) {
  return api(`/api/club/${clubID}/books/${isbn}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function removeBookFromClub(clubID, isbn) {
  return api(`/api/club/${clubID}/books/${isbn}`, { method: 'DELETE' })
}
