export async function getThread(id) {
  const res = await fetch(`/api/thread/${id}`, { credentials: 'include' })
  return res.json()
}

export async function postReply(id, content) {
  const res = await fetch(`/api/thread/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content })
  })
  return res.json()
}

export async function deleteThread(id) {
  const res = await fetch(`/api/thread/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return res.json()
}
