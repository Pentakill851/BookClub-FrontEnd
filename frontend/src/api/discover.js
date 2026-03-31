export async function getClubs() {
  const res = await fetch('/api/discover/clubs', { credentials: 'include' })
  return res.json()
}

export async function getTopBooks() {
  const res = await fetch('/api/discover/top-books', { credentials: 'include' })
  return res.json()
}
