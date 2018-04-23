'use strict'

import PropTypes from 'prop-types'
import React from 'react'
import { Row } from 'react-materialize'

class BrowserActionableScenarioEditForm extends React.Component {
  render () {
    return (
      <Row className='section card form'>
        TODO
      </Row>
    )
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
