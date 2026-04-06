const DELAY = 400

export function getClubsForCompose() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ClubID: 1, Name: 'Sci-Fi Explorers', type: 'Private' },
      { ClubID: 6, Name: 'Tolkien Fanatics', type: 'Public' },
      { ClubID: 2, Name: 'Classic Lit', type: 'Public' },
    ]), DELAY)
  )
}

export function searchBooksForCite(query) {
  const ALL = [
    { ISBN: '9780140449136', Title: 'War and Peace', Author: 'Leo Tolstoy' },
    { ISBN: '9780451524935', Title: '1984', Author: 'George Orwell' },
    { ISBN: '9780743273565', Title: 'The Great Gatsby', Author: 'F. Scott Fitzgerald' },
    { ISBN: '9780061120084', Title: 'To Kill a Mockingbird', Author: 'Harper Lee' },
    { ISBN: '9780345339683', Title: 'The Hobbit', Author: 'J.R.R. Tolkien' },
  ]
  return new Promise(resolve =>
    setTimeout(() => {
      const q = query.toLowerCase()
      resolve(q ? ALL.filter(b => b.Title.toLowerCase().includes(q) || b.Author.toLowerCase().includes(q)) : ALL)
    }, 200)
  )
}

export function createThread({ clubID, isbn, topic, content, isReview, starRating }) {
  return new Promise(resolve =>
    setTimeout(() => resolve({
      ThreadID: Math.floor(Math.random() * 1000) + 100,
      ClubID: clubID,
      ISBN: isbn,
      Topic: topic,
      Content: content,
      isReview,
      starRating: isReview ? starRating : null,
      CreatedAt: new Date().toISOString(),
    }), DELAY)
  )
}
