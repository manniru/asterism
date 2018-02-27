'use strict'

import ServerProcedure from './procedure/server'
import schemaProcedure from './procedure/schema'

import ServerLevelState from './level-state/server'
import schemaLevelState from './level-state/schema'

const baseElementTypes = () => ([
  { id: 'level-state', serverClass: ServerLevelState, dataSchema: schemaLevelState },
  { id: 'base-procedure', serverClass: ServerProcedure, dataSchema: schemaProcedure }
  // { id: 'base-combination', serverClass: Object, dataSchema: {} } // TODO !3
])

export default baseElementTypes
