# BookClubDB — CLAUDE.md

CMPT 354 Course Project · An
Online book club management platform — MySQL + Express + Vue 3

---

## Dev Workflow

### Starting the app (two terminals)

```bash
# Terminal 1 — backend (Express on port 3000)
cd backend
node app.js

# Terminal 2 — frontend (Vite dev server on port 5173)
npm run dev
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:3000`. This is configured in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

All `fetch('/api/...')` calls in the frontend hit Express in dev. In production they are served from the same origin — no proxy needed.

### Environment setup

Copy `.env.example` to `.env` and fill in Railway credentials:

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=BookClubDB
SESSION_SECRET=
PORT=3000
```

Never commit `.env`. The `.env.example` file committed to the repo must match these keys exactly.

---

## Project State

Track which features are implemented. Update this whenever a feature ships.

| ID  | Feature                          | Backend | Frontend | Notes                                    |
|-----|----------------------------------|---------|----------|------------------------------------------|
| —   | Auth (Login/out)                 | ✅      | ✅       |                                          |
| F1  | Search Books / Archives          | ❌      | ❌       |                                          |
| F2  | Create Discussion Post or Review | ❌      | ❌       |                                          |
| F3  | Feed                             | ❌      | ❌       |                                          |
| F4  | Thread Detail                    | ❌      | ❌       | Blocked until CASCADE fix in init.sql    |
| F5  | My Books                         | ❌      | ❌       | Uses `Rates.Rating`, not `BookReview`    |
| F6  | Invitations                      | ❌      | ❌       | Requires Triggers 2 & 3                  |
| F7  | Communities                      | ❌      | ❌       |                                          |
| F8  | Discover                         | ❌      | ❌       | Division query + GROUP BY aggregation    |
| F9  | Profile                          | ❌      | ❌       |                                          |
| —   | Trigger 1                        | ❌      | —        | Moderator must be a member               |
| —   | Trigger 2                        | ❌      | —        | Auto-join on invitation accept           |
| —   | Trigger 3                        | ❌      | —        | TBD — document here when decided         |

---

## Tech Stack

### Frontend
- Vue 3 — Composition API with `<script setup>`
- Vite — dev server and bundler
- Tailwind CSS 4 — via `@tailwindcss/vite` plugin
- Vue Router — client-side routing
- No TypeScript

### Backend
- Node.js with Express
- mysql2 (promise API) — DB driver
- express-session — auth/session management
- ES modules (`"type": "module"`)

### Database
- MySQL 8.x (hosted on Railway)
- Full DDL: `backend/schema/init.sql` ← source of truth for schema
- Seed data: `backend/schema/seed.sql`

---

## Project File Structure

```
backend/
  app.js                  — Express app, mounts all routers
  db.js                   — mysql2 connection pool
  middleware/
    requireAuth.js        — session auth guard
  routes/
    auth.js               — POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
    search.js             — GET /api/search
    compose.js            — POST /api/compose/thread, POST /api/compose/review
    feed.js               — GET /api/feed
    thread.js             — GET /api/thread/:id, POST /api/thread/:id/reply, DELETE /api/thread/:id
    books.js              — GET /api/books/my
    invitations.js        — GET /api/invitations, PUT /api/invitations/:id
    communities.js        — GET /api/communities/my
    discover.js           — GET /api/discover/clubs, GET /api/discover/top-books
    profile.js            — GET /api/profile
  schema/
    init.sql              — full schema migration (source of truth)
    seed.sql              — bulk book seed data (20+ books)

src/
  router/index.js         — Vue Router, navigation guard for auth
  api/
    auth.js
    search.js
    compose.js
    feed.js
    thread.js
    books.js
    invitations.js
    communities.js
    discover.js
    profile.js
  views/
    LoginView.vue
    FeedView.vue          — / (home)
    SearchView.vue        — /search
    ComposeView.vue       — /compose
    ThreadView.vue        — /thread/:id
    MyBooksView.vue       — /my-books
    InvitationsView.vue   — /invitations
    CommunitiesView.vue   — /communities
    DiscoverView.vue      — /discover
    ProfileView.vue       — /profile
  components/
    AppLayout.vue         — sidebar + topnav shell
    SidebarNav.vue        — navigation links
    TopNav.vue            — search bar + user avatar
    BookCard.vue          — reusable book display card
    ThreadCard.vue        — reusable thread preview card
  assets/
    main.css              — Tailwind imports + CSS variables for theme
