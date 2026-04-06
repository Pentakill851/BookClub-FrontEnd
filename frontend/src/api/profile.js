const DELAY = 500

export function getProfile(userID) {
  const profiles = {
    1: { UserID: 1, Username: 'Alice', Email: 'alice@sfu.ca', JoinDate: '2026-01-01' },
    2: { UserID: 2, Username: 'Bob',   Email: 'bob@sfu.ca',   JoinDate: '2026-01-02' },
    3: { UserID: 3, Username: 'Charlie', Email: 'charlie@sfu.ca', JoinDate: '2026-01-03' },
  }
  return new Promise(resolve =>
    setTimeout(() => resolve(profiles[userID] || profiles[1]), DELAY)
  )
}

export function getProfileStats(userID) {
  return new Promise(resolve =>
    setTimeout(() => resolve({
      booksRead: 3,
      booksReading: 1,
      wantToRead: 1,
      reviewsWritten: 2,
      clubsJoined: 3,
      threadsStarted: 1,
    }), DELAY)
  )
}

export function getProfileBooks(userID) {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ISBN: '9780451524935', Title: '1984', Author: 'George Orwell', Genre: 'Dystopian', Status: 'Read', PersonalRating: 5 },
      { ISBN: '9780345339683', Title: 'The Hobbit', Author: 'J.R.R. Tolkien', Genre: 'Fantasy', Status: 'Reading', PersonalRating: null },
      { ISBN: '9780061120084', Title: 'To Kill a Mockingbird', Author: 'Harper Lee', Genre: 'Fiction', Status: 'Read', PersonalRating: 4 },
      { ISBN: '9780140449136', Title: 'War and Peace', Author: 'Leo Tolstoy', Genre: 'Classic', Status: 'Want to Read', PersonalRating: null },
      { ISBN: '9780743273565', Title: 'The Great Gatsby', Author: 'F. Scott Fitzgerald', Genre: 'Fiction', Status: 'Read', PersonalRating: 3 },
    ]), DELAY)
  )
}

export function getProfileReviews(userID) {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ThreadID: 1, Topic: 'Orwell Predictions', BookTitle: '1984', ClubName: 'Sci-Fi Explorers', starRating: 5, timeAgo: '2 hours ago', replyCount: 14 },
      { ThreadID: 2, Topic: 'Gatsby Symbolism', BookTitle: 'The Great Gatsby', ClubName: 'Classic Lit', starRating: 4, timeAgo: '1 day ago', replyCount: 0 },
    ]), DELAY)
  )
}

export function getProfileClubs(userID) {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ClubID: 1, Name: 'Sci-Fi Explorers', type: 'Private', isModerator: true, memberCount: 12 },
      { ClubID: 6, Name: 'Tolkien Fanatics', type: 'Public', isModerator: false, memberCount: 34 },
      { ClubID: 2, Name: 'Classic Lit', type: 'Public', isModerator: false, memberCount: 21 },
    ]), DELAY)
  )
}
