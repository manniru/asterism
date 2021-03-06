'use strict'

import { Scenarii } from 'asterism-plugin-library'
import Joi from 'joi'
import uuid from 'uuid'

import baseElements from '../base-elements/browser'

const { BrowserAction, BrowserState, BrowserCondition, BrowserTrigger, BrowserScenario } = Scenarii
const _defaultSchema = Joi.object().keys({ }).unknown(false)
const _schemaSchema = Joi.object().schema()

export default class ScenariiService {
  constructor ({ getServices, notificationManager, mainState, privateSocket, publicSockets }) {
    this.privateSocket = privateSocket
    this.actions = {}
    this.states = {}
    this.stateListeners = {}
    this.conditions = {}
    this.triggers = {}
    this.scenarii = {}
    this.scenarioListeners = {}

    // Register base elements
    baseElements().forEach(({ id, browserClass, dataSchema }) => {
      this.registerElementType(id, browserClass, dataSchema)
    })
    this.privateSocket.on('stateChanged', (instance) => {
      (this.stateListeners[instance.instanceId] || []).forEach((listener) => {
        listener(instance.data.state, instance)
      })
    })
    this.privateSocket.on('scenarioActivationChanged', (instance) => {
      (this.scenarioListeners[instance.instanceId] || []).forEach((listener) => {
        listener('scenarioActivationChanged', instance)
      }); // keep coma, else bug...
      (this.scenarioListeners['*'] || []).forEach((listener) => {
        listener('scenarioActivationChanged', instance)
      })
    })
  }

  registerElementType (id, BrowserClass, dataSchema = _defaultSchema, TestClass = null) {
    if (!dataSchema.isJoi) {
      dataSchema = Joi.compile(dataSchema)
    }
    return Joi.validate(dataSchema, _schemaSchema)
    .then(() => {
      TestClass = TestClass || BrowserClass
      switch (Object.getPrototypeOf(TestClass) && Object.getPrototypeOf(TestClass).type.name) {
        case BrowserAction.type.name:
          console.log(`Element type ${id} is an action...`)
          this.actions[id] = { BrowserClass, dataSchema }
          break
        case BrowserState.type.name:
          console.log(`Element type ${id} is a state...`)
          this.states[id] = { BrowserClass, dataSchema }
          break
        case BrowserCondition.type.name:
          console.log(`Element type ${id} is a condition...`)
          this.conditions[id] = { BrowserClass, dataSchema }
          break
        case BrowserTrigger.type.name:
          console.log(`Element type ${id} is a trigger...`)
          this.triggers[id] = { BrowserClass, dataSchema }
          break
        case BrowserScenario.type.name:
          console.log(`Element type ${id} is a scenario...`)
          this.scenarii[id] = { BrowserClass, dataSchema }
          break
        default:
          if (!Object.getPrototypeOf(TestClass)) {
            console.error(`You are trying to register a scenarii element '${BrowserClass.type.name}' that do not extends a base element!`)
          } else {
            return this.registerElementType(id, BrowserClass, dataSchema, Object.getPrototypeOf(TestClass))
          }
      }
    })
    .catch((error) => {
      console.error('The dataSchema you are trying to register is incorrect', error)
    })
  }

