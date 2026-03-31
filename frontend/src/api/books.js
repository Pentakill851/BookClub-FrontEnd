export async function getMyBooks() {
  const res = await fetch('/api/books/my', { credentials: 'include' })
  return res.json()
}
