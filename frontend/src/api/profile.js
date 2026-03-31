export async function getProfile() {
  const res = await fetch('/api/profile', { credentials: 'include' })
  return res.json()
}
