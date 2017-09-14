'use strict'

import express from 'express'

let _socketIo = null

const _plugLoggerToSocketIo = (context, logger) => {
  if (!_socketIo) {
    _socketIo = context.publicSocketsIo['asterism/developer-tools/log']
    logger.addListener('log', (args) => {
      _socketIo.emit('log', args)
    })
    logger.addListener('info', (args) => {
      _socketIo.emit('info', args)
    })
    logger.addListener('warn', (args) => {
      _socketIo.emit('warn', args)
    })
    logger.addListener('error', (args) => {
      _socketIo.emit('error', args)
    })
  }
}

const middleware = (context) => {
  const logger = context.logger
  const router = express.Router()

  // TODO !1: to remove...
  router.get('/test/*', (req, res) => {
    _plugLoggerToSocketIo(context, logger)
    logger.log('test', req.path)
    logger.info('test', req.path)
    logger.warn('test', req.path)
    logger.error('test', req.path)

    return res.json('ok')
  })
  return router
}

export default middleware
