export async function getClubsForCompose() {
  const res = await fetch('/api/compose/clubs', {
    credentials: 'include'
  })
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error || 'Failed to fetch clubs')
  }

  return json.data
}

export async function searchBooksForCite(query) {
  const url = `/api/compose/books?q=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    credentials: 'include'
  })
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error || 'Failed to search books')
  }

  return json.data
}

export async function createThread({ clubID, isbn, topic, content }) {
  const body = { clubID, topic, content }
  if (isbn) {
    body.isbn = isbn
  }

  const res = await fetch('/api/compose/thread', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  })
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error || 'Failed to create thread')
  }

  return json.data
}

export async function createReview({ clubID, isbn, topic, content, starRating }) {
  const res = await fetch('/api/compose/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ clubID, isbn, topic, content, starRating })
  })
  const json = await res.json()

  if (!res.ok || json.error) {
    throw new Error(json.error || 'Failed to create review')
  }

  return json.data
}
