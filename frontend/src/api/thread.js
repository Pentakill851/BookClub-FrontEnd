const DELAY = 500

const THREADS = {
  1: {
    ThreadID: 1, Topic: 'Orwell Predictions', ClubName: 'Sci-Fi Explorers', ClubID: 1,
    BookTitle: '1984', ISBN: '9780451524935', AuthorName: 'Alice', AuthorID: 1,
    CreatedAt: '2026-03-30T10:00:00', isReview: true, starRating: 5,
  },
  2: {
    ThreadID: 2, Topic: 'Gatsby Symbolism', ClubName: 'Classic Lit', ClubID: 2,
    BookTitle: 'The Great Gatsby', ISBN: '9780743273565', AuthorName: 'Bob', AuthorID: 2,
    CreatedAt: '2026-03-29T09:00:00', isReview: true, starRating: 4,
  },
  3: {
    ThreadID: 3, Topic: 'Hobbit Journey pacing', ClubName: 'Tolkien Fanatics', ClubID: 6,
    BookTitle: 'The Hobbit', ISBN: '9780345339683', AuthorName: 'Charlie', AuthorID: 3,
    CreatedAt: '2026-03-30T07:00:00', isReview: false, starRating: null,
  },
  4: {
    ThreadID: 4, Topic: 'Atticus Ethics', ClubName: 'Mystery Solvers', ClubID: 4,
    BookTitle: 'To Kill a Mockingbird', ISBN: '9780061120084', AuthorName: 'Dana', AuthorID: 4,
    CreatedAt: '2026-03-28T15:00:00', isReview: false, starRating: null,
  },
  5: {
    ThreadID: 5, Topic: 'Is this book worth the length?', ClubName: 'Classic Lit', ClubID: 2,
    BookTitle: 'War and Peace', ISBN: '9780140449136', AuthorName: 'Dana', AuthorID: 4,
    CreatedAt: '2026-03-29T12:00:00', isReview: false, starRating: null,
  },
}

const MESSAGES = {
  1: [
    { ThreadID: 1, MessageNum: 1, UserID: 1, AuthorName: 'Alice', Content: 'This book was ahead of its time. The concepts of surveillance are terrifyingly relevant today.', Timestamp: '2026-03-30T10:00:00' },
    { ThreadID: 1, MessageNum: 2, UserID: 2, AuthorName: 'Bob', Content: 'I completely agree! The telescreens got me thinking about modern smart devices.', Timestamp: '2026-03-30T10:15:00' },
    { ThreadID: 1, MessageNum: 3, UserID: 3, AuthorName: 'Charlie', Content: 'The Newspeak concept is chilling. Limiting language to limit thought.', Timestamp: '2026-03-30T11:00:00' },
    { ThreadID: 1, MessageNum: 4, UserID: 4, AuthorName: 'Dana', Content: 'Room 101 was the hardest part for me to read. Orwell really understood fear.', Timestamp: '2026-03-30T12:30:00' },
  ],
  2: [
    { ThreadID: 2, MessageNum: 1, UserID: 2, AuthorName: 'Bob', Content: 'The green light is fascinating. It represents the unattainable American Dream so perfectly.', Timestamp: '2026-03-29T09:00:00' },
  ],
  3: [
    { ThreadID: 3, MessageNum: 1, UserID: 3, AuthorName: 'Charlie', Content: 'Does anyone else feel like the journey to the Misty Mountains drags on just a little bit too long?', Timestamp: '2026-03-30T07:00:00' },
    { ThreadID: 3, MessageNum: 2, UserID: 5, AuthorName: 'Evan', Content: 'It builds the atmosphere! You need to feel the distance to appreciate the journey.', Timestamp: '2026-03-30T07:45:00' },
    { ThreadID: 3, MessageNum: 3, UserID: 1, AuthorName: 'Alice', Content: "I think Tolkien's world-building requires that pacing. Every paragraph adds lore.", Timestamp: '2026-03-30T08:10:00' },
  ],
  4: [
    { ThreadID: 4, MessageNum: 1, UserID: 4, AuthorName: 'Dana', Content: 'A timeless classic.', Timestamp: '2026-03-28T15:00:00' },
    { ThreadID: 4, MessageNum: 2, UserID: 1, AuthorName: 'Alice', Content: 'Atticus defending Tom Robinson despite knowing the likely outcome — that is moral courage.', Timestamp: '2026-03-28T16:00:00' },
  ],
  5: [
    { ThreadID: 5, MessageNum: 1, UserID: 5, AuthorName: 'Dana', Content: 'I am on page 300 and taking a break. Someone please tell me the ending makes the commitment worth it.', Timestamp: '2026-03-29T12:00:00' },
    { ThreadID: 5, MessageNum: 2, UserID: 1, AuthorName: 'Alice', Content: "Stick with it! The character arcs are incredible. Pierre's journey alone is worth it.", Timestamp: '2026-03-29T12:30:00' },
    { ThreadID: 5, MessageNum: 3, UserID: 2, AuthorName: 'Bob', Content: 'The battle of Borodino chapters are some of the greatest writing in literature. Trust the process.', Timestamp: '2026-03-29T13:00:00' },
  ],
}

export function getThread(id) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      const thread = THREADS[id]
      thread ? resolve(thread) : reject(new Error('Thread not found'))
    }, DELAY)
  )
}

export function getMessages(threadID) {
  return new Promise(resolve =>
    setTimeout(() => resolve(MESSAGES[threadID] || []), DELAY)
  )
}

export function postMessage(threadID, content) {
  return new Promise(resolve =>
    setTimeout(() => resolve({
      ThreadID: threadID,
      MessageNum: 99,
      UserID: 1,
      AuthorName: 'Alice',
      Content: content,
      Timestamp: new Date().toISOString(),
    }), DELAY)
  )
}

export function deleteThread(threadID) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), DELAY))
}
