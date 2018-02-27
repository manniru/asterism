'use strict'

import { Scenarii } from 'asterism-plugin-library'

import BrowserLevelStateEditForm from './edit-form'

const { BrowserState } = Scenarii

class BrowserLevelState extends BrowserState {
  // TODO !0: dynamic getters !
  get name () {
    return this.data.name || 'Unnamed level state'
  }
  get shortLabel () {
    return 'level ...'
  }
  get fullLabel () {
    return 'level... to do...'
  }

  get EditForm () {
    return BrowserLevelStateEditForm
  }
}

BrowserLevelState.type = Object.assign({}, BrowserState.type, {
  name: 'Level',
  shortLabel: 'Level state',
  fullLabel: 'A status with levels that will trigger events'
})

export default BrowserLevelState
