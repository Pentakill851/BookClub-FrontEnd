export async function getFeed() {
  const res = await fetch('/api/feed', { credentials: 'include' })
  return res.json()
}
