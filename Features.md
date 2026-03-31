# BookClubDB — Feature Overview

---

## F1 — Search

Users type a keyword into the search bar in the top nav. Results show matching books (by title or author) and matching discussion threads. No login required.

| | |
|---|---|
| Backend | `routes/search.js` |
| Frontend view | `SearchView.vue` |
| Frontend API | `api/search.js` → `search(query)` |
| Route | `GET /api/search?q=<query>` |
| Auth | No |

---

## F2 — Compose

Users create a new discussion thread from the Compose page. They pick a club, optionally link a book, and write a topic. If they check "Add Review" they also submit a star rating (1–5), which creates a book review thread. Requires login.

| | |
|---|---|
| Backend | `routes/compose.js` |
| Frontend view | `ComposeView.vue` |
| Frontend API | `api/compose.js` → `createThread(data)`, `createReview(data)` |
| Routes | `POST /api/compose/thread`, `POST /api/compose/review` |
| Auth | Yes |

---

## F3 — Feed

The home page. Shows a chronological feed of threads from clubs the user has joined. Each card shows the thread topic, creator, club name, book title if linked, reply count, and star rating if it's a review. Requires login.

| | |
|---|---|
| Backend | `routes/feed.js` |
| Frontend view | `FeedView.vue` |
| Frontend API | `api/feed.js` → `getFeed()` |
| Route | `GET /api/feed` |
| Auth | Yes |

---

## F4 — Thread Detail / Delete

Users click a thread from the feed to open the full conversation. The page shows the original post and all replies in order. Any logged-in user can post a reply. If the logged-in user is a moderator of that club, a Delete button appears — deleting the thread removes it along with all its messages and review.

| | |
|---|---|
| Backend | `routes/thread.js` |
| Frontend view | `ThreadView.vue` |
| Frontend API | `api/thread.js` → `getThread(id)`, `postReply(id, content)`, `deleteThread(id)` |
| Routes | `GET /api/thread/:id`, `POST /api/thread/:id/reply`, `DELETE /api/thread/:id` |
| Auth | GET — No · POST/DELETE — Yes |

---

## F5 — My Books

A page showing the user's personal reading list. Each entry shows the book title, author, genre, reading status (Read / Reading / Want to Read), and their personal star rating. Requires login.

| | |
|---|---|
| Backend | `routes/books.js` |
| Frontend view | `MyBooksView.vue` |
| Frontend API | `api/books.js` → `getMyBooks()` |
| Route | `GET /api/books/my` |
| Auth | Yes |

---

## F6 — Invitations

A page showing club invitations the user has received. Each card shows the club name, who sent the invite, and the current status. Pending invitations have Accept and Decline buttons. Accepting automatically adds the user to the club. Requires login.

| | |
|---|---|
| Backend | `routes/invitations.js` |
| Frontend view | `InvitationsView.vue` |
| Frontend API | `api/invitations.js` → `getInvitations()`, `updateInvitation(id, status)` |
| Routes | `GET /api/invitations`, `PUT /api/invitations/:id` |
| Auth | Yes |

---

## F7 — My Communities

A page listing all clubs the logged-in user has joined. Each entry shows the club name and whether it's Public or Private. Includes a link to Discover for users with no clubs yet. Requires login.

| | |
|---|---|
| Backend | `routes/communities.js` |
| Frontend view | `CommunitiesView.vue` |
| Frontend API | `api/communities.js` → `getMyCommunities()` |
| Route | `GET /api/communities/my` |
| Auth | Yes |

---

## F8 — Discover

A two-panel page. The left side lists public clubs the user hasn't joined yet — each has a Join button. The right side shows a top-rated books leaderboard ranked by average review star rating with review count. Requires login.

| | |
|---|---|
| Backend | `routes/discover.js` |
| Frontend view | `DiscoverView.vue` |
| Frontend API | `api/discover.js` → `getClubs()`, `getTopBooks()` |
| Routes | `GET /api/discover/clubs`, `GET /api/discover/top-books` |
| Auth | Yes |

---

## F9 — Profile

A page showing the user's account info and reading stats: number of clubs joined, number of books rated, and average personal rating. Below the stats is a list of all books the user has rated. Requires login.

| | |
|---|---|
| Backend | `routes/profile.js` |
| Frontend view | `ProfileView.vue` |
| Frontend API | `api/profile.js` → `getProfile()` |
| Route | `GET /api/profile` |
| Auth | Yes |