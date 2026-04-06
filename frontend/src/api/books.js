const DELAY = 500

export function getMyBooks() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ISBN: '9780451524935', Title: '1984', Author: 'George Orwell', Genre: 'Dystopian', PublishedYear: 1949, Status: 'Read', PersonalRating: 5, AddedToListAt: '2026-01-01' },
      { ISBN: '9780345339683', Title: 'The Hobbit', Author: 'J.R.R. Tolkien', Genre: 'Fantasy', PublishedYear: 1937, Status: 'Reading', PersonalRating: null, AddedToListAt: '2026-01-15' },
      { ISBN: '9780061120084', Title: 'To Kill a Mockingbird', Author: 'Harper Lee', Genre: 'Fiction', PublishedYear: 1960, Status: 'Read', PersonalRating: 4, AddedToListAt: '2026-01-04' },
      { ISBN: '9780140449136', Title: 'War and Peace', Author: 'Leo Tolstoy', Genre: 'Classic', PublishedYear: 1869, Status: 'Want to Read', PersonalRating: null, AddedToListAt: '2026-02-01' },
      { ISBN: '9780743273565', Title: 'The Great Gatsby', Author: 'F. Scott Fitzgerald', Genre: 'Fiction', PublishedYear: 1925, Status: 'Read', PersonalRating: 3, AddedToListAt: '2025-12-10' },
    ]), DELAY)
  )
}

export function addBook(isbn, status) {
  return new Promise(resolve =>
    setTimeout(() => resolve({ ISBN: isbn, Status: status, AddedToListAt: new Date().toISOString() }), DELAY)
  )
}

export function updateBookStatus(isbn, status) {
  return new Promise(resolve => setTimeout(() => resolve({ ISBN: isbn, Status: status }), DELAY))
}

export function rateBook(isbn, rating) {
  return new Promise(resolve => setTimeout(() => resolve({ ISBN: isbn, PersonalRating: rating }), DELAY))
}
