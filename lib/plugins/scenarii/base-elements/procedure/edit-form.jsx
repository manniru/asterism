'use strict'

import cx from 'classnames'
import Joi from 'joi'
import PropTypes from 'prop-types'
import React from 'react'
import { Input, Row } from 'react-materialize'
import uuid from 'uuid'
import { Scenarii } from 'asterism-plugin-library'

import schemaProcedure from './schema'

const { ActionsDropdown } = Scenarii

class BrowserProcedureEditForm extends React.Component {
  constructor (props) {
    super(props)

    this.defaultName = Joi.reach(schemaProcedure, 'name')._flags.default
    this.scenariiService = props.services()['asterism-scenarii']

    this.state = {
      deleteElementConfirm: null
    }
    this._mounted = false
  }

  componentDidMount () {
    this._mounted = true
  }

  componentWillUnmount () {
    this._mounted = false
  }

  render () {
    const { instance } = this.props
    const defaultValue = instance.data.name === this.defaultName ? '' : instance.data.name

    return (
      <div>
        <Row className='section card form hide-in-procedure'>
          <Input placeholder='Give a name to quickly identify your action' s={12} label='Name'
            defaultValue={defaultValue} onChange={(e) => { instance.data.name = e.currentTarget.value }} />
        </Row>

        <Row className='section procedurePanel'>
          {this.renderScript(instance.data.script)}
        </Row>
      </div>
    )
  }

  renderScript (script) {
    const waves = this.props.animationLevel >= 2 ? 'waves-effect waves-light' : undefined
    const deleteWaves = this.props.animationLevel >= 2 ? 'btn-flat waves-effect waves-red' : 'btn-flat'
    const deleteWavesConfirm = (this.props.animationLevel >= 2 ? 'btn waves-effect waves-light' : 'btn') + ` ${this.props.theme.actions.negative}`

    const sequences = Object.entries(script).map(([sequenceKey, sequence]) => this.renderSequence(sequence, sequenceKey))
    return (
      <ul className='script'>
        {sequences.map((sequence, idx) => (
          <li key={uuid.v4()}>
            <div className={cx('remove sequence', this.isDeleteSequenceConfirmation(sequence.props['data-sequenceKey'], script, idx) ? deleteWavesConfirm : deleteWaves)}
              onClick={this.deleteSequence.bind(this, script, idx, sequence.props['data-sequenceKey'])}>
              <i className='material-icons'>delete</i>
            </div>
            {sequence}
          </li>
        ))}
        {sequences.length < 32 ? (
          <li className={cx('add sequence', waves)} onClick={this.addSequence.bind(this, script)}><i className='material-icons'>add</i>Add a parallelized sequence</li>
        ) : null}
      </ul>
    )
  }

  renderSequence (sequence, key) {
    const { theme, animationLevel, instance, services } = this.props
    const waves = this.props.animationLevel >= 2 ? 'waves-effect waves-light' : undefined
    const deleteWaves = this.props.animationLevel >= 2 ? 'btn-flat waves-effect waves-red' : 'btn-flat'
    const deleteWavesConfirm = (this.props.animationLevel >= 2 ? 'btn waves-effect waves-light' : 'btn') + ` ${this.props.theme.actions.negative}`

    const scriptsOrActions = sequence.map((e, idx) => (typeof e !== 'string')
      ? [
        this.renderScript(e),
        <div className={cx('removeAction', this.isDeleteScriptConfirmation(e, sequence, idx) ? deleteWavesConfirm : deleteWaves)}
          onClick={this.deleteScript.bind(this, sequence, idx, e)}><i className='material-icons'>delete</i></div>,
        null
      ] : [
        this.renderAction(e),
        <div className={cx('removeAction', this.isDeleteActionConfirmation(e, sequence, idx) ? deleteWavesConfirm : deleteWaves)}
          onClick={this.deleteAction.bind(this, sequence, idx, e)}>
          <i className='material-icons'>{this.isActionGlobal(e) ? 'clear' : 'delete'}</i>
        </div>,
        this.isActionGlobal(e)
          ? <div className='globalizeAction btn-flat disabled'><i className='material-icons'>public</i></div>
          : <div className={cx('globalizeAction btn-flat', waves)} onClick={this.globalizeAction.bind(this, sequence, idx, e)}>
            <i className='material-icons'>public</i>
          </div>
      ]
    )
    return (
      <ol data-sequenceKey={key}>
        {scriptsOrActions.map((scriptOrAction) => (
          <li key={uuid.v4()} >
            {scriptOrAction[0]}
            <div className='orderHandler'><i className='material-icons'>reorder</i></div>
            {scriptOrAction[1]}
            {scriptOrAction[2]}
          </li>
        ))}

        {scriptsOrActions.length < 32 ? (
          <li className='add action'>
            <ActionsDropdown onChange={this.addAction.bind(this, sequence)} theme={theme} animationLevel={animationLevel}
              services={services} parentIdForNewInstance={instance.instanceId} noCreationPanel
              icon={null} label='Add an action' dropdownId={uuid.v4()} />
          </li>
        ) : null}
        {scriptsOrActions.length < 32 ? (
          <li className={cx('add script', waves)} onClick={this.addScript.bind(this, sequence)}><i className='material-icons'>add</i>Add a script</li>
        ) : null}
      </ol>
    )
  }

