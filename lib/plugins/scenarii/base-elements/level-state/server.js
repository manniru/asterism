'use strict'

import { Scenarii } from 'asterism-plugin-library'
const { ServerState } = Scenarii

export default class ServerLevelState extends ServerState {
  get name () {
    return this.data.name || 'Unnamed level state'
  }

  get color () {
    return this.data.colors[this.data.state]
  }

  get state () {
    return this.data.state
  }

  set state (state) {
    if (state > this.data.max) {
      this.data.state = this.data.max
    } else {
      if (state < 1) {
        this.data.state = 1
      } else {
        this.data.state = state
      }
    }

    this.listeners.forEach((listener) => {
      listener(state)
    })
  }
}
