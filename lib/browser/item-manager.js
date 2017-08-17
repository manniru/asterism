'use strict'

/* global process */
import { Item } from 'react-gridifier/dist/materialize'
import uuid from 'uuid'
import OrderHandler from './order-handler'

class ItemManager {
  constructor (localStorage, serverStorage, mainComponent) {
    this.localStorage = localStorage
    this.serverStorage = serverStorage
    this.mainComponent = mainComponent
    this.orderHandler = new OrderHandler(localStorage, 'order-handler', this.applyServerOrder.bind(this))
  }

  applyServerOrder () {
    this.serverStorage.getItem('order-handler')
    .then((order) => {
      this.orderHandler.setLocalOrder(order || [])
      // TODO !0: refresh mainComponent: mainComponent.setState({ ... , items: this.getAllItems() })
      this.orderHandler.restoreOrder()
    })
    .catch((error) => {
      if (error.status !== 404) {
        console.error(error)
      }
    })
  }

  getAllItems () {
    console.log(this.orderHandler.getLocalOrder(), 'TEST')
    // TODO !0: map each item from this.orderHandler.getLocalOrder with this.encapsulateItem()
    return []
  }

  encapsulateItem (item, { id, w = 1, h = 1, settingsHandler = null }) {
    const removeHandler = () => null // TODO !1: handler! help with gridifier examples

    return (
      <Item
        width={w}
        height={h}
        id={id}
        key={id}
        draggable
        removable={!!removeHandler}
        removeHandler={removeHandler}
        settingsHandler={settingsHandler}
      >
        {item}
      </Item>
    )
  }

  addNewItem (item, fromItemFactory) {
    const factoryId = fromItemFactory.id
    const instanceId = uuid.v4()
    const fullId = `${factoryId}~${instanceId}`

    console.log(fullId, 'FINISH')
    // TODO !0: append a component: mainComponent.setState(...). ???
    // need to encapsulate in a Item (from gridifier lib)
  }
}

export default ItemManager
