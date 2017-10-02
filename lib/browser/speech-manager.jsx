'use strict'

export default class SpeechManager {
  constructor () {
    // TODO !0: if no speech, show an icon
    if (!('webkitSpeechRecognition' in window)) {
      alert('Pas de speech !')
    } else {
      alert('Speech OK')
    }
  }
}
