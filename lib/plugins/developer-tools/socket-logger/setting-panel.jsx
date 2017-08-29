'use strict'

import React from 'react'

import ItemSettingPanel from '../../item-setting-panel'
import SocketLoggerItem from './item'

class SocketLoggerSettingPanel extends ItemSettingPanel {
  render () {
    return (
      <div>
        SocketLoggerSettingPanel for {this.props.id}

        <button onClick={() => this.next(SocketLoggerItem)}>Save and close</button>
      </div>
    )
  }
  // TODO !2: render it for setup of the item.
  // here you have this.close() to save state.props on server, refresh/generate item, and close modal.
}

export default SocketLoggerSettingPanel
