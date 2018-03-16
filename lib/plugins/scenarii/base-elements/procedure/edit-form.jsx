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
    const { deleteElementConfirm } = this.state
    const waves = this.props.animationLevel >= 2 ? 'waves-effect waves-light' : undefined
    const deleteWaves = this.props.animationLevel >= 2 ? 'btn-flat waves-effect waves-red' : 'btn-flat'
    const deleteWavesConfirm = (this.props.animationLevel >= 2 ? 'btn waves-effect waves-light' : 'btn') + ` ${this.props.theme.actions.negative}`

    const sequences = Object.entries(script).map(([sequenceKey, sequence]) => this.renderSequence(sequence, sequenceKey))
    return (
      <ul>
        {sequences.map((sequence, idx) => (
          <li key={uuid.v4()}>
            <div className={cx('remove sequence', (deleteElementConfirm === sequence) ? deleteWavesConfirm : deleteWaves)}
              onClick={this.deleteSequence.bind(this, script, idx, sequence)}>
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
    const { deleteElementConfirm } = this.state
    const waves = this.props.animationLevel >= 2 ? 'waves-effect waves-light' : undefined
    const deleteWaves = this.props.animationLevel >= 2 ? 'btn-flat waves-effect waves-red' : 'btn-flat'
    const deleteWavesConfirm = (this.props.animationLevel >= 2 ? 'btn waves-effect waves-light' : 'btn') + ` ${this.props.theme.actions.negative}`

    const scriptsOrActions = sequence.map((e, idx) => (typeof e !== 'string')
      ? [
        this.renderScript(e),
        <div className={cx('removeAction', (deleteElementConfirm === e) ? deleteWavesConfirm : deleteWaves)}
          onClick={this.deleteScript.bind(this, sequence, idx, e)}><i className='material-icons'>delete</i></div>,
        <div className='globalizeAction'><i className='material-icons'>public</i> TODO</div>
      ] : [
        this.renderAction(e),
        <div className={cx('removeAction', (deleteElementConfirm === e) ? deleteWavesConfirm : deleteWaves)}
          onClick={this.deleteAction.bind(this, sequence, idx, e)}><i className='material-icons'>delete</i></div>,
        <div className='globalizeAction'><i className='material-icons'>public</i> TODO</div>
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
              icon={null} label='Add a script' dropdownId={uuid.v4()} />
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

  deleteAction (sequence, idx, action) {
    const e = this.state.deleteElementConfirm
    if (!e || e.length !== 3 || e[0] !== action || e[1] !== sequence || e[2] !== idx) {
      this.setState({
        deleteElementConfirm: [action, sequence, idx]
      })
      return
    }

    sequence.splice(idx, 1) // removes 1 element from idx position
    this.forceUpdate()
  }

  // TODO !0: "make it global" button in the corner...

  addScript (sequence) {
    // TODO !1
  }

  deleteScript (sequence, idx, script) {
    const e = this.state.deleteElementConfirm
    if (!e || e.length !== 3 || e[0] !== script || e[1] !== sequence || e[2] !== idx) {
      this.setState({
        deleteElementConfirm: [script, sequence, idx]
      })
      return
    }

    console.log('todo')
    // TODO !1: warning, cascading delete, make all in the right order...
  }

  addSequence (script) {
    // TODO !2
  }

  deleteSequence (script, idx, sequence) {
    const e = this.state.deleteElementConfirm
    if (!e || e.length !== 3 || e[0] !== sequence || e[1] !== script || e[2] !== idx) {
      this.setState({
        deleteElementConfirm: [sequence, script, idx]
      })
      return
    }

    console.log('todo')
    // TODO !2: do the job: warning, cascading delete, make all in the right order...
  }

  reorderSequence () {
    // TODO !2
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
