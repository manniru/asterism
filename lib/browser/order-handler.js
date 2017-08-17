'use strict'

import EventEmitter from 'events'

const parseGridChildren = (gridNode) => {
  const children = []
  for (const i of gridNode.children) {
    children.push({ id: i.id, guid: i.attributes['data-gridifier-guid'].value }) // TODO !0: add other params (h,w,...)
  }
  return children.sort((a, b) => {
    return a.guid - b.guid
  })
}

export default class LocalStorageHandler extends EventEmitter {
  constructor (storage, key, noLocalOrderCallback) {
    super()
    this.storage = storage
    this.key = key
    const storeContent = this.storage.getItem(this.key)
    if (storeContent) {
      this.persistedOrder = JSON.parse(storeContent)
    } else {
      // no local order stored, nothing to do here, item-manager will take care of fetching server order async way.
      noLocalOrderCallback()
    }
  }

  onChange (gridNode) {
    const order = parseGridChildren(gridNode)
    this.setLocalOrder(order)
  }

  setLocalOrder (order) {
    this.storage.setItem(this.key, JSON.stringify(order || []))
    this.persistedOrder = order || []
  }

  getLocalOrder () {
    return this.persistedOrder || []
  }

  restoreOrder () {
    this.emit('sort-order-list', this.persistedOrder || [])
  }
}
