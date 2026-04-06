const DELAY = 500

const ALL_BOOKS = [
  { ISBN: '9780140449136', Title: 'War and Peace', Author: 'Leo Tolstoy', Genre: 'Classic', PublishedYear: 1869 },
  { ISBN: '9780451524935', Title: '1984', Author: 'George Orwell', Genre: 'Dystopian', PublishedYear: 1949 },
  { ISBN: '9780743273565', Title: 'The Great Gatsby', Author: 'F. Scott Fitzgerald', Genre: 'Fiction', PublishedYear: 1925 },
  { ISBN: '9780061120084', Title: 'To Kill a Mockingbird', Author: 'Harper Lee', Genre: 'Fiction', PublishedYear: 1960 },
  { ISBN: '9780345339683', Title: 'The Hobbit', Author: 'J.R.R. Tolkien', Genre: 'Fantasy', PublishedYear: 1937 },
  { ISBN: '9780374528379', Title: 'Anna Karenina', Author: 'Leo Tolstoy', Genre: 'Classic', PublishedYear: 1878 },
  { ISBN: '9780743269513', Title: 'Romeo and Juliet', Author: 'William Shakespeare', Genre: 'Drama', PublishedYear: 1597 },
  { ISBN: '9780316769174', Title: 'The Catcher in the Rye', Author: 'J.D. Salinger', Genre: 'Fiction', PublishedYear: 1951 },
]

const ALL_THREADS = [
  { ThreadID: 1, Topic: 'Orwell Predictions', ClubName: 'Sci-Fi Explorers', BookTitle: '1984', AuthorName: 'Alice', timeAgo: '2 hours ago', replyCount: 14 },
  { ThreadID: 2, Topic: 'Gatsby Symbolism', ClubName: 'Classic Lit', BookTitle: 'The Great Gatsby', AuthorName: 'Bob', timeAgo: '1 day ago', replyCount: 0 },
  { ThreadID: 3, Topic: 'Hobbit Journey pacing', ClubName: 'Tolkien Fanatics', BookTitle: 'The Hobbit', AuthorName: 'Charlie', timeAgo: '5 hours ago', replyCount: 8 },
  { ThreadID: 4, Topic: 'Atticus Ethics', ClubName: 'Mystery Solvers', BookTitle: 'To Kill a Mockingbird', AuthorName: 'Dana', timeAgo: '3 days ago', replyCount: 5 },
  { ThreadID: 5, Topic: 'Is this book worth the length?', ClubName: 'Classic Lit', BookTitle: 'War and Peace', AuthorName: 'Dana', timeAgo: '2 days ago', replyCount: 22 },
]

function matches(item, query) {
  const q = query.toLowerCase()
  return Object.values(item).some(v => String(v).toLowerCase().includes(q))
}

export function searchBooks(query) {
  return new Promise(resolve =>
    setTimeout(() => {
      const results = query ? ALL_BOOKS.filter(b => matches(b, query)) : ALL_BOOKS
      resolve(results)
    }, DELAY)
  )
}

export function searchThreads(query) {
  return new Promise(resolve =>
    setTimeout(() => {
      const results = query ? ALL_THREADS.filter(t => matches(t, query)) : ALL_THREADS
      resolve(results)
    }, DELAY)
  )
}
