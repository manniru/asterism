'use strict'

const manifest = {
  name: 'Developer-tools',
  version: '0.0.1',
  privateSocket: true,
  server: {
    publicSockets: [
      // TODO !0: here, declare sockets that will be auto mounted and injected into server contexts.
    ],
    middlewares: (context) => [
      `asterism/${process.env.NODE_ENV === 'production' ? 'dist' : 'lib'}/plugins/developer-tools/socket-logger/middleware`
    ]
  },
  browser: {
    publicSockets: [
      // TODO !0: here, declare sockets that will be auto mounted and injected into browser contexts.
    ],
    itemFactory: `asterism/${process.env.NODE_ENV === 'production' ? 'dist' : 'lib'}/plugins/developer-tools/item-factory`,
    settingsPanel: `asterism/${process.env.NODE_ENV === 'production' ? 'dist' : 'lib'}/plugins/developer-tools/settings`
  }
}

export default manifest
