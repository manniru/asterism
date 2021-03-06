'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Icon } from 'react-materialize'

import { thenSleep } from '../tools'

const categories = [
  {
    id: 'domotics',
    title: 'Domotics',
    icon: 'touch_app',
    condition: true,
    additionalItems: []
  },
  {
    id: 'security',
    title: 'Security & access',
    icon: 'notifications_active',
    condition: true,
    additionalItems: []
  },
  {
    id: 'screening',
    title: 'Screening & safety',
    icon: 'videocam',
    condition: true,
    additionalItems: []
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: 'question_answer',
    condition: true,
    additionalItems: []
  },
  {
    id: 'information',
    title: 'Information',
    icon: 'info',
    condition: true,
    additionalItems: []
  },
  {
    id: 'development',
    title: 'Dev tools',
    icon: 'bug_report',
    condition: (process.env.NODE_ENV !== 'production'),
    className: 'purple white-text',
    additionalItems: [
      {
        title: 'Debug log',
        isNew: true
      },
      {
        title: 'Other old thing'
      }
    ]
  }
]

class AddCategoryButtons extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      clazz: '',
      modal: null
    }
  }

  componentWillEnter (callback) {
    this.setState({
      clazz: 'scale-transition scale-out'
    })
    return callback()
  }

  componentDidEnter () {
    window.setTimeout(() => {
      this.setState({
        clazz: 'scale-transition scale-in'
      })
    }, 50)
  }

  componentWillLeave (callback) {
    this.setState({
      clazz: 'scale-transition scale-out'
    })
    return window.setTimeout(callback, 200)
  }

  componentDidUpdate () {
    const { animationLevel } = this.props
    if (this.state.modal) {
      const bullet = $('#category-modal-bullet')

      $('#category-modal').modal({
        dismissible: true,
        opacity: 0.5,
        inDuration: animationLevel >= 2 ? 300 : 0,
        outDuration: animationLevel >= 2 ? 300 : 0,
        startingTop: bullet.css('top'),
        endingTop: '10%',
        // ready: function(modal, trigger) { },
        complete: () => {
          this.setState({
            modal: null
          })
        }
      })

      if (this.props.animationLevel >= 3) {
        const screenHeight = $(window).height()
        const headerTop = (screenHeight * 0.1) + 24
        const bullet = $('#category-modal-bullet')
        const ripple = $('#category-modal .ripple')

        bullet.show({ queue: true }).css({ top: headerTop, left: '50%', transform: 'scale(1.8)' }).hide({ queue: true, duration: 0 })
        $('#category-modal').modal('open')

        $('.fixed-action-btn.vertical.active').closeFAB()
        ripple.addClass('rippleEffect')
      } else {
        $('#category-modal').modal('open')
        $('.fixed-action-btn.vertical.active').closeFAB()
      }
    }
  }

  categorySelect (category, event) {
    const buttonCoords = $(event.nativeEvent.target).offset()
    const bullet = $('#category-modal-bullet')
    bullet.css({ top: buttonCoords.top, left: buttonCoords.left, transform: 'scale(1)' })

    this.setState({
      modal: category
    })
  }

  additionalItemSelect (additionalItem, event) {
    const animationFlow = (this.props.animationLevel >= 3)
      ? this.additionalItemShrinkAnimation($(event.target).closest('a')[0].getBoundingClientRect())
      : null
    if (this.props.animationLevel < 3) {
      $('#category-modal').modal('close')
    }
    additionalItem.instantiateNewItem(this.props.itemManager.settingPanelClosed.bind(this.props.itemManager))
    .then(thenSleep(400)) // wait for modal to close
    .then((settingOrItem) => {
      if (settingOrItem.props && settingOrItem.props.settingPanelCallback) {
        // initial setting panel before to render the item
        this.props.itemManager.mainComponent.setState({ itemSettingPanel: settingOrItem, animationFlow })
      } else {
        // item can be added directly
        const { id, item, preferredHeight, preferredWidth, settingPanel } = settingOrItem
        this.props.itemManager.addNewItem(id, item, preferredHeight, preferredWidth, settingPanel, animationFlow)
      }
    })
  }

  additionalItemShrinkAnimation (rectBounds) {
    const rect = $('#additional-item-rect')
    const bullet = $('div', rect)
    return new Promise((resolve) => {
      rect.css({ top: rectBounds.top, left: rectBounds.left, height: rectBounds.height, width: rectBounds.width, display: 'block' })
      resolve()
    })
    .then(thenSleep(10))
    .then(() => {
      bullet.addClass('shrink')
      const editColor = this.props.theme.palette[this.props.theme.backgrounds.editing] || 'white'
      bullet.css({ 'background-color': editColor })
    })
    .then(thenSleep(40))
    .then(() => {
      $('#category-modal').modal('close')
      return { rect, bullet }
    })
  }

  render () {
    const { theme, animationLevel, itemFactories } = this.props
    const { modal, clazz } = this.state
    const waves = animationLevel >= 2 ? 'light' : undefined
    const modalCategory = modal ? categories.find((i) => i.id === modal) : null

    categories.forEach((category) => { category.additionalItems = [] }) // reset items
    itemFactories.forEach((factory) => {
      categories.forEach((category) => {
        category.additionalItems = category.additionalItems.concat(factory.getAdditionalItems(category.id))
      })
    })

    return (
      <div>
        {modal ? (
          <div id='category-modal' className={cx('modal modal-fixed-footer', theme.backgrounds.body)}>
            <div className='modal-content'>
              <div className={cx('coloring-header', { [modalCategory.className || theme.backgrounds.card]: animationLevel < 3 })}>
                {animationLevel >= 3 ? (<div className={cx('ripple', modalCategory.className || theme.backgrounds.card)} />) : null}
                <div className={animationLevel >= 3 && (modalCategory.className || theme.backgrounds.card).endsWith('white-text') ? 'white-text' : null}>
                  <h4>
                    <Icon small>{modalCategory.icon}</Icon>
                    {modalCategory.title}
                  </h4>
                </div>
              </div>
              <div className='collection additional-items-list'>
                {modalCategory.additionalItems.map((item, idx) => (
                  <a className={cx('collection-item avatar lighter-background', animationLevel >= 2 ? 'waves-effect waves-light-green' : null)} key={idx} href='#'
                    onClick={this.additionalItemSelect.bind(this, item)}>
                    <Icon className='circle'>{item.icon || modalCategory.icon}</Icon>
                    <span className='title truncate'>{item.name}</span>
                    <p className='truncate'>{item.description}</p>
                    { /* <div className='secondary-content'><Icon circle>insert_chart</Icon>When needed... To do.</div> */ }
                  </a>
                ))}
              </div>
            </div>
            <div className={cx('modal-footer', theme.backgrounds.body)}>
              <a href='#!' className={cx('modal-action modal-close btn-flat', animationLevel >= 2 ? 'waves-effect waves-light' : null)}>Close</a>
            </div>
          </div>
        ) : null}

        {animationLevel >= 3 ? (
          <div id='category-modal-bullet' className={cx('btn-floating', (modalCategory && modalCategory.className) || theme.backgrounds.card)} />
        ) : null}

        <Button large floating fab='vertical' icon='add_box' waves={waves} className={cx(theme.actions.edition, clazz)}>
          {Array.from(categories).reverse().map((value, idx) => (
            value.condition ? (
              <Button key={idx}
                floating icon={value.icon} waves={waves}
                className={cx(value.className || theme.actions.secondary, { pulse: value.additionalItems.find((i) => i.isNew) })}
                onClick={this.categorySelect.bind(this, value.id)}
              />
            ) : null
          ))}
        </Button>

        {animationLevel >= 3 ? (
          <div id='additional-item-rect'>
            <div>
              <Icon>timer</Icon>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

AddCategoryButtons.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  itemManager: PropTypes.object.isRequired,
  itemFactories: PropTypes.array
}

AddCategoryButtons.defaultTypes = {
  itemFactories: []
}

export default AddCategoryButtons
