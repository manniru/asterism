'use strict'

const manifest = {
  name: 'Developer-tools',
  version: '0.0.1',
  private_socket: true,
  server: {
    public_sockets: [
      // TODO !1: here, declare sockets that will be auto mounted and injected into server contexts.
    ],
    middlewares: (context) => [

    ]
  },
  browser: {
    public_sockets: [
      // TODO !1: here, declare sockets that will be auto mounted and injected into browser contexts.
    ],
    itemFactory: `asterism/${process.env.NODE_ENV === 'production' ? 'dist' : 'lib'}/plugins/developer-tools/item-factory`,
    settingsPanel: `asterism/${process.env.NODE_ENV === 'production' ? 'dist' : 'lib'}/plugins/developer-tools/settings`
  }
}

export default manifest
