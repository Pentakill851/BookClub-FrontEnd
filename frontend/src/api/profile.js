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

export async function getProfile(_userID) {
  return api('/api/profile')
}

export async function getProfileStats(_userID) {
  return api('/api/profile/stats')
}

export async function getProfileBooks(_userID) {
  return api('/api/profile/books')
}

export async function getProfileReviews(_userID) {
  return api('/api/profile/reviews')
}

export async function getProfileClubs(_userID) {
  return api('/api/profile/clubs')
}
