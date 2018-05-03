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
        console.log('TODO !2: condition to do')
        // TODO !2: test condition from this.data.executionCondition, resolve(true) if succeed, resolve(false) else, reject if error
        resolve(true)
      })
      .then((result) => {
        if (!result) {
          return result
        }

        return ServerActionableScenario.scenariiService.getActionInstance(this.data.action)
        .then((action) => ServerActionableScenario.scenariiService.executeActionData(action, executionId))
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

      return ServerActionableScenario.scenariiService.abortActionData({ instanceId: this.data.action }, executionId)
      .then(nextStep)
    }

    return super.abort(executionId, abortChain)
  }
}
