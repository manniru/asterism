'use strict'

import PropTypes from 'prop-types'
import React from 'react'

class RefreshButtonItem extends React.Component {
  render () {
    return <div>RefreshButtonItem for {this.props.id}</div>
  }
  // TODO !3: return an existing component
}

RefreshButtonItem.propTypes = {
  id: PropTypes.string.isRequired,
  params: PropTypes.object
}

RefreshButtonItem.defaultProps = {
  params: {}
}

export default RefreshButtonItem
