'use strict'

import PropTypes from 'prop-types'
import React from 'react'
import { Input, Row } from 'react-materialize'

class BrowserProcedureEditForm extends React.Component {
  render () {
    const { instance } = this.props
    // TODO !2: form to do
    return (
      <Row>
        <Input placeholder='Give a name to quickly identify your action' s={12} label='Name'
          defaultValue={instance.data.name} onChange={(e) => { instance.data.name = e.currentTarget.value }} />
      </Row>
    )
  }
}

BrowserProcedureEditForm.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  instance: PropTypes.object.isRequired,
  scenariiService: PropTypes.object.isRequired
}

export default BrowserProcedureEditForm
