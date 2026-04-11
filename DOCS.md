# BookClubDB — Developer Docs

CMPT 354 Course Project. MySQL + Express + Vue 3 book club platform.

---

## Contents

- [⚠️ Read this before you start](#️-read-this-before-you-start)
- [Feature assignments](#feature-assignments)
- [Running the app](#running-the-app)
- [Building your feature](#building-your-feature)
  - [Step 1: Write your database query](#step-1-write-your-database-query)
  - [Step 2: Build your page](#step-2-build-your-page)
  - [Step 3: Wrap it in the shared layout](#step-3-wrap-it-in-the-shared-layout)
- [Rules that apply to everyone](#rules-that-apply-to-everyone)
- [Database reference](#database-reference)
- [Routes and APIs already built](#routes-and-apis-already-built)
- [How login and sessions work](#how-login-and-sessions-work)
- [Other known issues](#other-known-issues)

---

## ⚠️ Read this before you start

### CASCADE fix — ✅ Added to init.sql — apply migration to live DB

`Message_ibfk_1` now includes `ON DELETE CASCADE` in init.sql. Apply the migration comment block at the bottom of init.sql to update the live DB.

### Trigger 1 — ✅ Added to init.sql — apply migration to live DB

`BEFORE INSERT ON Moderates` — verifies the user already has a row in `Joins` for the same club. Now defined in init.sql — apply to live DB.

### Trigger 2 — ✅ Added to init.sql — apply migration to live DB

`AFTER UPDATE ON Invitation` — auto-inserts into `Joins` when `Status` changes to `'Accepted'`. Now defined in init.sql — apply to live DB.

### Trigger 3 — TBD

Not decided yet. Document in CLAUDE.md once agreed upon.

---

## Feature assignments

Which files to edit for each feature. All backend files live in `backend/routes/`. All frontend files live in `frontend/src/`.

| Feature | ID | Owner | Backend file | Frontend view | Frontend API file | Status |
|---|---|---|---|---|---|---|
| Auth (login/logout) | — | TBD | `routes/auth.js` | `LoginView.vue` | `api/auth.js` | ✅ Done |
| Search Books / Archives | F1 | TBD | `routes/search.js` | `SearchView.vue` | `api/search.js` | ✅ Done — GET /books and /threads with LIKE queries |
| COMPOSE (Create Discussion Post or Review) | F2 | An | `routes/compose.js` | `ComposeView.vue` | `api/compose.js` | ✅ Done — full backend with requireAuth and transactions |
| Feed | F3 | TBD | `routes/feed.js` | `FeedView.vue` | `api/feed.js` | ✅ Done — threads from user's clubs |
| Thread Detail / Delete | F4 | An | `routes/thread.js` | `ThreadView.vue` | `api/thread.js` | ✅ Done — GET, messages, reply, delete with requireAuth |
| My Books | F5 | TBD | `routes/books.js` | `MyBooksView.vue` | `api/books.js` | ✅ Done — uses `Rates.Rating` |
| Invitations | F6 | TBD | `routes/invitations.js` | `InvitationsView.vue` | `api/invitations.js` | ✅ Done — auto-join via Trigger 2 |
| Communities | F7 | TBD | `routes/communities.js` | `CommunitiesView.vue` | `api/communities.js` | ✅ Done — includes join + create club |
| Discover | F8 | TBD | `routes/discover.js` | `DiscoverView.vue` | `api/discover.js` | ✅ Done — division query + aggregation query |
| Profile | F9 | TBD | `routes/profile.js` | `ProfileView.vue` | `api/profile.js` | ✅ Done — stats, books, reviews, clubs sub-routes |

---

## Running the app

Requires two terminals and a `.env` file in `backend/`.

```bash
# Copy and fill in Railway credentials
cp backend/.env.example backend/.env
```

Required `.env` keys:
```
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=BookClubDB
SESSION_SECRET=
PORT=3000
```

```bash
# Terminal 1 — backend (Express on port 3000)
cd backend && node app.js

# Terminal 2 — frontend (Vite dev server on port 5173)
cd frontend && npm run dev
```

On startup, watch the terminal for `Database connected` or an error. If the DB connection fails the server exits immediately.

To log in with seed data: `email: alice@sfu.ca`, `password: hash1` (or bob/hash2, charlie/hash3, etc.)

---

## Building your feature

Each feature follows the same three steps. Work through them in order.

### Step 1: Write your database query

Your backend file is the file listed in the [Feature assignments](#feature-assignments) table under "Backend file". Open it — it currently returns an empty response. Replace that with a real SQL query.

```javascript
import express from 'express'
import pool from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM Thread WHERE UserID = ?',
      [req.session.userID]   // the logged-in user's ID
    )
    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
```

**Always use `?` placeholders** — never put variables directly inside the SQL string (see [SQL safety](#sql-safety)).

**If your route should require login**, add `requireAuth` after the path (as shown above). See [How login and sessions work](#how-login-and-sessions-work) for details.

**Generating new IDs** — no table uses auto-increment. Generate IDs manually:

```javascript
const [[{ maxId }]] = await pool.execute('SELECT MAX(ThreadID) as maxId FROM Thread')
const newId = (maxId ?? 0) + 1
```

You do **not** need to register a new file in `app.js` — all route files are already imported there.

---

### Step 2: Build your page

Your frontend view file is listed under "Frontend view" in the feature table. It currently shows a placeholder heading. Replace its contents with real data-fetching and display logic.

**First, update the API function** (listed under "Frontend API file"):

```javascript
// frontend/src/api/invitations.js
export async function getInvitations() {
  const res = await fetch('/api/invitations', { credentials: 'include' })
  return res.json()
}
```

`credentials: 'include'` is required on every request — it sends the session cookie. Leave it out and requests will always appear logged-out.

**Then update the view file:**

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getInvitations } from '@/api/invitations.js'
import AppLayout from '@/components/AppLayout.vue'

const items = ref([])
const error = ref(null)

onMounted(async () => {
  const result = await getInvitations()
  if (result.error) error.value = result.error
  else items.value = result.data
})
</script>

<template>
  <AppLayout>
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <div v-for="item in items" :key="item.id">{{ item }}</div>
  </AppLayout>
</template>
```

---

### Step 3: Wrap it in the shared layout

Every page must be wrapped in `<AppLayout>` — this gives it the sidebar, top bar, and search form that appear on every page. You can see this in the example above: your page content goes inside `<AppLayout> ... </AppLayout>`.

`AppLayout` handles everything automatically (sidebar, mobile menu, navigation links, logout). You don't pass anything into it.

**The sidebar links are:**

| Label | URL |
|---|---|
| Feed | `/` |
| My Books | `/my-books` |
| Invitations | `/invitations` |
| My Communities | `/communities` |
| Discover | `/discover` |
| Profile | `/profile` |

The Compose page (`/compose`) does not appear in the sidebar and is reached by direct link only.

**Test responsiveness** at 375px (phone), 768px (tablet), and 1280px (desktop). Use Tailwind prefixes `sm:`, `md:`, `lg:` to adjust layout at different screen sizes.

---

## Rules that apply to everyone

### Always use the same response shape

Every backend route must return data in exactly this format. The frontend checks `result.error` to decide if something went wrong — if you return data in a different shape, the frontend silently breaks.

```javascript
// Success
res.json({ data: <anything>, error: null })

// Failure
res.status(500).json({ data: null, error: 'something went wrong' })
```

### SQL safety

Always use `?` placeholders. Never put variables directly inside a SQL string.

```javascript
// ✅ CORRECT
await pool.execute('SELECT * FROM User WHERE UserID = ?', [req.session.userID])

// ❌ NEVER DO THIS
await pool.execute(`SELECT * FROM User WHERE UserID = ${req.session.userID}`)
```

---

## Database reference

Source of truth for column names and types: `backend/schema/init.sql`.

### Tables

| Table | Primary Key | Purpose |
|---|---|---|
| `User` | `UserID` | User accounts. `Email` is unique. |
| `Book` | `ISBN` (varchar 13) | Book catalogue. |
| `Club` | `ClubID` | Book clubs. `UserID` FK = creator. |
| `PrivateClub` | `ClubID` | Subtype of Club. Has `JoinPasscode`. |
| `PublicClub` | `ClubID` | Subtype of Club. No extra columns. |
| `Joins` | `(UserID, ClubID)` | Club membership. Has `JoinDate`. |
| `Moderates` | `(UserID, ClubID)` | Club moderators. Has `AssignedAt`. |
| `Thread` | `ThreadID` | Discussion threads. FK to Book, User, Club. |
| `Message` | `(ThreadID, MessageNum)` | Replies in a thread. FK to Thread, User. |
| `BookReview` | `ThreadID` | Club-facing review. FK to Thread and Book. Has `StarRating` (1–5). |
| `Rates` | `(ISBN, UserID)` | Personal reading list. Has `PersonalStatus`, `Rating` (1–5). |
| `Reads` | `(ISBN, ClubID)` | Books a club is reading. Has `ReadingStatus`, `DateFinished`. |
| `Invitation` | `InviteID` | Club invitations. Has `SenderUserID`, `ReceiverUserID`, `Status`, `ClubID`. |

### Two rating systems — never mix them

- `BookReview.StarRating` — a club-level review attached to a Thread. Used by F8 (Discover leaderboard).
- `Rates.Rating` — a personal rating per user per book. Used by F5 (My Books).

### Club subtype rule

Every `Club` row **must** have a matching row in either `PrivateClub` or `PublicClub`. Never insert into `Club` alone.

### Invitation FK columns

`Invitation` has **two separate FK columns**: `SenderUserID` and `ReceiverUserID` (both reference `User.UserID`). There is no single `UserID` column.

### Seed data

5 users (Alice–Evan), 5 books, 5 clubs (2 private, 3 public), plus seed threads, messages, reviews, invitations, and ratings. Passwords are `hash1`–`hash5` (plain text).

---

## Routes and APIs already built

### Backend routes

All features (F1–F9) are fully implemented.

| Method | Path | Auth required | Status |
|---|---|---|---|
| POST | `/api/auth/login` | No | ✅ Done |
| POST | `/api/auth/logout` | No | ✅ Done |
| GET | `/api/auth/me` | Yes | ✅ Done |
| GET | `/api/search/books` | No | ✅ Done |
| GET | `/api/search/threads` | No | ✅ Done |
| GET | `/api/compose/clubs` | Yes | ✅ Done |
| GET | `/api/compose/books` | No | ✅ Done |
| POST | `/api/compose/thread` | Yes | ✅ Done |
| POST | `/api/compose/review` | Yes | ✅ Done |
| GET | `/api/feed` | Yes | ✅ Done |
| GET | `/api/thread/:id` | Yes | ✅ Done |
| GET | `/api/thread/:id/messages` | Yes | ✅ Done |
| POST | `/api/thread/:id/reply` | Yes | ✅ Done |
| DELETE | `/api/thread/:id` | Yes | ✅ Done |
| GET | `/api/books/my` | Yes | ✅ Done |
| POST | `/api/books/my` | Yes | ✅ Done |
| PATCH | `/api/books/my/:isbn/status` | Yes | ✅ Done |
| PATCH | `/api/books/my/:isbn/rating` | Yes | ✅ Done |
| GET | `/api/invitations` | Yes | ✅ Done |
| PUT | `/api/invitations/:id` | Yes | ✅ Done |
| GET | `/api/communities/my` | Yes | ✅ Done |
| GET | `/api/communities/public` | Yes | ✅ Done |
| POST | `/api/communities/join` | Yes | ✅ Done |
| POST | `/api/communities` | Yes | ✅ Done |
| GET | `/api/discover/clubs` | No | ✅ Done |
| GET | `/api/discover/top-books` | No | ✅ Done |
| GET | `/api/profile` | Yes | ✅ Done |
| GET | `/api/profile/stats` | Yes | ✅ Done |
| GET | `/api/profile/books` | Yes | ✅ Done |
| GET | `/api/profile/reviews` | Yes | ✅ Done |
| GET | `/api/profile/clubs` | Yes | ✅ Done |
| GET | `/api/health` | No | Returns `{ status: 'ok', timestamp }` |

### Frontend API functions

All files are in `frontend/src/api/`.

| File | Functions available |
|---|---|
| `auth.js` | `login(email, password)`, `logout()`, `getMe()` |
| `search.js` | `search(query)` |
| `compose.js` | `createThread(data)`, `createReview(data)` |
| `feed.js` | `getFeed()` |
| `thread.js` | `getThread(id)`, `postReply(id, content)`, `deleteThread(id)` |
| `books.js` | `getMyBooks()` |
| `invitations.js` | `getInvitations()`, `updateInvitation(id, status)` |
| `communities.js` | `getMyCommunities()` |
| `discover.js` | `getClubs()`, `getTopBooks()` |
| `profile.js` | `getProfile()` |

---

## How login and sessions work

1. User submits email + password on the login page.
2. The frontend sends a `POST /api/auth/login` request.
3. The backend checks the `User` table for a matching email + password (plain-text — no hashing).
4. On match: the server stores the user's ID and username in a session, and sets a cookie in the browser that lasts 24 hours.
5. Every subsequent request includes that cookie, so the server knows who is logged in.

**To read the logged-in user's ID in a backend route:**

```javascript
const userID = req.session.userID
```

**To protect a route** so only logged-in users can access it, add `requireAuth`:

```javascript
import { requireAuth } from '../middleware/requireAuth.js'

router.get('/my', requireAuth, async (req, res) => {
  const userID = req.session.userID  // guaranteed to exist here
  // ...
})
```

If the session has expired or the user is not logged in, `requireAuth` automatically returns a `401` error and the frontend redirects to the login page.

---

## Other known issues

> DB blockers (CASCADE fix, Triggers 1–3) are covered in [⚠️ Read this before you start](#️-read-this-before-you-start) at the top.

### No password hashing

Passwords are stored and compared as plain text. The seed accounts use `hash1`–`hash5` as their literal passwords.

### `SidebarNav.vue` and `TopNav.vue` are unused stubs

Both files exist but are not imported anywhere. `AppLayout.vue` handles all navigation inline. Ignore these files.

### `BookCard.vue` and `ThreadCard.vue` are minimal stubs

`BookCard` renders only the book title. `ThreadCard` renders only the thread topic. Both need real markup before being used in feature views.

### All views are implemented

All views have real UI with data fetching. The only views still waiting on a backend are F1 (Search), F2 (Compose), F3 (Feed), F4 (Thread), and F8 (Discover) — they render but show empty data until their backend routes are implemented.