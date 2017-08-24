'use strict'

import React from 'react'

import AdditionalItem from '../additional-item'

import RefreshButtonItem from './refresh-button/item'
import RefreshButtonSettingPanel from './refresh-button/setting-panel'
import SocketLoggerItem from './socket-logger/item'
import SocketLoggerSettingPanel from './socket-logger/setting-panel'

// TODO !1: make a itemFactoryBuilder, and use it here
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
        newInstance: (id, settingPanelCallback) => {
          const item = <RefreshButtonItem id={id} />
          return {
            id,
            item,
            preferredHeight: 1,
            preferredWidth: 2,
            settingPanel: <RefreshButtonSettingPanel id={id} item={item}
              save={(newParams) => this.saveItem(id, newParams, 'refresh_button')}
              settingPanelCallback={settingPanelCallback} />
          }
        }, // newInstance this way OR an initial ItemSettingPanel instance instead
        restoreInstance: (id, params, settingPanelCallback) => {
          const item = <RefreshButtonItem id={id} />
          return {
            item,
            settingPanel: <RefreshButtonSettingPanel id={id} originalParams={params} item={item}
              save={(newParams) => this.saveItem(id, newParams, 'refresh_button')}
              settingPanelCallback={settingPanelCallback} />
          }
        },
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
        newInstance: (id, settingPanelCallback) => <SocketLoggerSettingPanel id={id}
          save={(newParams) => this.saveItem(id, newParams, 'socket_logger')}
          settingPanelCallback={settingPanelCallback} />, // newInstance this way OR like refresh_button example
        restoreInstance: (id, params, settingPanelCallback) => {
          const item = <SocketLoggerItem id={id} params={params} />
          return {
            item,
            settingPanel: <SocketLoggerSettingPanel id={id} originalParams={params} item={item}
              save={(newParams) => this.saveItem(id, newParams, 'socket_logger')}
              settingPanelCallback={settingPanelCallback} />
          }
        },
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

  instantiateNewItem (additionalItemId, id, settingPanelCallback) {
    return this.saveItem(id, {}, additionalItemId)
    .then(() => this.items[additionalItemId].newInstance(id, settingPanelCallback))
  }

  instantiateItem (id, settingPanelCallback) {
    // must return { item, settingPanel }
    // OR a promise resolving the same structure,
    // OR throw an error with error.status = 404 if not found (other errors won't be caught).

    return this.context.serverStorage.getItem(id)
    .then(({ additionalItemId, params }) => this.items[additionalItemId].restoreInstance(id, params, settingPanelCallback))
  }

  saveItem (id, params, additionalItemId) {
    // must return a Promise that resolves once save is persisted and can be retrieved by a read operation.
    if (!additionalItemId) {
      return this.context.serverStorage.getItem(id)
      .then((data) => this.context.serverStorage.setItem(id, { additionalItemId: data.additionalItemId, params }))
    }
    return this.context.serverStorage.setItem(id, { additionalItemId, params })
  }

  removeItem (id) {
    // This is an async event. Do not return a Promise when finished.
    console.log(`Ok, item #${id} is removed.`)
    // TODO !8: when needed, purge data server side for this instance? only if not used by another board !!! how to do ?
  }
}

export default DeveloperToolsItemFactory
