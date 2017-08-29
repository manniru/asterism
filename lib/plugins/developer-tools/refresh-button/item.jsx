'use strict'

import cx from 'classnames'
import React from 'react'
import { Button, Icon } from 'react-materialize'

import Item from '../../item'

class RefreshButtonItem extends Item {
  render () {
    const { theme } = this.props.context
    const { title = 'Refresh' } = this.state.params
    return (
      <Button waves='light' className={cx(theme.actions.edition, 'truncate fluid')} flat onClick={this.click.bind(this)}>
        {title}<Icon left>refresh</Icon>
      </Button>
    )
  }

  click () {
    window.location.reload()
  }
}

export default RefreshButtonItem
