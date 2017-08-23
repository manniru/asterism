'use strict'

/* global process */
import React from 'react'
import { Item } from 'react-gridifier/dist/materialize'
import uuid from 'uuid'
import OrderHandler from './order-handler'

const getFromId = (id, factories, returnFactory = false) => {
  try {
    const splitId = id.split('~~')
    if (splitId.length !== 2) {
      throw new Error()
    }
    const factoryId = splitId[0]
    const instanceId = splitId[1]
    const factory = factories.find((f) => f.id === factoryId)
    if (returnFactory) {
      return factory // if returnFactory === true, returns sync always
    }
    const item = factory.instantiateItem(instanceId)
    if (item instanceof Promise) {
      return item // async object
      .catch((error) => {
        if (error.status && error.status === 404) {
          console.error(`Item instance ${instanceId} not found from factory ${factoryId}.`)
          return { item: <div>Broken item!</div> }
        }
        throw error
      })
    }
    return item // sync object
  } catch (error) {
    if (returnFactory) {
      throw error
    }
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
      Promise.all(this.getAllItems()) // TODO !8: if bad perf, replace .all() by .each() with a callback for each element
      .then((items) => {
        this.mainComponent.setState({ items })
        this.orderHandler.restoreOrder()
      })
    })
    .catch((error) => {
      if (error.status !== 404) {
        console.error(error)
      }
    })
  }

  getAllItems () {
    // get an array of Promise
    const factories = this.mainComponent.state.itemFactories
    return this.orderHandler.getLocalOrder().map(({ id, w, h }) => {
      const item = getFromId(id, factories)
      if (item instanceof Promise) {
        return item.then((data) => this.encapsulateItem({ id, w, h, ...data }))
      }
      return Promise.resolve(this.encapsulateItem({ id, w, h, ...item }))
    })
  }

  encapsulateItem ({ item, id, w = 1, h = 1, settingPanel }) {
    const removeHandler = () => this.removeItem(id)
    const settingsHandler = () => {
      if (settingPanel) {
        this.mainComponent.setState({ itemSettingPanel: settingPanel })
      }
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

    Promise.all(this.getAllItems()) // TODO !8: if bad perf, replace .all() by .each() with a callback for each element
    .then((items) => {
      items.push(this.encapsulateItem({ item, id, w, h, settingPanel }))
      this.mainComponent.setState({ items })
    })
  }

  removeItem (id) {
    Promise.all(this.getAllItems()) // TODO !8: if bad perf, replace .all() by .each() with a callback for each element
    .then((items) => {
      this.orderHandler.setLocalOrder(this.orderHandler.getLocalOrder().filter((i) => i.id !== id))
      this.mainComponent.setState({ items: items.filter((i) => i.props.id !== id) })

      // async event sent to itemFactory
      const factories = this.mainComponent.state.itemFactories
      const factory = getFromId(id, factories, true)
      factory.removeItem(id)
    })
  }
}

export default ItemManager
