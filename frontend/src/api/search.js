function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return m <= 1 ? 'just now' : `${m} minutes ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  const d = Math.floor(h / 24)
  return `${d} day${d > 1 ? 's' : ''} ago`
}

export async function searchBooks(query) {
  try {
    const res = await fetch(`/api/search/books?q=${encodeURIComponent(query)}`, {
      credentials: 'include'
    })
    const result = await res.json()
    if (result.error) return []
    return result.data
  } catch {
    return []
  }
}

export async function searchThreads(query) {
  try {
    const res = await fetch(`/api/search/threads?q=${encodeURIComponent(query)}`, {
      credentials: 'include'
    })
    const result = await res.json()
    if (result.error) return []
    return result.data.map(thread => ({
      ...thread,
      timeAgo: timeAgo(thread.CreatedAt)
    }))
  } catch {
    return []
  }
}
