'use strict'

import React from 'react'
import { render as renderIntoDom } from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import MainComponent from '../main-component'

const render = (Component) => {
  renderIntoDom(<AppContainer><Component /></AppContainer>, document.getElementById('app'))
}

render(MainComponent)

if (module.hot) {
  module.hot.accept('../main-component', () => {
    const NextMainComponent = require('../main-component').MainComponent
    render(NextMainComponent)
  })
}
