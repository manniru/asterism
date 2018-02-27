'use strict'

import PropTypes from 'prop-types'
import React from 'react'
import { Row } from 'react-materialize'

class BrowserLevelStateEditForm extends React.Component {
  render () {
    // const { instance } = this.props

    return (
      <Row>
        TODO !0
      </Row>
    )
  }
}

BrowserLevelStateEditForm.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  instance: PropTypes.object.isRequired,
  services: PropTypes.func.isRequired
}

BrowserLevelStateEditForm.label = 'Level state'

export default BrowserLevelStateEditForm