  addAction (sequence, actionId) {
    sequence.push(actionId)
    this.forceUpdate()
  }

  renderAction (actionId) {
    if (this.state[`actionEditPanel-${actionId}`]) {
      const ActionEditForm = this.state[`actionEditPanel-${actionId}`].EditForm
      return (
        <ActionEditForm
          instance={this.state[`actionEditPanel-${actionId}`]} services={this.props.services}
          theme={this.props.theme} animationLevel={this.props.animationLevel} />
      )
    } else {
      this.scenariiService.getActionInstance(actionId, true)
      .then((action) => {
        this.setState({
          [`actionEditPanel-${actionId}`]: action
        })
      })
      return null
    }
  }

  isActionGlobal (actionId) {
    const action = this.state[`actionEditPanel-${actionId}`]
    if (action && action.parent === this.props.instance.instanceId) {
      return false
    }

    return true // by default if not fetched yet
  }

  isDeleteActionConfirmation (actionId, sequence, idx) {
    const e = this.state.deleteElementConfirm
    return (e && e.length === 3 && e[0] === actionId && e[1] === sequence && e[2] === idx)
  }

  deleteAction (sequence, idx, actionId) {
    if (!this.isDeleteActionConfirmation(actionId, sequence, idx)) {
      this._deleteConfirm([actionId, sequence, idx])
      return
    }

    this._deleteConfirm(null)
    sequence.splice(idx, 1) // removes 1 element from idx position
    this.forceUpdate()
  }

  globalizeAction (sequence, idx, action) {
    console.log('###', idx)
    // TODO !0: action "make it global" button in the corner... remove parent attr, save it to server side, refresh here.
  }

  addScript (sequence) {
    sequence.push({ 'a': [] })
    this.forceUpdate()
  }

  isDeleteScriptConfirmation (script, sequence, idx) {
    const e = this.state.deleteElementConfirm
    return (e && e.length === 3 && e[0] === script && e[1] === sequence && e[2] === idx)
  }

  deleteScript (sequence, idx, script) {
    if (!this.isDeleteScriptConfirmation(script, sequence, idx)) {
      this._deleteConfirm([script, sequence, idx])
      return
    }

    this._deleteConfirm(null)
    console.log('todo')
    // TODO !1: warning, cascading delete, make all in the right order...
  }

  addSequence (script) {
    // TODO !2
  }

  isDeleteSequenceConfirmation (sequenceKey, script, idx) {
    const e = this.state.deleteElementConfirm
    return (e && e.length === 3 && e[0] === sequenceKey && e[1] === script && e[2] === idx)
  }

  deleteSequence (script, idx, sequenceKey) {
    if (!this.isDeleteSequenceConfirmation(sequenceKey, script, idx)) {
      this._deleteConfirm([sequenceKey, script, idx])
      return
    }

    this._deleteConfirm(null)
    console.log('todo')
    // TODO !2: do the job: warning, cascading delete, make all in the right order...
  }

  reorderSequence () {
    // TODO !2
  }

  _deleteConfirm (element) {
    clearTimeout(this._deleteTimer)
    this.setState({
      deleteElementConfirm: element
    })
    if (element) {
      this._deleteTimer = setTimeout(() => {
        if (this._mounted) {
          this.setState({ deleteElementConfirm: null })
        }
      }, 3000)
    }
  }
}

BrowserProcedureEditForm.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  instance: PropTypes.object.isRequired,
  services: PropTypes.func.isRequired
}

BrowserProcedureEditForm.label = 'Basic procedure'

export default BrowserProcedureEditForm
