import express from 'express'

const router = express.Router()

router.get('/clubs', (req, res) => {
  res.json({ data: [], error: null })
})

router.get('/top-books', (req, res) => {
  res.json({ data: [], error: null })
})

export default router
