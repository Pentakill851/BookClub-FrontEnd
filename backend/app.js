import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import session from 'express-session'
import pool from './db.js'

import authRouter from './routes/auth.js'
import searchRouter from './routes/search.js'
import composeRouter from './routes/compose.js'
import feedRouter from './routes/feed.js'
import threadRouter from './routes/thread.js'
import booksRouter from './routes/books.js'
import invitationsRouter from './routes/invitations.js'
import communitiesRouter from './routes/communities.js'
import discoverRouter from './routes/discover.js'
import profileRouter from './routes/profile.js'
import clubRouter from './routes/club.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}))

app.use('/api/auth', authRouter)
app.use('/api/search', searchRouter)
app.use('/api/compose', composeRouter)
app.use('/api/feed', feedRouter)
app.use('/api/thread', threadRouter)
app.use('/api/books', booksRouter)
app.use('/api/invitations', invitationsRouter)
app.use('/api/communities', communitiesRouter)
app.use('/api/discover', discoverRouter)
app.use('/api/profile', profileRouter)
app.use('/api/club', clubRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

app.use('/api/*', (req, res) => {
  res.status(404).json({ data: null, error: 'Not found' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
