export async function getThread(id) {
  try {
    const res = await fetch(`/api/thread/${id}`, { credentials: 'include' })
    const result = await res.json()
    if (result.error) return null
    return result.data
  } catch {
    return null
  }
}

export async function getMessages(id) {
  try {
    const res = await fetch(`/api/thread/${id}/messages`, { credentials: 'include' })
    const result = await res.json()
    if (result.error) return []
    return result.data
  } catch {
    return []
  }
}

export async function postMessage(threadID, content) {
  const res = await fetch(`/api/thread/${threadID}/reply`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  const result = await res.json()
  if (result.error) throw new Error(result.error)
  return result.data
}

export async function deleteThread(threadID) {
  const res = await fetch(`/api/thread/${threadID}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  const result = await res.json()
  if (result.error) throw new Error(result.error)
  return result.data
}
