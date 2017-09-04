'use strict'

import socketIo from 'socket.io'

// private 'asterism' namespace for system
let _asterismSocket = null
const _manageAsterismSocket = (socket) => {
  _asterismSocket = socket
  console.log('System socket connected.'.magenta)

  // TODO !2: rajouter des listen d'events
  _asterismSocket.on('paf', (message) => {
    console.log('PAF!', message)
    _asterismSocket.emit('pouf', 'je sais...')
  })
}

export default class SocketService {
  constructor () {
    this.privateSocketsToRegister = []
  }

  connect (server) {
    if (this.server) {
      throw new Error('Socket service already connected to server!')
    }
    this.server = server
    this.io = socketIo(this.server)

    // private 'asterism' namespace for system
    const asterismIo = this.io.of('/system/asterism')
    asterismIo.on('connect', _manageAsterismSocket)

    // create and connect private sockets
    this.privateSocketsToRegister.forEach((socketToRegister) => {
      console.log(`Private socket created: ${socketToRegister.namespace}`.grey)
      const privateIo = this.io.of(`/private/${socketToRegister.namespace}`)
      privateIo.on('connect', (socket) => {
        console.log(`Private socket connected: ${socketToRegister.namespace}`.magenta)
        socketToRegister.context.privateSocket = socket
      })
    })
    // TODO !1: idem, loop over public sockets to connect.
  }

  registerPrivateSocketToContext (namespace, context) {
    this.privateSocketsToRegister.push({ namespace, context })
  }
}
