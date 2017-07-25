'use strict'

import PropTypes from 'prop-types'
import React from 'react'
import { Button, Icon } from 'react-materialize'

class SettingsDisplay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='carousel-item' href='#display!'>
        <h2>Components display</h2>

        <div className='section left-align'>
          <h5>Components ordering</h5>
          <p>
            You can save your current components ordering into server, to backup and/or to let your other devices use it.
          </p>
          <Button waves='light' onClick={this.saveOrder.bind(this)}>
            <Icon left>devices</Icon>
            <Icon left>keyboard_arrow_right</Icon>
            <Icon left>storage</Icon>
            &nbsp; <span className='hide-on-med-and-down'>Save current to server</span><span className='hide-on-large-only'>Save</span>
          </Button> &nbsp;
          <Button waves='light' onClick={this.restoreOrder.bind(this)}>
            <Icon left>storage</Icon>
            <Icon left>keyboard_arrow_right</Icon>
            <Icon left>devices</Icon>
            &nbsp; <span className='hide-on-med-and-down'>Restore from server</span><span className='hide-on-large-only'>Restore</span>
          </Button>
        </div>

        TODO !5: use gridifier background colors option ?;
        <button onClick={this.props.showRefreshButton} className='waves-effect waves-light btn-flat'>Test</button>
      </div>
    )
  }

  saveOrder () {
    const order = this.props.orderHandler.getLocalOrder()
    this.props.serverStorage.setItem('order-handler', order)
  }

  restoreOrder () {
    const order = this.props.serverStorage.getItem('order-handler')
    this.props.orderHandler.setLocalOrder(order)
    this.props.orderHandler.restoreOrder()
  }
}

SettingsDisplay.propTypes = {
  theme: PropTypes.object.isRequired,
  orderHandler: PropTypes.object.isRequired,
  serverStorage: PropTypes.object.isRequired,
  showRefreshButton: PropTypes.func.isRequired
}

export default SettingsDisplay