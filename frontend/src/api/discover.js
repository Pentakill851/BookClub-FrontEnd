const DELAY = 600

// grab trending books from across all the clubs
export function getDiscoverBooks() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ISBN: '9780451524935', Title: '1984', Author: 'George Orwell', Genre: 'Dystopian', readerCount: 18, avgRating: 4.7, clubCount: 3 },
      { ISBN: '9780345339683', Title: 'The Hobbit', Author: 'J.R.R. Tolkien', Genre: 'Fantasy', readerCount: 15, avgRating: 4.5, clubCount: 2 },
      { ISBN: '9780061120084', Title: 'To Kill a Mockingbird', Author: 'Harper Lee', Genre: 'Fiction', readerCount: 12, avgRating: 4.6, clubCount: 3 },
      { ISBN: '9780743273565', Title: 'The Great Gatsby', Author: 'F. Scott Fitzgerald', Genre: 'Fiction', readerCount: 10, avgRating: 4.1, clubCount: 2 },
      { ISBN: '9780140449136', Title: 'War and Peace', Author: 'Leo Tolstoy', Genre: 'Classic', readerCount: 9, avgRating: 4.4, clubCount: 2 },
      { ISBN: '9780374528379', Title: 'Anna Karenina', Author: 'Leo Tolstoy', Genre: 'Classic', readerCount: 7, avgRating: 4.3, clubCount: 1 },
      { ISBN: '9780316769174', Title: 'The Catcher in the Rye', Author: 'J.D. Salinger', Genre: 'Fiction', readerCount: 6, avgRating: 3.9, clubCount: 1 },
      { ISBN: '9780743269513', Title: 'Romeo and Juliet', Author: 'William Shakespeare', Genre: 'Drama', readerCount: 5, avgRating: 4.0, clubCount: 1 },
    ]), DELAY)
  )
}
