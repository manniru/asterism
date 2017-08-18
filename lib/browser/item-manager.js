'use strict'

/* global process */
import React from 'react'
import { Item } from 'react-gridifier/dist/materialize'
import uuid from 'uuid'
import OrderHandler from './order-handler'

const getFromId = (id, factories) => {
  try {
    const splitId = id.split('~~')
    if (splitId.length !== 2) {
      throw new Error()
    }
    const factoryId = splitId[0]
    const instanceId = splitId[1]
    const factory = factories.find((f) => f.id === factoryId)
    return factory.instantiateItem(instanceId)
  } catch (error) {
    return { item: <div>Broken item!</div> }
  }
}

class ItemManager {
  constructor (localStorage, serverStorage, mainComponent) {
    this.localStorage = localStorage
    this.serverStorage = serverStorage
    this.mainComponent = mainComponent
    this.orderHandler = new OrderHandler(
      localStorage,
      'order-handler',
      this.applyServerOrder.bind(this)
    )
  }

  applyServerOrder () {
    this.serverStorage.getItem('order-handler')
    .then((order) => {
      this.orderHandler.setLocalOrder(order || [])
      this.mainComponent.setState({ items: this.getAllItems() })
      this.orderHandler.restoreOrder()
    })
    .catch((error) => {
      if (error.status !== 404) {
        console.error(error)
      }
    })
  }

  getAllItems () {
    const factories = this.mainComponent.state.itemFactories
    return this.orderHandler.getLocalOrder().map(({ id, w, h }) => {
      return this.encapsulateItem({ id, w, h, ...getFromId(id, factories) })
    })
  }

  encapsulateItem ({ item, id, w = 1, h = 1, settingPanel }) {
    const removeHandler = () => null // TODO !2: handler! help with gridifier examples
    const settingsHandler = () => {
      // TODO !2: do something with settingPanel if not null !
    }

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

  addNewItem (item, h, w, settingPanel, factoryId) {
    const instanceId = uuid.v4()
    const id = `${factoryId}~~${instanceId}`

    const items = this.getAllItems()
    items.push(this.encapsulateItem({ item, id, w, h, settingPanel }))
    this.mainComponent.pushItems(items)
  }
}

export default ItemManager
