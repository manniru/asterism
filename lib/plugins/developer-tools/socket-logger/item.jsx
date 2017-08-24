'use strict'

import PropTypes from 'prop-types'
import React from 'react'

class SocketLoggerItem extends React.Component {
  render () {
    return <div>RefreshButtonItem for {this.props.id}</div>
  }
  // TODO !3: return an existing component
}

SocketLoggerItem.propTypes = {
  id: PropTypes.string.isRequired,
  params: PropTypes.object
}

SocketLoggerItem.defaultProps = {
  params: {}
}

export default SocketLoggerItem
