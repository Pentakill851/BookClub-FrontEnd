const DELAY = 600

export function getFeed() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      {
        ThreadID: 1,
        Topic: 'Orwell Predictions',
        ClubName: 'Sci-Fi Explorers',
        BookTitle: '1984',
        AuthorName: 'Alice',
        timeAgo: '2 hours ago',
        isReview: true,
        starRating: 5,
        initialMessage: 'This book was ahead of its time. The concepts of surveillance are terrifyingly relevant today.',
        latestReply: { author: 'Bob', content: 'I completely agree! The telescreens got me.' },
        replyCount: 14,
      },
      {
        ThreadID: 3,
        Topic: 'Hobbit Journey pacing',
        ClubName: 'Tolkien Fanatics',
        BookTitle: 'The Hobbit',
        AuthorName: 'Charlie',
        timeAgo: '5 hours ago',
        isReview: false,
        starRating: null,
        initialMessage: 'Does anyone else feel like the journey to the Misty Mountains drags on just a little bit too long?',
        latestReply: { author: 'Evan', content: 'It builds the atmosphere! You need to feel the distance.' },
        replyCount: 8,
      },
      {
        ThreadID: 2,
        Topic: 'Gatsby Symbolism',
        ClubName: 'Classic Lit',
        BookTitle: 'The Great Gatsby',
        AuthorName: 'Bob',
        timeAgo: '1 day ago',
        isReview: true,
        starRating: 4,
        initialMessage: 'The green light is fascinating. It represents the unattainable American Dream so perfectly.',
        latestReply: null,
        replyCount: 0,
      },
      {
        ThreadID: 5,
        Topic: 'Is this book worth the length?',
        ClubName: 'Classic Lit',
        BookTitle: 'War and Peace',
        AuthorName: 'Dana',
        timeAgo: '2 days ago',
        isReview: false,
        starRating: null,
        initialMessage: 'I am on page 300 and taking a break. Someone please tell me the ending makes the commitment worth it.',
        latestReply: { author: 'Alice', content: 'Stick with it! The character arcs are incredible.' },
        replyCount: 22,
      },
    ]), DELAY)
  )
}

export function getInvitations() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { InviteID: 5, ClubName: 'Mystery Solvers', ClubID: 4 },
      { InviteID: 6, ClubName: 'Local Authors', ClubID: 5 },
    ]), DELAY)
  )
}

export function getMyClubs() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ClubID: 1, Name: 'Sci-Fi Explorers', type: 'Private', isModerator: true },
      { ClubID: 6, Name: 'Tolkien Fanatics', type: 'Public', isModerator: false },
      { ClubID: 2, Name: 'Classic Lit', type: 'Public', isModerator: false },
    ]), DELAY)
  )
}

export function getRecommendedClubs() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ClubID: 3, Name: 'Fantasy Realm', Description: 'Swords, sorcery, and everything magic.' },
      { ClubID: 7, Name: 'The Gatsby Club', Description: 'A deep dive into the symbolism of the Roaring 20s.' },
      { ClubID: 8, Name: 'Historical Fiction Readers', Description: 'Travel back in time through literature.' },
    ]), DELAY)
  )
}

export function acceptInvitation(inviteID) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, inviteID }), DELAY))
}

export function declineInvitation(inviteID) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, inviteID }), DELAY))
}
