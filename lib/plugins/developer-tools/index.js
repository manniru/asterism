'use strict'

const manifest = {
  name: 'Developer-tools',
  version: '0.0.1',
  server: {
    middlewares: (context) => [

    ]
  },
  browser: {
    components: [

    ],
    settingsPanel: `asterism/${process.env.NODE_ENV === 'production' ? 'dist' : 'lib'}/plugins/developer-tools/settings`
  }
}

export default manifest
