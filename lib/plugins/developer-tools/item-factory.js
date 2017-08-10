'use strict'

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
    // TODO: return a component OR a settings panel
  }

  instantiateItem (additionalItemId, instanceId) {
    // TODO: return a component
  }
}

export default DeveloperToolsItemFactory
