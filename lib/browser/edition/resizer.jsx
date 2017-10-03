'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { Modal } from 'react-materialize'

class Resizer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: { w: 3, h: 2 }
    }
  }

  componentDidMount () {
    const theme = this.props.mainComponent.props.theme
    $('.modal[id^="resizer-"]').addClass(theme.backgrounds.body)
  }

  render () {
    const { itemId } = this.props
    const { selected } = this.state

    const backgroundColor = (w, h) => {
      if (w === selected.w && h === selected.h) {
        return { backgroundColor: 'rgba(0,0,0,.4)' }
      }
      if (w <= selected.w && h <= selected.h) {
        return { backgroundColor: 'rgba(0,0,0,.2)' }
      }
      return { }
    }

    // TODO !0: animationLevel adaptations
    return (
      <Modal id={`resizer-${itemId.substr(-36)}`} header='Change size'>
        <div className='resizer'>
          <table className='background'>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((h) => (
                <tr key={`0-${h}`}>
                  {[1, 2, 3, 4, 5, 6].map((w) => (
                    <td key={`${w}-${h}`}><div style={backgroundColor(w, h)} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((h) => (
                <tr key={`0-${h}`}>
                  {[1, 2, 3, 4, 5, 6].map((w) => (
                    <td key={`${w}-${h}`}>
                      <button
                        className={cx('btn btn-floating btn-small waves-effect waves-light', { disabled: !this.isDimensionAvailable(w, h) })}
                        onClick={this.selectSize.bind(this, w, h)}
                      >
                        {w}-{h}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    )
  }

  isDimensionAvailable (w, h) {
    const search = this.props.acceptedDimensions.find((dimension) => dimension.w === w && dimension.h === h)
    return !!search
  }

  selectSize (w, h) {
    if (!this.isDimensionAvailable(w, h)) {
      return
    }

    const item = this.props.mainComponent.state.items.find((i) => i.props.id === this.props.itemId)
    console.log(item, 'ici')
    // TODO !0: affect new dim to item and save it. OR replace item... how to do ?
  }
}

Resizer.propTypes = {
  itemId: PropTypes.string.isRequired,
  mainComponent: PropTypes.object.isRequired,
  acceptedDimensions: PropTypes.array.isRequired
}

export default Resizer
