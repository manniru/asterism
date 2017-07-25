'use strict'

/*global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Icon } from 'react-materialize'

const categories = [
  {
    id: 'domotics',
    title: 'Domotics',
    icon: 'touch_app',
    condition: true
  },
  {
    id: 'security',
    title: 'Security & access',
    icon: 'notifications_active',
    condition: true
  },
  {
    id: 'screening',
    title: 'Screening & safety',
    icon: 'videocam',
    condition: true
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: 'question_answer',
    condition: true
  },
  {
    id: 'information',
    title: 'Information',
    icon: 'info',
    condition: true
  },
  {
    id: 'development',
    title: 'Dev tools',
    icon: 'bug_report',
    condition: (process.env.NODE_ENV !== 'production'),
    className: 'purple'
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

  render () {
    const { theme, animationLevel, items } = this.props
    const { modal } = this.state
    const waves = animationLevel >= 2 ? 'light' : undefined
    const modalCategory = modal ? categories.find((i) => i.id === modal) : null
    const modalItems = items[modal] || []
    return (
      <div>
        {modal ? (
          <div id='category-modal' className={cx('modal modal-fixed-footer', theme.backgrounds.body)}>
            <div className='modal-content'>
              <div className={cx('coloring-header', { [modalCategory.className || theme.backgrounds.card]: animationLevel < 3 })}>
                {animationLevel >= 3 ? (<div className={cx('ripple', modalCategory.className || theme.backgrounds.card)} />) : null}
                <div>
                  <h4>
                    <Icon small>{modalCategory.icon}</Icon>
                    {modalCategory.title}
                  </h4>
                </div>
              </div>
              <ul>
                {modalItems.map((item, idx) => (
                  <li key={idx}>{item.title}</li>
                ))}
              </ul>
            </div>
            <div className={cx('modal-footer', theme.backgrounds.body)}>
              <a href='#!' className='modal-action modal-close waves-effect waves-light btn-flat'>Close</a>
            </div>
          </div>
        ) : null}

        {animationLevel >= 3 ? (
          <div id='category-modal-bullet' className={cx('btn-floating', (modalCategory && modalCategory.className) || theme.backgrounds.card)} />
        ) : null}

        <Button large floating fab='vertical' icon='add_box' waves={waves} className={cx(theme.actions.edition, this.state.clazz)}>
          {Array.from(categories).reverse().map((value, idx) => (
            value.condition ? (
              <Button key={idx}
                floating icon={value.icon} waves={waves}
                className={cx(value.className || theme.actions.secondary, { pulse: items[value.id].find((i) => i.isNew) })}
                onClick={this.categorySelect.bind(this, value.id)}
              />
            ) : null
          ))}
        </Button>
      </div>
    )
  }
}

AddCategoryButtons.propTypes = {
  theme: PropTypes.object.isRequired,
  animationLevel: PropTypes.number.isRequired,
  items: PropTypes.object
}

AddCategoryButtons.defaultTypes = {
  items: {}
}

export default AddCategoryButtons