'use strict'

import io from 'socket.io-client'

// private 'asterism' namespace for system
let _systemSocket = null
const _systemHandler = (socket) => {
  // TODO !2: events to add
  socket.on('pouf', (message) => {
    console.log('POUF!', message)
  })
  socket.emit('paf', 'c est moi le meilleur!')
}

export default class SocketManager {
  constructor () {
    this.sockets = { } // TODO !1: public ones are added here by a new connectPublicSocket !
    _systemSocket = io('/system/asterism')
    _systemSocket.on('connect', _systemHandler.bind(this, this.sockets['/system/asterism']))
  }

  connectPrivateSocket (namespace) {
    const socketNamespace = `/private/${namespace}`
    const socket = io(socketNamespace)
    socket.on('connect', this.socketConnected.bind(this, socketNamespace))
    return socket
  }

  socketConnected (socketNamespace) {
    console.log(`Socket ${socketNamespace} connected.`)
  }
}
