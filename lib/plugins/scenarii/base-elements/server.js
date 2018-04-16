'use strict'

import ServerLevelState from './level-state/server'
import schemaLevelState from './level-state/schema'

import ServerProcedure from './procedure/server'
import schemaProcedure from './procedure/schema'

import ServerLevelStateChanger from './level-state-changer/server'
import schemaLevelStateChanger from './level-state-changer/schema'

import ServerWait from './wait/server'
import schemaWait from './wait/schema'

import ServerActionAborter from './action-aborter/server'
import schemaActionAborter from './action-aborter/schema'

const baseElementTypes = ({ logger, scenariiService }) => {
  ServerProcedure.scenariiService = scenariiService
  ServerLevelStateChanger.logger = logger
  ServerLevelStateChanger.scenariiService = scenariiService
  return [
    // States
    { id: 'level-state', serverClass: ServerLevelState, dataSchema: schemaLevelState },

    // Actions
    { id: 'base-procedure', serverClass: ServerProcedure, dataSchema: schemaProcedure },
    { id: 'level-state-changer', serverClass: ServerLevelStateChanger, dataSchema: schemaLevelStateChanger },
    { id: 'base-wait', serverClass: ServerWait, dataSchema: schemaWait },
    { id: 'action-aborter', serverClass: ServerActionAborter, dataSchema: schemaActionAborter }

    // Conditions
    // TODO !3: "at the right moment": between XhXX and YhYY; on the X day of week;
    // { id: 'base-combination', serverClass: Object, dataSchema: {} } // TODO !4

    // Triggers

    // Scenarii
  ]
}

export default baseElementTypes
