'use strict'

import OrderHandler from './order-handler'

class ItemManager {
  constructor (localStorage, serverStorage, mainComponent) {
    this.localStorage = localStorage
    this.serverStorage = serverStorage
    this.orderHandler = new OrderHandler(localStorage, 'order-handler', serverStorage.getItem('order-handler'))
  }

  addNewItem (item) {
    // TODO !0: add a component: mainComponent.setState(...).
    // need to encapsulate in a div ?
  }
}

export default ItemManager
