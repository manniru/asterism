'use strict'

import PropTypes from 'prop-types'
import React from 'react'

class RefreshButtonItem extends React.Component {
  render () {
    <div>RefreshButtonItem for {this.props.instanceId}</div>
  }
  // TODO !2: return an existing component
}

RefreshButtonItem.propTypes = {
  instanceId: PropTypes.string.isRequired,
  params: PropTypes.object
}

RefreshButtonItem.defaultProps = {
  params: {}
}

export default RefreshButtonItem
