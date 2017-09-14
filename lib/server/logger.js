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
    console.log.apply(this, args.map((arg) => arg.blue))
  }

  info (...args) {
    this.emit('info', args)
    console.info.apply(this, args.map((arg) => arg.green))
  }

  warn (...args) {
    this.emit('warn', args)
    console.warn.apply(this, args.map((arg) => arg.yellow))
  }

  error (...args) {
    this.emit('error', args)
    console.error.apply(this, args.map((arg) => arg.red))
  }
}
