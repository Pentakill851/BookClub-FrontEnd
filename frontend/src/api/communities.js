const DELAY = 500

let nextClubID = 100

export function getMyCommmunities() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ClubID: 1, Name: 'Sci-Fi Explorers', Description: 'Boldly reading where no one has read before.', type: 'Private', isModerator: true, memberCount: 12, currentBook: '1984' },
      { ClubID: 6, Name: 'Tolkien Fanatics', Description: 'One club to rule them all.', type: 'Public', isModerator: false, memberCount: 34, currentBook: 'The Hobbit' },
      { ClubID: 2, Name: 'Classic Lit', Description: 'The great books deserve great discussion.', type: 'Public', isModerator: false, memberCount: 21, currentBook: 'War and Peace' },
    ]), DELAY)
  )
}

export function getPublicCommunities() {
  return new Promise(resolve =>
    setTimeout(() => resolve([
      { ClubID: 3, Name: 'Fantasy Realm', Description: 'Swords, sorcery, and everything magic.', type: 'Public', memberCount: 58, currentBook: 'The Hobbit' },
      { ClubID: 5, Name: 'Local Authors', Description: 'Supporting writers from our community.', type: 'Public', memberCount: 15, currentBook: null },
      { ClubID: 7, Name: 'The Gatsby Club', Description: 'A deep dive into the symbolism of the Roaring 20s.', type: 'Public', memberCount: 9, currentBook: 'The Great Gatsby' },
      { ClubID: 8, Name: 'Historical Fiction Readers', Description: 'Travel back in time through literature.', type: 'Public', memberCount: 27, currentBook: 'War and Peace' },
      { ClubID: 9, Name: 'Short Story Circle', Description: 'One short story a week, deep discussion.', type: 'Public', memberCount: 19, currentBook: null },
    ]), DELAY)
  )
}

export function joinClub(clubID) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, ClubID: clubID }), DELAY))
}

export function joinPrivateClub(clubID, passcode) {
  // mock passcodes: 'scifi123' for club 1, 'clue456' for club 4
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (passcode === 'scifi123' || passcode === 'clue456') {
        resolve({ success: true, ClubID: clubID })
      } else {
        reject(new Error('Incorrect passcode. Please check with the club moderator.'))
      }
    }, DELAY)
  )
}

export function createClub({ name, description, type, passcode }) {
  return new Promise(resolve =>
    setTimeout(() => resolve({
      ClubID: nextClubID++,
      Name: name,
      Description: description,
      type,
      isModerator: true,
      memberCount: 1,
      currentBook: null,
    }), DELAY)
  )
}
