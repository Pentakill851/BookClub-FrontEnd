import express from 'express'

const router = express.Router()

router.get('/:id', (req, res) => {
  res.json({ data: [], error: null })
})

router.post('/:id/reply', (req, res) => {
  res.json({ data: [], error: null })
})

router.delete('/:id', (req, res) => {
  res.json({ data: [], error: null })
})

export default router
