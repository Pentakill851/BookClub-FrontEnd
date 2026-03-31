export async function search(query) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { credentials: 'include' })
  return res.json()
}
