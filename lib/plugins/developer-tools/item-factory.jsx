'use strict'

import React from 'react'

import AdditionalItem from '../additional-item'

class DeveloperToolsItemFactory {
  constructor ({ localStorage, serverStorage, mainState }) {
    this.additionalItems = [
      new AdditionalItem(this, 'refresh_button', 'Refresh button', 'development', 'Just a refresh button for the whole page.'),
      new AdditionalItem(this, 'socket_logger', 'Socket logger', 'development', 'Listen for messages going through main socket.')
    ]
  }

  getAdditionalItems (category) {
    // here we can filter more depending on the context (if settings required before to show these items)
    return this.additionalItems.filter((ai) => ai.category === category)
  }

  instantiateNewItem (additionalItemId) {
    // TODO !1: return an object with { item, h, w, settingPanel } OR an initial ItemSettingPanel instance instead
    return {
      item: <div>New: {additionalItemId}</div>,
      preferredHeight: 1,
      preferredWidth: 1,
      settingPanel: null
    }
  }

  instantiateItem (instanceId) {
    // TODO !1: return an existing component and its settingPanel
    return {
      item: <div>{instanceId}</div>,
      settingPanel: null
    }
  }
}

export default DeveloperToolsItemFactory
