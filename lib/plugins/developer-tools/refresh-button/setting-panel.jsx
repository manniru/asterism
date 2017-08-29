'use strict'

import React from 'react'
import { Button, Input, Row } from 'react-materialize'

import ItemSettingPanel from '../../item-setting-panel'
import RefreshButtonItem from './item'

class RefreshButtonSettingPanel extends ItemSettingPanel {
  render () {
    return (
      <div className='clearing padded'>
        <Row className='padded card'>
          <Input placeholder='Refresh' s={12} label='Label' />
        </Row>
        <Button waves='light' className='right' onClick={this.save.bind(this, RefreshButtonItem)}>
          Save &amp; close
        </Button>
      </div>
    )
  }

  save () {
    const params = { ...this.state.params, title: 'todo' } // TODO !0: store title into params
    this.setState({ params })
    this.next(RefreshButtonItem)
  }
}

export default RefreshButtonSettingPanel
