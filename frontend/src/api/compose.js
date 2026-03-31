export async function createThread(data) {
  const res = await fetch('/api/compose/thread', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function createReview(data) {
  const res = await fetch('/api/compose/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  return res.json()
}