```

---

## Database — Critical Notes

**Read `backend/schema/init.sql` for the full schema.** Do not rely on any summary here for column names or types — check the file directly.

### Known issues / gotchas

**1. Message ON DELETE CASCADE is missing.**
The current `init.sql` declares `Message_ibfk_1` without `ON DELETE CASCADE`. Deleting a Thread with existing Messages will throw a FK constraint error. Fix before building F4:

```sql
CONSTRAINT `Message_ibfk_1` FOREIGN KEY (`ThreadID`) REFERENCES `Thread` (`ThreadID`) ON DELETE CASCADE
```

**2. Two separate rating systems — never mix them.**
- `BookReview.StarRating` — club-facing review rating, attached to a Thread. Used by F8 Discover leaderboard.
- `Rates.Rating` — personal reading list rating per user. Used by F5 My Books.

**3. Club subtypes — always insert both rows.**
Every `Club` row must have a corresponding row in either `PrivateClub` or `PublicClub`. Never insert into `Club` alone.

**4. Invitation schema uses two FK columns.**
`Invitation` has `SenderUserID` + `ReceiverUserID` as separate FK columns to `User`. Any older schema version with a single `UserID` column is outdated — ignore it.

**5. No AUTO_INCREMENT — generate IDs in JS.**

```javascript
const [[{ maxId }]] = await pool.execute('SELECT MAX(ThreadID) as maxId FROM Thread')
const newId = (maxId ?? 0) + 1
```

---

## Backend Conventions

### db.js pattern

```javascript
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

export default pool
```

Always use `pool.execute(sql, [params])`. Never string-interpolate user input into SQL.

### Router pattern

```javascript
import express from 'express'
import pool from '../db.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT ...', [params])
    res.json({ data: rows, error: null })
  } catch (err) {
    res.status(500).json({ data: null, error: err.message })
  }
})

export default router
```

### Response shape (always)

```javascript
// Success
res.json({ data: <anything>, error: null })

// Failure
res.status(<code>).json({ data: null, error: "human-readable message" })
```

### Auth

- Session stored via `express-session`
- After login: `req.session.userID` and `req.session.username` are set
- Session config in `app.js`:
  ```javascript
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' }
  }))
  ```
- Auth guard in `middleware/requireAuth.js`:
  ```javascript
  export function requireAuth(req, res, next) {
    if (!req.session.userID) return res.status(401).json({ data: null, error: 'Not logged in' })
    next()
  }
  ```
- Apply to protected routes: `router.get('/', requireAuth, async (req, res) => { ... })`

---

## Frontend Conventions

### API layer pattern

All `fetch()` calls live in `src/api/<feature>.js`. Components never call `fetch()` directly.

```javascript
// src/api/feed.js
export async function getFeed() {
  const res = await fetch('/api/feed', { credentials: 'include' })
  return res.json() // always returns { data, error }
}
```

`credentials: 'include'` is required on every request for session cookies to be sent.

### Component pattern

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getFeed } from '@/api/feed.js'
import AppLayout from '@/components/AppLayout.vue'

const threads = ref([])
const error = ref(null)

onMounted(async () => {
  const result = await getFeed()
  if (result.error) error.value = result.error
  else threads.value = result.data
})
</script>

<template>
  <AppLayout>
    <!-- content here -->
  </AppLayout>
</template>
```

### Routing

All routes defined in `src/router/index.js`. Routes requiring login use `meta: { requiresAuth: true }`. The navigation guard calls `GET /api/auth/me` and redirects to `/login` on 401.

### Responsiveness requirement

Every view must be verified at **375px / 768px / 1280px**. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`). AppLayout sidebar collapses to a bottom nav or hamburger on mobile.

### Stub pattern (before feature is built)

```vue
<template>
  <AppLayout>
    <h1 class="text-2xl font-bold">Feature Name</h1>
    <p class="text-gray-500">Coming soon.</p>
  </AppLayout>
</template>
```

Backend stub: route exists, returns `{ data: [], error: null }` with HTTP 200. No DB call yet.

The app must be fully runnable with all stubs in place before any feature logic is written.

---

## Triggers

### Trigger 1 — Moderator must be a member
`BEFORE INSERT ON Moderates` — verify the user has a row in `Joins` for the same club. If not, raise a signal.

### Trigger 2 — Auto-join on invitation accept
`AFTER UPDATE ON Invitation` — when `Status` changes to `'Accepted'`, insert a row into `Joins` for `(ReceiverUserID, ClubID)` if one does not already exist.

### Trigger 3 — TBD
Document here once decided. Update the project state table above.