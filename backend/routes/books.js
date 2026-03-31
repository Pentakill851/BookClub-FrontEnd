import express from 'express'

const router = express.Router()

router.get('/my', (req, res) => {
  res.json({ data: [], error: null })
})

export default router
