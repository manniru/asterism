'use strict'

import React from 'react'
import uuid from 'uuid'

import AdditionalItem from '../additional-item'

import RefreshButtonItem from './refresh-button/item'
import RefreshButtonSettingPanel from './refresh-button/setting-panel'
import SocketLoggerItem from './socket-logger/item'
import SocketLoggerSettingPanel from './socket-logger/setting-panel'

// TODO !7: make a itemFactoryBuilder, and extends/use it here
class DeveloperToolsItemFactory {
  constructor ({ localStorage, serverStorage, mainState }) {
    this.context = { localStorage, serverStorage, mainState }
    this.items = {
      'refresh_button': {
        additionalItem: new AdditionalItem(
          this, 'refresh_button',
          'Refresh button',
          AdditionalItem.categories.DEVELOPMENT,
          'Just a refresh button for the whole page.'
        ),
        newInstance: (instanceId) => ({
          item: <RefreshButtonItem instanceId={instanceId} />,
          preferredHeight: 1,
          preferredWidth: 1,
          settingPanel: <RefreshButtonSettingPanel instanceId={instanceId} />
        }), // newInstance this way OR an initial ItemSettingPanel instance instead
        restoreInstance: (instanceId, params) => ({
          item: <RefreshButtonItem instanceId={instanceId} params={params} />,
          settingPanel: <RefreshButtonSettingPanel instanceId={instanceId} params={params} />
        }),
        dimensions: [
          { w: 1, h: 1 },
          { w: 2, h: 1 },
          { w: 1, h: 2 },
          { w: 2, h: 2 }
        ]
      },
      'socket_logger': {
        additionalItem: new AdditionalItem(
          this, 'socket_logger',
          'Socket logger',
          AdditionalItem.categories.DEVELOPMENT,
          'Listen for messages going through main socket.'
        ),
        newInstance: (instanceId) => <SocketLoggerSettingPanel instanceId={instanceId} />, // newInstance this way OR like refresh_button example
        restoreInstance: (instanceId, params) => ({
          item: <SocketLoggerItem instanceId={instanceId} params={params} />,
          settingPanel: <SocketLoggerSettingPanel instanceId={instanceId} params={params} />
        }),
        dimensions: [
          { w: 2, h: 2 },
          { w: 3, h: 2 },
          { w: 2, h: 3 },
          { w: 3, h: 3 }
        ]
      }
    }
  }

  getAdditionalItems (category) {
    // here we can filter more depending on the context (if settings required before to show these items)
    return Object.values(this.items).map((i) => i.additionalItem).filter((ai) => ai.category === category)
  }

  instantiateNewItem (additionalItemId, instanceId = uuid.v4()) {
    return this.saveItem(instanceId, {}, additionalItemId)
    .then(() => this.items[additionalItemId].newInstance(instanceId))
  }

  instantiateItem (instanceId) {
    // must return { item, settingPanel }
    // OR a promise resolving the same structure,
    // OR throw an error with error.status = 404 if not found (other errors won't be caught).

    return this.context.serverStorage.getItem(instanceId)
    .then(({ additionalItemId, params }) => this.items[additionalItemId].restoreInstance(instanceId, params))
  }

  saveItem (instanceId, params, additionalItemId) {
    // must return a Promise that resolves once save is persisted and can be retrieved by a read operation.
    if (!additionalItemId) {
      return this.context.serverStorage.getItem(instanceId)
      .then((data) => this.context.serverStorage.setItem(instanceId, { additionalItemId: data.additionalItemId, params }))
    }
    return this.context.serverStorage.setItem(instanceId, { additionalItemId, params })
  }

  removeItem (instanceId) {
    // This is an async event. Do not return a Promise when finished.
    console.log(`Ok, item #${instanceId} is removed.`)
    // TODO !8: when needed, purge data server side for this instance? only if not used by another board !!! how to do ?
  }
}

export default DeveloperToolsItemFactory
