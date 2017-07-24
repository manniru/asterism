'use strict'

import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Gridifier } from 'react-gridifier/dist/materialize'
import { Navbar, NavItem, Icon } from 'react-materialize'
import { TransitionGroup } from 'react-transition-group'

import AddCategoryButtons from './edition/add-category-buttons'
import defaultMaterialTheme from './default-material-theme'
import DefaultServerStorage from './default-server-storage'
import OrderHandler from './order-handler'
import Settings from './edition/settings'

import 'react-gridifier/dist/styles.css'
import './styles.css'

class MainComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false,
      animationLevel: parseInt(props.localStorage.getItem('settings-animation-level') || 3), // 1..3
      addItems: { // TODO !3: async loading... only when state.editMode turns ON
        domotics: [],
        security: [],
        screening: [],
        communication: [],
        information: [],
        development: [
          {
            title: 'Debug log',
            isNew: true
          },
          {
            title: 'Other old thing'
          }
        ]
      }
    }

    this.orderHandler = new OrderHandler(props.localStorage, 'order-handler', props.serverStorage.getItem('order-handler'))
  }

  render () {
    const { theme, localStorage, serverStorage } = this.props
    const { editMode, animationLevel, addItems } = this.state
    return (
      <div className={cx('asterism', theme.backgrounds.body)}>
        <Navbar fixed brand='&nbsp;&nbsp;⁂&nbsp;&nbsp;' href={null} right
          options={{ closeOnClick: true }}
          className={cx({ [theme.backgrounds.card]: !editMode, [theme.backgrounds.editing]: editMode })}
        >
          {editMode ? (
            <NavItem href='#settings-modal'>
              <Icon>settings</Icon>
              <span className='hide-on-large-only'>Settings</span>
            </NavItem>
          ) : null}
          <NavItem onClick={this.toggleEditMode.bind(this)}>
            <Icon>edit</Icon>
            <span className='hide-on-large-only'>{editMode ? 'End edition' : 'Edit mode'}</span>
          </NavItem>
        </Navbar>

        <Gridifier editable={editMode} sortDispersion orderHandler={this.orderHandler} />

        {animationLevel >= 3 ? (
          <TransitionGroup>
            {editMode ? (<AddCategoryButtons animationLevel={animationLevel} theme={theme} items={addItems} />) : null}
          </TransitionGroup>
        ) : (editMode ? (<AddCategoryButtons animationLevel={animationLevel} theme={theme} items={addItems} />) : null)}

        {editMode ? (
          <Settings animationLevel={animationLevel} localStorage={localStorage} serverStorage={serverStorage}
            orderHandler={this.orderHandler} theme={theme} />
        ) : null}
      </div>
    )
  }

  toggleEditMode () {
    this.setState({ editMode: !this.state.editMode })
  }
}

MainComponent.propTypes = {
  theme: PropTypes.object.isRequired,
  localStorage: PropTypes.object.isRequired,
  serverStorage: PropTypes.object.isRequired
}

MainComponent.defaultProps = {
  theme: defaultMaterialTheme,
  localStorage: window.localStorage, // TODO !2: put a middleware to encapsulate window.localStorage...
  // TODO ... (to have one default asterism object instead of multiple keys, and to separate plugins data)
  serverStorage: new DefaultServerStorage('asterism')
}

export default MainComponent

export { MainComponent }
