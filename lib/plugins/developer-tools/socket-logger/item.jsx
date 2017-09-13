'use strict'

import React from 'react'

import Item from '../../item'

class SocketLoggerItem extends Item {
  constructor (props) {
    super(props)
    console.log('merde', props.context.publicSockets)
    const socket = props.context.publicSockets.find((socket) => socket.nsp === '/public/asterism/developer-tools/log') // TODO !0: map this before !
    socket.on('log', (args) => {
      console.log(args)
    })
  }

  render () {
    return (
      <div className='truncate fluid'>
        SocketLoggerItem for {this.props.id}
      </div>
    )
    // TODO !3: render logs: log messages from sockets (and others ? from server ? can catch browser console messages ?)
  }
}

export default SocketLoggerItem
