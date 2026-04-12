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

export async function getMyCommunities() {
  return api('/api/communities/my')
}

export async function getPublicCommunities() {
  return api('/api/communities/public')
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

export async function createClub({ name, description, type, passcode }) {
  return api('/api/communities', {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      type,
      passcode: passcode ?? ''
    })
  })
}

export async function deleteClub(clubID) {
  return api(`/api/communities/${clubID}`, { method: 'DELETE' })
}

/** @deprecated Use getMyCommunities — kept for any stale imports */
export const getMyCommmunities = getMyCommunities
