import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ data: [], error: null })
})

router.put('/:id', (req, res) => {
  res.json({ data: [], error: null })
})

export default router
