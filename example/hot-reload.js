'use strict'

require('babel-core/register')
require('colors')

const server = require('../lib').server

server.use(require('../lib/plugins/developer-tools'))

if (process.env.ASTERISM_PLUGINS) {
  process.env.ASTERISM_PLUGINS.split(',').forEach((plugin) => {
    try {
      server.use(require(`${plugin}`))
    } catch (error) {
      console.log(`The plugin ${plugin} cannot be found as dependency. Did you miss a npm link? Is this path existing?`.red)
    }
  })
}

server.start(8090, ['127.0.0.1', '0.0.0.0', '::1'], function () {
  console.log('Hot-reload mode Asterism listening on port 8090!'.cyan)
})
