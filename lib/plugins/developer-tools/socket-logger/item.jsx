'use strict'

import React from 'react'

import Item from '../../item'

class SocketLoggerItem extends Item {
  render () {
    return <div>SocketLoggerItem for {this.props.id}</div>
    // TODO !2
  }
}

export default SocketLoggerItem
