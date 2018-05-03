'use strict'

import PropTypes from 'prop-types'
import React from 'react'
import { Row } from 'react-materialize'
import uuid from 'uuid'
import { Scenarii } from 'asterism-plugin-library'

const { ActionsDropdown, TriggersDropdown, ConditionsDropdown } = Scenarii

class BrowserActionableScenarioEditForm extends React.Component {
  constructor (props) {
    super(props)

    this.scenariiService = props.services()['asterism-scenarii']
  }

  render () {
    const { theme, animationLevel, instance, services } = this.props
    const { action, executionTrigger, executionCondition } = instance.data

    return (
      <div>
        <Row className='section card form'>
          // TODO !0: Name field! Manual and free one, but if void, then automate it :)
        </Row>
        <Row className='section card form'>
          <h5>When:</h5>
          <TriggersDropdown onChange={this.setTrigger.bind(this)} theme={theme} animationLevel={animationLevel}
            services={services} noCreationPanel defaultTriggerId={executionTrigger}
            typeFilter={() => false} icon={null} label='Set a trigger' dropdownId={uuid.v4()} />
          <h5>With additional condition:</h5>
          <ConditionsDropdown onChange={this.setCondition.bind(this)} theme={theme} animationLevel={animationLevel}
            services={services} noCreationPanel defaultConditionId={executionCondition}
            typeFilter={() => false} icon={null} label='Set additional condition' dropdownId={uuid.v4()} />
        </Row>
        <Row className='section card form'>
          <h5>Then:</h5>
          <ActionsDropdown onChange={this.setAction.bind(this)} theme={theme} animationLevel={animationLevel}
            services={services} noCreationPanel defaultActionId={action}
            typeFilter={() => false} icon={null} label='Set an action' dropdownId={uuid.v4()} />
        </Row>

        <Row className='section card form'>
          TODO !1: 1 bloc affiché si non vide ou si cliqué expanded: trigger d'abort
        </Row>
      </div>
    )
  }

  setAction (actionId) {
    this.props.instance.data.action = actionId
    this.nameChange()
  }

  setTrigger (triggerId) {
    // TODO !2
  }

  setCondition (conditionId) {
    // TODO !2
  }

  nameChange () {
    if (this.props.instance.data.name && this.props.instance.data.name !== '') {
      return
    }

    // TODO !0: automate it ?
    this.props.instance.data.name = 'TODO'
  }
}

BrowserActionableScenarioEditForm.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  instance: PropTypes.object.isRequired,
  services: PropTypes.func.isRequired
}

BrowserActionableScenarioEditForm.label = 'Actionable scenario'

export default BrowserActionableScenarioEditForm
