'use strict'

class AdditionalItem {
  constructor (itemFactory, id, name, category, description, icon) {
    this.itemFactory = itemFactory
    this.id = id
    this.name = name
    this.category = category
    this.description = description
    this.icon = icon
  }

  instantiateNewItem () {
    return this.itemFactory.instantiateNewItem(this.id)
  }
}

export default AdditionalItem
