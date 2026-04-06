async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) {
    throw new Error(json.error || `Request failed (${res.status})`)
  }
  return json.data
}

export async function getMyBooks() {
  return api('/api/books/my')
}

export async function addBook(isbn, status = 'Want to Read') {
  return api('/api/books/my', {
    method: 'POST',
    body: JSON.stringify({ isbn, status })
  })
}

export async function updateBookStatus(isbn, status) {
  return api(`/api/books/my/${encodeURIComponent(isbn)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

export async function rateBook(isbn, rating) {
  return api(`/api/books/my/${encodeURIComponent(isbn)}/rating`, {
    method: 'PATCH',
    body: JSON.stringify({ rating })
  })
}
