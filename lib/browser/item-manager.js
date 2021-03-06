'use strict'

/* global $, process */
import React from 'react'
import { Item } from 'react-gridifier/dist/materialize'
import { Button, Icon } from 'react-materialize'

import { sleep } from './tools'
import OrderHandler from './order-handler'
import Resizer from './edition/resizer'

const _brokenItem = (id, clickCallback) => (
  <Button key={id} waves='red' className='grey lighten-2 red-text truncate fluid' onClick={() => clickCallback(id)}>
    <Icon medium>warning</Icon> <Icon medium>healing</Icon>
  </Button>
)

const getFromId = (id, factories, returnFactory, settingPanelCallback = null, brokenCallback = () => {}) => {
  try {
    const splitId = id.split('~~')
    if (splitId.length !== 2) {
      throw new Error()
    }
    const factoryId = splitId[0]
    const factory = factories.find((f) => f.id === factoryId)
    if (returnFactory) {
      return factory // if returnFactory === true, returns sync always
    }
    const item = factory.instantiateItem(id, settingPanelCallback)
    if (item instanceof Promise) {
      return item // async object
      .catch((error) => {
        if (error.status && error.status === 404) {
          console.error(`Item instance ${id} not found from factory ${factoryId}.`)
          return { item: _brokenItem(id, brokenCallback) }
        }
        throw error
      })
    }
    return item // sync object
  } catch (error) {
    if (returnFactory) {
      throw error
    }
    return { item: _brokenItem(id, brokenCallback) }
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
    return this.serverStorage.getItemForPath('order-handler')
    .then((order) => {
      this.orderHandler.setLocalOrder(order || [])
      Promise.all(this.getAllItems())
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
      const item = getFromId(id, factories, false, this.settingPanelClosed.bind(this), this.removeItem.bind(this))
      if (item instanceof Promise) {
        return item.then((data) => this.encapsulateItem({ id, w, h, ...data }))
      }
      return Promise.resolve(this.encapsulateItem({ id, w, h, ...item }))
    })
  }

  encapsulateItem ({ item, id, w = 1, h = 1, settingPanel = null }) {
    const removeHandler = () => this.removeItem(id)
    const settingsHandler = () => {
      if (settingPanel) {
        this.mainComponent.setState({ itemSettingPanel: settingPanel })
        if (this.mainComponent.state.animationLevel >= 3) {
          setTimeout(() => {
            $('#item-setting-modal .coloring-header').addClass(this.mainComponent.props.theme.backgrounds.editing)
          }, 340)
        }
      }
    }
    const resizeHandler = () => {
      $(`#resizer-${id.substr(-36)}`).modal('open')
    }
    resizeHandler.settingPanel = settingPanel // useful for resize func
    resizeHandler.item = item // useful for resize func

    // TODO !8: if bad perf, render <Resizer /> only in edition mode! Pb: seems too static...
    return (
      <Item
        width={w}
        height={h}
        id={id}
        key={id.substr(-36)}
        draggable
        removable={!!removeHandler}
        removeHandler={removeHandler}
        settingsHandler={settingsHandler}
        resizeHandler={resizeHandler}
      >
        {item}
        <Resizer
          acceptedDimensions={item.props.acceptedDimensions || [{ h, w }]}
          mainComponent={this.mainComponent}
          initialHeight={h}
          initialWidth={w}
          itemId={id}
        />
      </Item>
    )
  }

  addNewItem (id, item, h, w, settingPanel, animationFlow = null) {
    return Promise.all(this.getAllItems()) // TODO !8: if bad perf, replace .all() by .each() with a callback for each element
    .then((items) => {
      items.push(this.encapsulateItem({ item, id, w, h, settingPanel }))
      this.mainComponent.setState({ items, animationFlow })
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

  resizeItem (id, h, w) {
    Promise.all(this.getAllItems()) // TODO !8: if bad perf, replace .all() by .each() with a callback for each element
    .then((items) => {
      this.orderHandler.setLocalOrder(this.orderHandler.getLocalOrder().map((item) => {
        if (item.id !== id) {
          return item
        }
        item.w = w
        item.h = h
        return item
      }))
      this.mainComponent.setState({ items: items.map((item) => {
        if (item.props.id !== id) {
          return item
        }
        return this.encapsulateItem({
          item: item.props.resizeHandler.item,
          id,
          w,
          h,
          settingPanel: item.props.resizeHandler.settingPanel
        })
      }) })
      this.mainComponent.gridComponent.reposition() // force grid to reposition, avoiding overlaps and gaps
    })
  }

  settingPanelClosed (data) {
    $('#item-setting-modal').modal('close')
    sleep(400)
    .then(() => {
      if (data) {
        // new item to add
        const { id, item, preferredHeight, preferredWidth, settingPanel } = data
        this.addNewItem(id, item, preferredHeight, preferredWidth, settingPanel)
      }
      this.mainComponent.setState({ itemSettingPanel: null })
    })
  }
}

export default ItemManager