  // Actions
  getActionTypes () {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getActionTypes', (types) => {
        resolve(types.map((type) => {
          const { BrowserClass } = this.actions[type]
          if (!BrowserClass.id) {
            BrowserClass.id = type
            Object.freeze(BrowserClass)
          }
          return BrowserClass
        }))
      })
      setTimeout(reject, 700)
    })
  }
  getActionInstances (parent = undefined) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getActionInstances', parent, (instances) => {
        resolve(instances.map(({ typeId, instanceId, data, parent }) => {
          if (!this.actions[typeId]) {
            console.warn('Action instance of unknown type found. Maybe you removed a plugin.')
            return null
          }
          const { BrowserClass } = this.actions[typeId]
          const instance = new BrowserClass(data)
          instance.instanceId = instanceId
          instance.typeId = typeId
          instance.parent = parent
          instance.save = this.setActionInstance.bind(this, instance)
          instance.delete = this.deleteActionInstance.bind(this, instance)
          return instance
        }))
      })
      setTimeout(reject, 2000)
    })
  }
  getActionInstance (instanceId, asObject = false) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getActionInstance', instanceId, (instance) => {
        if (instance && asObject) {
          const { typeId, instanceId, data, parent } = instance
          if (!this.actions[typeId]) {
            console.warn('Action instance of unknown type found. Maybe you removed a plugin.')
            return null
          }
          const { BrowserClass } = this.actions[typeId]
          const instanceObject = new BrowserClass(data)
          instanceObject.instanceId = instanceId
          instanceObject.typeId = typeId
          instanceObject.parent = parent
          instanceObject.save = this.setActionInstance.bind(this, instanceObject)
          instanceObject.delete = this.deleteActionInstance.bind(this, instanceObject)
          resolve(instanceObject)
        } else {
          resolve(instance)
        }
      })
      setTimeout(reject, 700)
    })
  }
  createActionInstance (typeId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('createActionInstance', typeId, (instanceData) => {
        const { BrowserClass } = this.actions[instanceData.typeId]
        const instance = new BrowserClass(instanceData.data)
        instance.instanceId = instanceData.instanceId
        instance.typeId = typeId
        instance.save = this.setActionInstance.bind(this, instance)
        instance.delete = this.deleteActionInstance.bind(this, instance)
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  setActionInstance (instance, parent = undefined) {
    const { dataSchema } = this.actions[instance.typeId]
    return Joi.validate(instance.data, dataSchema)
    .then((fixedData) => {
      instance.data = fixedData
      return new Promise((resolve, reject) => {
        this.privateSocket.emit('setActionInstance', instance, parent, (success) => {
          if (success) {
            return resolve(instance)
          }
          reject(success)
        })
        setTimeout(reject, 2000)
      })
    })
  }
  deleteActionInstance (instance) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('deleteActionInstance', instance, (success) => {
        if (success) {
          return resolve(instance)
        }
        reject(success)
      })
      setTimeout(reject, 2000)
    })
  }
  executeActionInstance (instance, timeout = 10000, executionId = null) {
    if (!executionId) {
      executionId = uuid.v4()
    }
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('executeActionInstance', instance, executionId, (success) => {
        return resolve(success)
      })
      setTimeout(reject, timeout) // After timeout, action execution is cancelled on the UI (but will continue on the server)
    })
  }
  abortActionInstance (instance, executionId, timeout = 10000) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('abortActionInstance', instance, executionId, (success) => {
        return resolve(success)
      })
      setTimeout(reject, timeout) // After timeout, action abortion is cancelled on the UI (but will try to continue on the server)
    })
  }

  // States
  getStateTypes () {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getStateTypes', (types) => {
        resolve(types.map((type) => {
          const { BrowserClass } = this.states[type]
          if (!BrowserClass.id) {
            BrowserClass.id = type
            Object.freeze(BrowserClass)
          }
          return BrowserClass
        }))
      })
      setTimeout(reject, 700)
    })
  }
  getStateInstances () {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getStateInstances', (instances) => {
        resolve(instances.map(({ typeId, instanceId, data }) => {
          if (!this.states[typeId]) {
            console.warn('State instance of unknown type found. Maybe you removed a plugin.')
            return null
          }
          const { BrowserClass } = this.states[typeId]
          const instance = new BrowserClass(data)
          instance.instanceId = instanceId
          instance.typeId = typeId
          instance.save = this.setStateInstance.bind(this, instance)
          instance.delete = this.deleteStateInstance.bind(this, instance)
          return instance
        }))
      })
      setTimeout(reject, 2000)
    })
  }
  getStateInstance (instanceId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getStateInstance', instanceId, (instance) => {
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  createStateInstance (typeId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('createStateInstance', typeId, (instanceData) => {
        const { BrowserClass } = this.states[instanceData.typeId]
        const instance = new BrowserClass(instanceData.data)
        instance.instanceId = instanceData.instanceId
        instance.typeId = typeId
        instance.save = this.setStateInstance.bind(this, instance)
        instance.delete = this.deleteStateInstance.bind(this, instance)
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  setStateInstance (instance) {
    const { dataSchema } = this.states[instance.typeId]
    return Joi.validate(instance.data, dataSchema)
    .then((fixedData) => {
      instance.data = fixedData
      return new Promise((resolve, reject) => {
        this.privateSocket.emit('setStateInstance', instance, (success) => {
          if (success) {
            return resolve(instance)
          }
          reject(success)
        })
        setTimeout(reject, 2000)
      })
    })
  }
  deleteStateInstance (instance) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('deleteStateInstance', instance, (success) => {
        if (success) {
          return resolve(instance)
        }
        reject(success)
      })
      setTimeout(reject, 2000)
    })
  }
  addStateListener (instance, listener) {
    listener.stateListenerId = uuid.v4()
    this.stateListeners[instance.instanceId] = this.stateListeners[instance.instanceId] || []
    this.stateListeners[instance.instanceId].push(listener)
    return listener.stateListenerId
  }
  removeStateListener (instance, listenerId) {
    this.stateListeners[instance.instanceId] = (this.stateListeners[instance.instanceId] || []).filter(
      (listener) => listener.stateListenerId === listenerId
    )
  }

  // Conditions
  getConditionTypes () {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getConditionTypes', (types) => {
        resolve(types.map((type) => {
          const { BrowserClass } = this.conditions[type]
          if (!BrowserClass.id) {
            BrowserClass.id = type
            Object.freeze(BrowserClass)
          }
          return BrowserClass
        }))
      })
      setTimeout(reject, 700)
    })
  }
  getConditionInstances (parent = undefined) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getConditionInstances', parent, (instances) => {
        resolve(instances.map(({ typeId, instanceId, data }) => {
          if (!this.conditions[typeId]) {
            console.warn('Condition instance of unknown type found. Maybe you removed a plugin.')
            return null
          }
          const { BrowserClass } = this.conditions[typeId]
          const instance = new BrowserClass(data)
          instance.instanceId = instanceId
          instance.typeId = typeId
          instance.save = this.setConditionInstance.bind(this, instance)
          instance.delete = this.deleteConditionInstance.bind(this, instance)
          return instance
        }))
      })
      setTimeout(reject, 2000)
    })
  }
  getConditionInstance (instanceId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getConditionInstance', instanceId, (instance) => {
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  createConditionInstance (typeId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('createConditionInstance', typeId, (instanceData) => {
        const { BrowserClass } = this.conditions[instanceData.typeId]
        const instance = new BrowserClass(instanceData.data)
        instance.instanceId = instanceData.instanceId
        instance.typeId = typeId
        instance.save = this.setConditionInstance.bind(this, instance)
        instance.delete = this.deleteConditionInstance.bind(this, instance)
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  setConditionInstance (instance, parent = undefined) {
    const { dataSchema } = this.actions[instance.typeId]
    return Joi.validate(instance.data, dataSchema)
    .then((fixedData) => {
      instance.data = fixedData
      return new Promise((resolve, reject) => {
        this.privateSocket.emit('setConditionInstance', instance, parent, (success) => {
          if (success) {
            return resolve(instance)
          }
          reject(success)
        })
        setTimeout(reject, 2000)
      })
    })
  }
  deleteConditionInstance (instance) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('deleteConditionInstance', instance, (success) => {
        if (success) {
          return resolve(instance)
        }
        reject(success)
      })
      setTimeout(reject, 2000)
    })
  }
  testConditionInstance (instance, timeout = 10000) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('testConditionInstance', instance, (success) => {
        return resolve(success)
      })
      setTimeout(reject, timeout) // After timeout, condition execution is cancelled on the UI (but will continue on the server)
    })
  }

  // Triggers
  getTriggerTypes () {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getTriggerTypes', (types) => {
        resolve(types.map((type) => {
          const { BrowserClass } = this.triggers[type]
          if (!BrowserClass.id) {
            BrowserClass.id = type
            Object.freeze(BrowserClass)
          }
          return BrowserClass
        }))
      })
      setTimeout(reject, 700)
    })
  }
  getTriggerInstances (parent = undefined) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getTriggerInstances', parent, (instances) => {
        resolve(instances.map(({ typeId, instanceId, data }) => {
          if (!this.triggers[typeId]) {
            console.warn('Trigger instance of unknown type found. Maybe you removed a plugin.')
            return null
          }
          const { BrowserClass } = this.triggers[typeId]
          const instance = new BrowserClass(data)
          instance.instanceId = instanceId
          instance.typeId = typeId
          instance.save = this.setTriggerInstance.bind(this, instance)
          instance.delete = this.deleteTriggerInstance.bind(this, instance)
          return instance
        }))
      })
      setTimeout(reject, 2000)
    })
  }
  getTriggerInstance (instanceId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getTriggerInstance', instanceId, (instance) => {
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  createTriggerInstance (typeId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('createTriggerInstance', typeId, (instanceData) => {
        const { BrowserClass } = this.triggers[instanceData.typeId]
        const instance = new BrowserClass(instanceData.data)
        instance.instanceId = instanceData.instanceId
        instance.typeId = typeId
        instance.save = this.setTriggerInstance.bind(this, instance)
        instance.delete = this.deleteTriggerInstance.bind(this, instance)
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  setTriggerInstance (instance, parent = undefined) {
    const { dataSchema } = this.actions[instance.typeId]
    return Joi.validate(instance.data, dataSchema)
    .then((fixedData) => {
      instance.data = fixedData
      return new Promise((resolve, reject) => {
        this.privateSocket.emit('setTriggerInstance', instance, parent, (success) => {
          if (success) {
            return resolve(instance)
          }
          reject(success)
        })
        setTimeout(reject, 2000)
      })
    })
  }
  deleteTriggerInstance (instance) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('deleteTriggerInstance', instance, (success) => {
        if (success) {
          return resolve(instance)
        }
        reject(success)
      })
      setTimeout(reject, 2000)
    })
  }

  // Scenarii
  getScenarioTypes () {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getScenarioTypes', (types) => {
        resolve(types.map((type) => {
          const { BrowserClass } = this.scenarii[type]
          if (!BrowserClass.id) {
            BrowserClass.id = type
            Object.freeze(BrowserClass)
          }
          return BrowserClass
        }))
      })
      setTimeout(reject, 700)
    })
  }
  getScenarioInstances () {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getScenarioInstances', (instances) => {
        resolve(instances.map(({ typeId, instanceId, data }) => {
          if (!this.scenarii[typeId]) {
            console.warn('Scenario instance of unknown type found. Maybe you removed a plugin.')
            return null
          }
          const { BrowserClass } = this.scenarii[typeId]
          const instance = new BrowserClass(data)
          instance.instanceId = instanceId
          instance.typeId = typeId
          instance.save = this.setScenarioInstance.bind(this, instance)
          instance.delete = this.deleteScenarioInstance.bind(this, instance)
          return instance
        }))
      })
      setTimeout(reject, 2000)
    })
  }
  getScenarioInstance (instanceId, asObject = false) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('getScenarioInstance', instanceId, (instance) => {
        if (instance && asObject) {
          const { typeId, instanceId, data, parent } = instance
          if (!this.scenarii[typeId]) {
            console.warn('Scenario instance of unknown type found. Maybe you removed a plugin.')
            return null
          }
          const { BrowserClass } = this.scenarii[typeId]
          const instanceObject = new BrowserClass(data)
          instanceObject.instanceId = instanceId
          instanceObject.typeId = typeId
          instanceObject.parent = parent
          instanceObject.save = this.setScenarioInstance.bind(this, instanceObject)
          instanceObject.delete = this.deleteScenarioInstance.bind(this, instanceObject)
          resolve(instanceObject)
        } else {
          resolve(instance)
        }
      })
      setTimeout(reject, 700)
    })
  }
  createScenarioInstance (typeId) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('createScenarioInstance', typeId, (instanceData) => {
        const { BrowserClass } = this.scenarii[instanceData.typeId]
        const instance = new BrowserClass(instanceData.data)
        instance.instanceId = instanceData.instanceId
        instance.typeId = typeId
        instance.save = this.setScenarioInstance.bind(this, instance)
        instance.delete = this.deleteScenarioInstance.bind(this, instance)
        resolve(instance)
      })
      setTimeout(reject, 700)
    })
  }
  setScenarioInstance (instance) {
    const { dataSchema } = this.scenarii[instance.typeId]
    return Joi.validate(instance.data, dataSchema)
    .then((fixedData) => {
      instance.data = fixedData
      return new Promise((resolve, reject) => {
        this.privateSocket.emit('setScenarioInstance', instance, (success) => {
          if (success) {
            return resolve(instance)
          }
          reject(success)
        })
        setTimeout(reject, 2000)
      })
    })
  }
  deleteScenarioInstance (instance) {
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('deleteScenarioInstance', instance, (success) => {
        if (success) {
          return resolve(instance)
        }
        reject(success)
      })
      setTimeout(reject, 2000)
    })
  }
  forceTriggerScenarioInstance (instance, timeout = 10000, executionId = null) {
    if (!executionId) {
      executionId = uuid.v4()
    }
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('forceTriggerScenarioInstance', instance, executionId, (success) => {
        return resolve(success)
      })
      setTimeout(reject, timeout)
    })
  }
  forceAbortScenarioInstance (instance, executionId, timeout = 10000) {
    if (!executionId) {
      executionId = uuid.v4()
    }
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('forceAbortScenarioInstance', instance, executionId, (success) => {
        return resolve(success)
      })
      setTimeout(reject, timeout)
    })
  }
  setActivationScenarioInstance (instance, activate = undefined) {
    if (activate === undefined) { // switch case
      activate = !instance.data.activated
    }
    return new Promise((resolve, reject) => {
      this.privateSocket.emit('setActivationScenarioInstance', instance, activate, (success) => {
        if (success) {
          return resolve(instance)
        }
        reject(success)
      })
      setTimeout(reject, 2000)
    })
  }
  addScenariiListener (listener, instance = { instanceId: '*' }) {
    listener.scenarioListenerId = uuid.v4()
    this.scenarioListeners[instance.instanceId] = this.scenarioListeners[instance.instanceId] || []
    this.scenarioListeners[instance.instanceId].push(listener)
    return listener.scenarioListeners
  }
  removeScenariiListener (listenerId, instance = { instanceId: '*' }) {
    this.scenarioListeners[instance.instanceId] = (this.scenarioListeners[instance.instanceId] || []).filter(
      (listener) => listener.scenarioListenerId === listenerId
    )
  }
}
