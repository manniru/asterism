'use strict'

/* global $ */
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

class Resizer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: { w: 3, h: 2 }
    }
  }

  render () {
    const { selected } = this.state
    const backgroundColor = (w, h) => {
      if (w === selected.w && h === selected.h) {
        return { backgroundColor: 'rgba(0,0,0,.5)' }
      }
      if (w <= selected.w && h <= selected.h) {
        return { backgroundColor: 'rgba(0,0,0,.3)' }
      }
      return { }
    }
    return (
      <div className='card-panel resizer'>
        <table className='background'>
          {[1, 2, 3, 4, 5, 6].map((h) => (
            <tr key={`0-${h}`}>
              {[1, 2, 3, 4, 5, 6].map((w) => (
                <td key={`${w}-${h}`}><div style={backgroundColor(w, h)} /></td>
              ))}
            </tr>
          ))}
        </table>
        <table>
          {[1, 2, 3, 4, 5, 6].map((h) => (
            <tr key={`0-${h}`}>
              {[1, 2, 3, 4, 5, 6].map((w) => (
                <td key={`${w}-${h}`}>
                  <button
                    className={cx('btn btn-floating btn-small waves-effect waves-light', { disabled: !this.isSizeAvailable(w, h) })}
                    onClick={() => this.selectSize.bind(this, w, h)}
                  >
                    {w}-{h}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    )
  }

  isSizeAvailable (w, h) {
    return w + h === 3
    // TODO
  }

  selectSize (w, h) {
    if (!this.isSizeAvailable(w, h)) {
      return
    }
    // TODO
  }
}

Resizer.propTypes = {

}

export default Resizer
