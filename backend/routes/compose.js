import express from 'express'

const router = express.Router()

router.post('/thread', (req, res) => {
  res.json({ data: [], error: null })
})

router.post('/review', (req, res) => {
  res.json({ data: [], error: null })
})

export default router
