'use strict'

import PropTypes from 'prop-types'
import React from 'react'

class ItemSettingPanel extends React.Component {
  constructor (instanceId, params = {}) {
    super({ instanceId, params })
  }
}

ItemSettingPanel.propTypes = {
  instanceId: PropTypes.string.isRequired,
  params: PropTypes.object
}

ItemSettingPanel.defaultProps = {
  params: {}
}

export default ItemSettingPanel
