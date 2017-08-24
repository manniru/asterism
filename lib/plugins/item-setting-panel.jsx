'use strict'

import PropTypes from 'prop-types'
import React from 'react'

class ItemSettingPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      params: { ...props.originalParams }
    }
  }

  close () {
    const { id, item, save, settingPanelCallback } = this.props
    const { params } = this.state
    if (item) {
      // it's an item update, return nothing but update item here
      save(params)
      .then(() => {
        // TODO !0: update params on item instance
        settingPanelCallback()
      })
    } else {
      // it's a new item creation, return the full structure
      save(params)
      .then(() => settingPanelCallback({ // TODO !2: completer: from a factory Builder func ?
        id,
        item,
        preferredHeight: 1,
        preferredWidth: 2,
        settingPanel: null
      }))
    }
  }
}

ItemSettingPanel.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object,
  originalParams: PropTypes.object,
  save: PropTypes.func.isRequired,
  settingPanelCallback: PropTypes.func.isRequired // should be called without args if props.item is not null, else
  // should return a full new structure : { id,item,preferredHeight,preferredWidth,settingPanel(optional) }
}

ItemSettingPanel.defaultProps = {
  item: null,
  originalParams: {}
}

export default ItemSettingPanel
