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
}
