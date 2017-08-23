'use strict'

import PropTypes from 'prop-types'
import React from 'react'

class SocketLoggerItem extends React.Component {
  render () {
    <div>RefreshButtonItem for {this.props.instanceId}</div>
  }
  // TODO !2: return an existing component
}

SocketLoggerItem.propTypes = {
  instanceId: PropTypes.string.isRequired,
  params: PropTypes.object
}

SocketLoggerItem.defaultProps = {
  params: {}
}

export default SocketLoggerItem
