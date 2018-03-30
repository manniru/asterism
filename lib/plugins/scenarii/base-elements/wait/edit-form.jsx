'use strict'

/* global $, noUiSlider, wNumb */
import PropTypes from 'prop-types'
import React from 'react'
import { Input, Row } from 'react-materialize'
import uuid from 'uuid'

class BrowserWaitEditForm extends React.Component {
  constructor (props) {
    super(props)
    this.scenariiService = props.services()['asterism-scenarii']

    this.state = {
      waitMode: props.instance.data.waitMode || 'amount'
    }
  }

  componentDidMount (prevProps, prevState) {
    this.fixmeReactMaterialize()
    this.plugWidgets()
  }

  componentDidUpdate (prevProps, prevState) {
    this.fixmeReactMaterialize()
    this.plugWidgets()
  }

  plugWidgets () {
    const domSlider = $(`#amount-slider-${this.props.instance.instanceId}`)[0]
    if (!this._slider || !domSlider.noUiSlider) {
      this._slider = noUiSlider.create(domSlider, {
        start: this.props.instance.data.amount || 1,
        connect: true,
        step: 1,
        animate: true,
        range: {
          'min': [1],
          '15%': [5, 5],
          '35%': [30, 10],
          '46%': [60, 15],
          '52%': [90, 30],
          '70%': [240, 60],
          '75%': [300, 50],
          'max': [600]
        },
        format: wNumb({
          decimals: 1
        }),
        pips: { // Show a scale with the slider
          mode: 'steps',
          stepped: true,
          density: 4
        },
        tooltips: wNumb({ decimals: 1, edit: (v) => `${v}`.split('.')[0] }), // decimals: 0 does not work...
        behaviour: 'tap-drag',
        orientation: 'horizontal'
      })

      // FIXME: this._slider.noUiSlider.on('change', this.changeAmount.bind(this))
    } else {
      /* this._slider.noUiSlider.set({
        start: this.props.instance.data.amount
      }) */
      console.log('#####2')
      // TODO !0: update existing slider case, from this.props.instance.data.amount
    }
  }

  fixmeReactMaterialize () {
    // FIXME: replace by <Input name='xxx' type='time' /> from react-materialize when it will work...
    $('.timepicker').pickatime({
      twelvehour: false,
      autoclose: true
    })
  }

  render () {
    const { waitMode } = this.state
    const { instance } = this.props
    const timePickerId = uuid.v4()
    return (
      <Row className='section card form waitPanel'>
        <Input s={12} name='waitMode' type='radio' value='amount' label='Wait a lapse of time' onChange={this.changeWaitMode.bind(this)} checked={waitMode === 'amount'} />
        <Input s={12} name='waitMode' type='radio' value='until' label='Wait until a specific moment' onChange={this.changeWaitMode.bind(this)} checked={waitMode === 'until'} />
        <Input s={12} name='waitMode' type='radio' value='untilQuarter' label='Wait until next round quarter' onChange={this.changeWaitMode.bind(this)} checked={waitMode === 'untilQuarter'} />
        <hr className='col s12' />

        {waitMode === 'amount' && [
          <Input key={1} s={12} m={12} l={2} label='Unit' type='select' icon='timelapse' onChange={this.changeAmountUnit.bind(this)}
            defaultValue={instance.data.amountUnit}>
            <option key='seconds' value='seconds'>seconds</option>
            <option key='minutes' value='minutes'>minutes</option>
            <option key='hours' value='hours'>hours</option>
          </Input>,
          <div key={2} className='col s12 m12 l10 slider'>
            <div id={`amount-slider-${instance.instanceId}`} />
          </div>
        ]}

        {waitMode === 'until' && [
          <div key={1} className='input-field col s12 m5 l4'>
            <input id={timePickerId} type='text' className='timepicker' onChange={this.changeUntil.bind(this)} />
            <label htmlFor={timePickerId}>Time</label>
          </div>,
          <Input key={1} s={12} m={7} l={8} label='occurrence' type='select' icon='delete' onChange={this.changeUntilOccurrence.bind(this)}
            defaultValue={instance.data.amountUnit}>
            <option key='first' value='first'>at first occurrence of this moment</option>
            <option key='tomorrow' value='tomorrow'>tomorrow</option>
          </Input>,
          <div key={2} className='input-field col s12 m7 l8'>
            TODO !1: timepicker (hr & min), then sub selector for ''|'tomorrow'
          </div>
        ]}

        {waitMode === 'untilQuarter' && (
          <div className='input-field col s12'>
            TODO !1: selector for 'Xhr00'|'Xhr15'|'Xhr30'|'Xhr45'
          </div>
        )}
      </Row>
    )
  }

  changeWaitMode (wtf) {
    console.log('#######4', wtf)
    // TODO !0: change instance and state
    this.nameChange()
  }

  changeAmountUnit (event) {
    console.log('#######3', event.currentTarget.value)
    // TODO !0: change instance
    this.nameChange()
  }

  changeAmount (a, b) {
    console.log(a, b, '########')
    // TODO !0
    this.nameChange()
  }

  changeUntil (wtf) {
    console.log('#######5', wtf)
    // TODO !0: change instance
    this.nameChange()
  }

  changeUntilOccurrence (event) {
    console.log('#######6', event.currentTarget.value)
    // TODO !0: change instance
    this.nameChange()
  }

  nameChange () {
    // TODO !1
  }
}

BrowserWaitEditForm.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  instance: PropTypes.object.isRequired,
  services: PropTypes.func.isRequired
}

BrowserWaitEditForm.label = 'Wait timer'

export default BrowserWaitEditForm
