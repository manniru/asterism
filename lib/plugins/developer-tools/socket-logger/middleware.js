'use strict'

import express from 'express'

const middleware = (context) => {
  const logger = context.logger
  let socket = null

  const plugLoggerToSocket = () => {
    if (socket) {
      return
    }
    socket = context.publicSockets['asterism/developer-tools/log']
    logger.addListener('log', (args) => {
      socket.broadcast.emit('log', args)
    })
  }

  // TODO !0: context.publicSockets['asterism/developer-tools/log'] -> listen for console output to send through this socket.
  const router = express.Router()
  router.get('/test/*', (req, res) => {
    plugLoggerToSocket()
    logger.log('test', 'pouic')
    return res.json('pouic')
  })
  return router
}

export default middleware
