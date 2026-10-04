# 01 — Project Overview

BookClubDB is an online book club platform built by the team for CMPT 354 (Database Systems). Users log in, join or create clubs, start discussion threads and book reviews within clubs, keep a personal reading list, accept club invitations, and browse a leaderboard of top-rated books.

> **Conventions in these docs.** Every claim cites a file. Anything not directly visible in code is marked **[INFERRED]**. Things that couldn't be determined are stated as unknown. Counts are taken from the source tree as of this writing.

---

## 1. Repository layout

The repo has two independent npm packages, `backend/` and `frontend/`, and **no root `package.json`**.

```
BookClubDB/
├── CLAUDE.md / AGENTS.md     — team instructions for AI coding assistants (the two files are identical except for the title line)
├── DOCS.md                   — earlier developer guide (partly out of date, see §7)
├── Features.md               — earlier feature summary F1–F9 (partly out of date, see §7)
├── .gitignore                — ignores node_modules, dist, .env, .claude, editor files
├── backend/
│   ├── app.js                — Express entry point; mounts 11 routers under /api
│   ├── db.js                 — mysql2/promise connection pool + startup connectivity check
│   ├── middleware/
│   │   └── requireAuth.js    — session guard (401 if no req.session.userID)
│   ├── routes/               — 11 router files (auth, search, compose, feed, thread, books,
│   │                           invitations, communities, discover, profile, club)
│   ├── schema/
│   │   ├── init.sql          — DDL for 13 tables + 2 triggers (TablePlus export)
│   │   └── seed.sql          — sample data INSERTs
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── index.html            — Vite HTML entry, mounts #app
    ├── vite.config.js        — Vue + Tailwind plugins, '@' alias, /api proxy
    ├── README.md             — empty file (0 bytes)
    ├── package.json
    ├── package-lock.json
    └── src/
        ├── main.js           — createApp(App).use(router).mount('#app')
        ├── App.vue           — global top navigation bar + <RouterView />
        ├── style.css         — Tailwind import + global theme overrides
        ├── router/index.js   — 11 routes + auth navigation guard
        ├── api/              — 11 fetch-wrapper modules, one per backend router
        ├── views/            — 11 page components
        └── components/       — 5 components (see §4 — none are currently used)
```

Evidence: `git ls-files`; `frontend/README.md` is 0 bytes.

### Size by the numbers (counted from source)

| Item | Count | Where counted |
|---|---|---|
| Backend router files | 11 | `backend/routes/*.js`, all mounted in `backend/app.js` |
| Backend API endpoints | 41 (40 in routers + `GET /api/health`) | `router.get/post/put/patch/delete(...)` calls in `backend/routes/*.js`; health route in `backend/app.js` |
| Database tables | 13 | `CREATE TABLE` statements in `backend/schema/init.sql` |
| Database triggers | 2 | `CREATE TRIGGER` in `backend/schema/init.sql` (`check_moderator_is_member`, `auto_join_on_accept`) |
| Views / stored procedures / explicit indexes | 0 / 0 / determined in stage 2 | no `CREATE VIEW` / `CREATE PROCEDURE` in `init.sql` |
| Frontend routes | 11 | `frontend/src/router/index.js` |
| Frontend page views | 11 | `frontend/src/views/*.vue` |
| Frontend API modules | 11 | `frontend/src/api/*.js` |
| Frontend shared components | 5 (all unused) | `frontend/src/components/*.vue` |
| Automated tests | 0 | no test files, no test script in either `package.json` |

Endpoints per router (from `router.<method>(` calls):

| Router file | Mount path (`backend/app.js`) | Endpoints |
|---|---|---|
| `auth.js` | `/api/auth` | 3 |
| `search.js` | `/api/search` | 2 |
| `compose.js` | `/api/compose` | 4 |
| `feed.js` | `/api/feed` | 2 |
| `thread.js` | `/api/thread` | 4 |
| `books.js` | `/api/books` | 4 |
| `invitations.js` | `/api/invitations` | 4 |
| `communities.js` | `/api/communities` | 6 |
| `discover.js` | `/api/discover` | 2 |
| `profile.js` | `/api/profile` | 5 |
| `club.js` | `/api/club` | 4 |
| *(inline)* | `/api/health` | 1 |

