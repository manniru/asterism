'use strict'

import { Scenarii } from 'asterism-plugin-library'
const { ServerScenario } = Scenarii

export default class ServerActionableScenario extends ServerScenario {
  get name () {
    return this.data.name ? `Scenario ${this.data.name}` : `Misconfigured actionable scenario`
  }

  trigger (executionId, nextStep = (result) => result) {
    const triggerChain = (result) => {
      if (!result) {
        return result
      }

      return new Promise((resolve, reject) => {
        console.log('### test') // TODO !0: continue, test condition, and then execute action
        resolve(true)
      })
      .then(nextStep)
    }

    return super.trigger(executionId, triggerChain)
  }

  abort (executionId, nextStep = (result) => result) {
    const abortChain = (result) => {
      if (!result) {
        return result
      }

      return new Promise((resolve, reject) => {
        console.log('### abort test') // TODO !0: abort action if in execution...
        resolve(true)
      })
      .then(nextStep)
    }

    return super.abort(executionId, abortChain)
  }
}
