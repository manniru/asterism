'use strict'

import { Scenarii } from 'asterism-plugin-library'

import BrowserProcedureEditForm from './edit-form'

const { BrowserAction } = Scenarii

class BrowserProcedure extends BrowserAction {
  // TODO !2: dynamic getters !
  get name () {
    return this.data.name || 'Unnamed procedure'
  }
  get shortLabel () {
    return 'Procedure that does this...'
  }
  get fullLabel () {
    return 'Procedure that does this, then that, then this.'
  }

  get EditForm () {
    return BrowserProcedureEditForm
  }

  presave (services) {
    return Promise.resolve()
    // TODO !2: clean all elements that are not in the procedure anymore (actions with this as parent)
  }
}

BrowserProcedure.type = Object.assign({}, BrowserAction.type, {
  name: 'Procedure',
  shortLabel: 'Basic procedure',
  fullLabel: 'A scripted list of actions, played in sequence or simultaneously'
})

export default BrowserProcedure