Full endpoint details are in `03-backend.md` (stage 3).

---

## 2. Tech stack

### Backend — `backend/package.json`

| Package | Version range | Role | Evidence |
|---|---|---|---|
| `express` | ^4.18.2 | HTTP server and routing | `backend/app.js` |
| `express-session` | ^1.17.3 | Cookie-based server sessions | `backend/app.js` `app.use(session({...}))` |
| `mysql2` | ^3.6.0 | MySQL driver, promise API | `backend/db.js` `import mysql from 'mysql2/promise'` |
| `dotenv` | ^16.6.1 | Loads `.env` | `backend/app.js`, `backend/db.js` |
| `nodemon` (dev) | ^3.0.1 | Auto-restart in development | `"dev": "nodemon app.js"` script |

- Module system: ES modules (`"type": "module"` in `backend/package.json`).
- Language: plain JavaScript, no TypeScript.
- Session store: none configured, so `express-session` uses its default in-memory `MemoryStore` [INFERRED from the absence of a `store:` option in `backend/app.js`; this is express-session's documented default]. Sessions are lost on server restart.
- No password-hashing library, validation library, CORS middleware, logging library, or ORM appears in the dependencies.

### Frontend — `frontend/package.json`

| Package | Version range | Role |
|---|---|---|
| `vue` | 3.5.32 (resolved in lockfile) | UI framework. **Not listed directly** in `package.json`; installed as the peer dependency of `vue-router` (`frontend/package-lock.json`, `node_modules/vue-router` → `peerDependencies: { vue: ^3.5.0 }`) |
| `vue-router` | ^4.6.4 | Client-side routing, HTML5 history mode (`createWebHistory()` in `src/router/index.js`) |
| `@vitejs/plugin-vue` | ^6.0.4 | Vue SFC compilation (listed under `dependencies`, though it is a build tool) |
| `vite` (dev) | ^7.3.1 | Dev server and bundler |
| `tailwindcss` (dev) | ^4.2.2 | Utility CSS |
| `@tailwindcss/vite` (dev) | ^4.2.2 | Tailwind 4 Vite integration (`vite.config.js`) |

- Vue components use `<script setup>` (the Composition API), e.g. `src/App.vue`.
- No state-management library (no Pinia/Vuex). `App.vue` shares one function with child views via `provide('refreshInviteCount', ...)`. More on this in stage 4.
- No HTTP client library. Requests use the native `fetch` in `src/api/*.js`.
- Fonts: Google Fonts Merriweather + Inter, imported in `src/style.css`.
- `index.html` `<title>` is still the scaffold default `bookclub-frontend`.

### Database

- MySQL. The `init.sql` header says it was exported with **TablePlus 6.8.6** from a database named **`railway`** on 2026-03-30 (`backend/schema/init.sql` lines 1–8). The hosting provider being Railway is [INFERRED] from that name and from `CLAUDE.md`/`DOCS.md` ("Railway credentials"). The MySQL server version isn't recorded in the repo. `CLAUDE.md` says "MySQL 8.x", and nothing in the code confirms the exact version.
- Schema: `backend/schema/init.sql` (DDL plus triggers, no data).
- Sample data: `backend/schema/seed.sql`.

---

## 3. Architecture at a glance

```
Browser (Vue 3 SPA, Vite dev server :5173)
   │  fetch('/api/...', { credentials: 'include' })     ← src/api/*.js
   │  Vite proxy: '/api' → http://localhost:3000        ← frontend/vite.config.js
   ▼
Express (:3000 or $PORT)                                 ← backend/app.js
   ├─ express.json / urlencoded body parsers
   ├─ express-session (cookie: httpOnly, maxAge 24h)
   ├─ /api/<feature> routers                             ← backend/routes/*.js
   │     └─ requireAuth guard on protected routes        ← backend/middleware/requireAuth.js
   ├─ GET /api/health
   └─ /api/* catch-all → 404 { data:null, error:'Not found' }
   ▼
mysql2 connection pool                                    ← backend/db.js
   ▼
MySQL database (13 tables, 2 triggers)                    ← backend/schema/init.sql
```

Notes:
- **Uniform response envelope.** Responses use `{ data, error }`. Examples: the 404 catch-all and `requireAuth.js`. `GET /api/health` is the exception and returns `{ status, timestamp }` (`backend/app.js`). Per-route conformance is checked in stage 3.
- **Fail-fast DB check.** On import, `db.js` runs `SELECT 1` and calls `process.exit(1)` if it fails (`testConnection()` in `backend/db.js`).
- **No CORS config.** The frontend reaches the API through the Vite proxy, so requests are same-origin in development [INFERRED from `vite.config.js` proxy plus the absence of the `cors` package].
- **No production serving path in code.** `backend/app.js` doesn't serve the built frontend (no `express.static`), and no deployment config exists (no Dockerfile, Procfile, `railway.json`, or similar in `git ls-files`). `CLAUDE.md` says that in production the frontend is "served from the same origin", but nothing in the repo implements this. How or whether the app was deployed can't be determined from the code.
- **Auth on the client.** `src/router/index.js` `router.beforeEach` calls `GET /api/auth/me` before every route with `meta.requiresAuth`. On a non-OK response or a network error, it redirects to `login`. Ten of the eleven routes require auth. `/login` does not.

---

## 4. Frontend structure summary (details in stage 4)

Routes in `frontend/src/router/index.js`:

| Path | Name | View | Auth |
|---|---|---|---|
| `/login` | login | `LoginView.vue` | no |
| `/` | feed | `FeedView.vue` | yes |
| `/search` | search | `SearchView.vue` | yes |
| `/thread/:id` | thread | `ThreadView.vue` | yes |
| `/my-books` | my-books | `MyBooksView.vue` | yes |
| `/compose` | compose | `ComposeView.vue` | yes |
| `/communities` | communities | `CommunitiesView.vue` | yes |
| `/profile` | profile | `ProfileView.vue` | yes |
| `/invitations` | invitations | `InvitationsView.vue` | yes |
| `/discover` | discover | `DiscoverView.vue` | yes |
| `/club/:id` | club | `ClubView.vue` | yes |

Layout: `App.vue` renders a sticky top navigation bar on every page except login (`v-if="route.name !== 'login'"`). The bar holds the logo, a search box that pushes to `/search?q=...`, links to Discover, Communities, and My Books, an invitations bell with a pending-count dot, and a profile dropdown with Profile and Log out. Below it sits `<RouterView />`.

**Unused components.** A search for each component name across `frontend/src` finds no imports of these files:
- `components/AppLayout.vue`: a full sidebar layout with its own logout and invite-count logic. No view imports it, so `App.vue` now does this job.
- `components/SidebarNav.vue` and `components/TopNav.vue`: 3-line placeholders.
- `components/BookCard.vue` and `components/ThreadCard.vue`: render only `book.Title` / `thread.Topic`.

---

## 5. How to run it

### Prerequisites
- Node.js. No version is pinned (no `engines` field and no `.nvmrc`). Requirements implied by the code:
  - `frontend/vite.config.js` uses `import.meta.dirname`, which needs Node ≥ 20.11 [INFERRED from Node's API history].
  - Vite 7 itself requires Node 20.19+ / 22.12+ [INFERRED from Vite 7's published requirements, not from this repo].
- A reachable MySQL database.

### 1. Database
The repo has no migration runner or npm script for the database. The SQL files were run by hand. `seed.sql` contains the comment "Run this in TablePlus against the Railway database" (`backend/schema/seed.sql` line 92). One way to load them:

```bash
mysql -h <host> -P <port> -u <user> -p <dbname> < backend/schema/init.sql
```

```bash
mysql -h <host> -P <port> -u <user> -p <dbname> < backend/schema/seed.sql
```

Caveats visible in the files:
- `init.sql` starts with `DROP TABLE IF EXISTS` for each table, so re-running it wipes the data.
- The two triggers at the bottom of `init.sql` are preceded by a commented-out migration that adds `ON DELETE CASCADE` to `Message_ibfk_1` on an existing DB. Whether the live DB had these applied is unknown. Stage 2 covers the trigger and `DELIMITER` details.

### 2. Backend

```bash
cd backend && npm install
```

```bash
cp .env.example .env
```

Variables read by the code (`process.env.*` in `backend/app.js` and `backend/db.js`):

| Variable | Used in | In `.env.example`? |
|---|---|---|
| `DB_HOST` | `db.js` | yes |
| `DB_PORT` | `db.js` | **no**. If unset, mysql2 falls back to its default port 3306 [INFERRED from driver default] |
| `DB_USER` | `db.js` | yes |
| `DB_PASSWORD` | `db.js` | yes |
| `DB_NAME` | `db.js` | yes (`BookClubDB`) |
| `SESSION_SECRET` | `app.js` | yes (`changeme`) |
| `PORT` | `app.js` (default 3000) | yes |

Then start the server:

```bash
npm start
```

`npm start` runs `node app.js`. `npm run dev` runs it under nodemon. On success the console prints `Database connected` and `Server running on port 3000`.

### 3. Frontend

```bash
cd frontend && npm install && npm run dev
```

The app opens at Vite's default `http://localhost:5173` [INFERRED: Vite's default port; `vite.config.js` doesn't set one]. All `/api` calls proxy to `http://localhost:3000`, which is hard-coded in `vite.config.js`. If the backend runs on a different `PORT`, the proxy target has to change to match.

### 4. Log in
`seed.sql` inserts 5 users. Passwords are stored as plain strings in the `User.Password` column. `DOCS.md` lists `alice@sfu.ca` / `hash1` as an example login. Stages 2 and 3 confirm how `auth.js` compares passwords.

### Seed data volume (rows counted in `backend/schema/seed.sql`)

| Table | Rows |
|---|---|
| User | 5 |
| Book | 104 (5 core + 99 in a second block; the comment there says "100 additional books" but 99 rows follow) |
| Club | 5 (PrivateClub 2, PublicClub 3) |
| Joins | 5 |
| Moderates | 5 |
| Thread | 5 |
| Message | 5 |
| BookReview | 5 |
| Invitation | 5 |
| Rates | 5 |
| Reads | 5 |

---

## 6. Build and tooling

| Concern | Status | Evidence |
|---|---|---|
| Frontend production build | `npm run build` → `vite build` (output `dist/`, git-ignored) | `frontend/package.json`, `.gitignore` |
| Backend build | none, runs directly with Node | `backend/package.json` |
| Tests | none | no test files or scripts |
| Linting / formatting | none configured | no ESLint/Prettier config or deps |
| CI | none | no `.github/` or other CI config in `git ls-files` |
| Containerization / deploy config | none | see §3 |
| Lockfiles | npm lockfile v3 in both packages | `backend/package-lock.json`, `frontend/package-lock.json` |

---

## 7. Discrepancies between the existing docs and the code

The repo's own `CLAUDE.md`, `DOCS.md`, and `Features.md` were written during development and no longer match the code in several places. These docs follow the code.

| Existing doc says | Code shows |
|---|---|
| `CLAUDE.md`: frontend lives at repo root `src/`, run with `npm run dev` from root | Frontend is in `frontend/` (`frontend/package.json`); there's no root `package.json` |
| `CLAUDE.md`: theme in `src/assets/main.css` | Theme is in `frontend/src/style.css`; there's no `assets/` directory |
| `CLAUDE.md`/`DOCS.md`: every page is wrapped in `AppLayout` | No file imports `AppLayout.vue`. `App.vue` renders the nav. |
| `CLAUDE.md`: session cookie has `sameSite: 'lax'` | `backend/app.js` sets `{ httpOnly: true, maxAge: 1000*60*60*24 }`, with no `sameSite` |
| `CLAUDE.md` `.env` keys omit `DB_PORT` | `db.js` reads `DB_PORT`. `DOCS.md` lists it, but `.env.example` doesn't |
| `CLAUDE.md`/`DOCS.md` endpoint lists: 31 endpoints, no `club.js` | 41 endpoints, including `club.js` (4), `feed.js` `GET /public`, `invitations.js` `GET /count` and `POST /`, and `communities.js` `DELETE /:id` and `DELETE /:id/leave` |
| `DOCS.md`: `/compose` not in navigation | Accurate for `App.vue`'s nav bar (no `/compose` link); stage 4 checks whether views link to it |
| `Features.md` F1: single `GET /api/search?q=` route | `search.js` defines `GET /books` and `GET /threads` |
| `CLAUDE.md`: "In production they are served from the same origin" | No code serves the frontend from Express |

---

*Next stage: `02-database.md`, covering the schema, constraints, triggers, and notable queries.*
