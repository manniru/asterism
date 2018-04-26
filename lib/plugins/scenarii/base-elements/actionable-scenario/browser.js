'use strict'

import { Scenarii } from 'asterism-plugin-library'

import BrowserActionableScenarioEditForm from './edit-form'

const { BrowserScenario } = Scenarii

class BrowserActionableScenario extends BrowserScenario {
  get name () {
    return this.data.name ? `Scenario '${this.data.name}'` : `Misconfigured actionable scenario`
  }
  get shortLabel () {
    return this.data.name ? `Actionable scenario: ${this.data.name}` : this.name
  }
  get fullLabel () {
    return this.data.name ? `Action conditionally triggered (${this.data.name})` : this.name
  }

  get EditForm () {
    return BrowserActionableScenarioEditForm
  }
}

BrowserActionableScenario.type = Object.assign({}, BrowserScenario.type, {
  name: 'Actionable scenario',
  shortLabel: 'Actionable scenario',
  fullLabel: 'Action conditionally triggered in a scenario when an event occurs.'
})

export default BrowserActionableScenario
