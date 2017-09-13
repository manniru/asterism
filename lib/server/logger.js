'use strict'

import EventEmitter from 'events'

export default class Logger extends EventEmitter {
  constructor (socketService, name = '') {
    super()
    this.socketService = socketService
    this.name = name
  }

  createSubLogger (name) {
    return new Logger(this.socketService, `${this.name} > ${name}`)
  }

  log (...args) {
    this.emit('log', args)
    console.log.apply(this, args.map((arg) => arg.yellow))
  }
}
