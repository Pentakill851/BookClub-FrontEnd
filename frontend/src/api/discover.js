export async function getDiscoverBooks() {
  try {
    const res = await fetch('/api/discover/top-books', { credentials: 'include' })
    const { data, error } = await res.json()

    if (error) {
      console.error('Error fetching discover books:', error)
      return []
    }

    return data.map(row => ({
      ...row,
      readerCount: Number(row.readerCount),
      clubCount: Number(row.clubCount),
      avgRating: Number(row.avgRating)
    }))
  } catch (err) {
    console.error('Error fetching discover books:', err)
    return []
  }
}
