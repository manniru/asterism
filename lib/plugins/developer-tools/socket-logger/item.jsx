'use strict'

import React from 'react'

import Item from '../../item'

class SocketLoggerItem extends Item {
  constructor (props) {
    super(props)
    const socket = props.context.publicSockets['asterism/developer-tools/log']

    this.state = {
      logs: []
    }

    // TODO !1: filter these, depending on min level to log!
    socket.on('log', (args) => {
      this.stackToLog({ level: 0, args })
    })
    socket.on('info', (args) => {
      this.stackToLog({ level: 1, args })
    })
    socket.on('warn', (args) => {
      this.stackToLog({ level: 2, args })
    })
    socket.on('error', (args) => {
      this.stackToLog({ level: 3, args })
    })
  }

  render () {
    const { logs } = this.state
    return (
      <div className='truncate fluid'>
        {logs.map((log) => {
          return <pre>{log.level} - {log.args}</pre>
        })}
      </div>
    )
    // TODO !0: render them!
  }

  stackToLog (log) {
    const newLogs = this.state.logs.concat([log]) // use concat, not .push, no change object ref
    while (newLogs.length > 30) { // TODO !0: param into setting panel
      newLogs.shift()
    }

    this.setState({ logs: newLogs })
  }
}

export default SocketLoggerItem
