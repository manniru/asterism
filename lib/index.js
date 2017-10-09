'use strict'

import browser from './browser'
import server from './server'

server.on('start', browser.pack.bind(browser, server))

export { server as server } // eslint-disable-line no-useless-rename

export { default as AdditionalItem } from './plugins/additional-item'
export { default as Item } from './plugins/item'
export { default as ItemFactoryBuilder } from './plugins/item-factory-builder'
export { default as ItemSettingPanel } from './plugins/item-setting-panel'
