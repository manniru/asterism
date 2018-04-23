'use strict'

import { Scenarii } from 'asterism-plugin-library'
const { ServerScenario } = Scenarii

export default class ServerActionableScenario extends ServerScenario {
  get name () {
    return this.data.name ? `Scenario ${this.data.name}` : `Misconfigured actionable scenario`
  }
}
