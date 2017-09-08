'use strict'

import express from 'express'

const middleware = (context) => {
  // TODO !2
  const router = express.Router()
  router.get('/test/*', (req, res) => {
    return res.json('pouic')
  })
  return router
}

export default middleware
