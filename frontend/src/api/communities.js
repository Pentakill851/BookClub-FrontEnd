export async function getMyCommunities() {
  const res = await fetch('/api/communities/my', { credentials: 'include' })
  return res.json()
}
