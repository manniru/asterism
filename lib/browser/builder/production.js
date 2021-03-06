'use strict'

/* global process, JSON */
import BabiliPlugin from 'babili-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import Path from 'path'
import webpack from 'webpack'

const isDist = Path.basename(Path.dirname(Path.dirname(__dirname))) === 'dist'

const entriesMain = isDist
  ? [
    Path.join(__dirname, 'bootstrap.js'),
    Path.join(__dirname, '..', '..', 'styles/asterism.css'),
    Path.join(__dirname, '..', '..', 'styles/styles.css'),
    'asterism-plugin-library/dist/styles.css'
  ]
  : [
    Path.join(__dirname, 'bootstrap.jsx'),
    Path.join(__dirname, '..', 'asterism.css'),
    Path.join(__dirname, '..', 'styles.css'),
    'react-gridifier/dist/styles.css',
    'asterism-plugin-library/dist/styles.css'
  ]

const options = (server) => {
  const exposeRules = []
  const entriesPlugins = []

  for (var service of server.browserServices) {
    entriesPlugins.push(service.service)
    exposeRules.push({
      test: service.service,
      use: [{
        loader: 'expose-loader',
        options: `plugins.services.${service.service}`
      }]
    })
  }

  for (var panel of server.browserSettingsPanels) {
    entriesPlugins.push(panel.module)
    exposeRules.push({
      test: panel.module,
      use: [{
        loader: 'expose-loader',
        options: `plugins.settingsPanels.${panel.module}`
      }]
    })
  }

  for (var editPanel of server.browserEditPanels) {
    entriesPlugins.push(editPanel.module)
    exposeRules.push({
      test: editPanel.module,
      use: [{
        loader: 'expose-loader',
        options: `plugins.editPanels.${editPanel.module}`
      }]
    })
  }

  for (var factory of server.browserItemFactories) {
    entriesPlugins.push(factory.module)
    exposeRules.push({
      test: factory.module,
      use: [{
        loader: 'expose-loader',
        options: `plugins.itemFactories.${factory.module}`
      }]
    })
  }

  for (var styles of server.browserStyles) {
    entriesMain.push(styles)
  }

  const entries = { bundle: entriesMain }
  if (entriesPlugins.length > 0) {
    entries.plugins = entriesPlugins
  }

  return {
    entry: entries,
    output: {
      path: Path.resolve('.', 'var', 'build'),
      filename: '[name].js',
      publicPath: '/build'
    },
    module: {
      rules: [
        ...exposeRules,
        isDist ? {} : {
          test: /\.jsx?$/,
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.(sass|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          use: [
            'file-loader?name=images/[name].[ext]'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader?name=fonts/[name].[ext]'
          ]
        }
      ]
    },
    resolve: {
      alias: {
        'joi': 'joi-browser',
        'react': Path.join(process.cwd(), 'node_modules', 'react') // to avoid multiple copies of react imported
      },
      extensions: ['.js', '.jsx', '.json', 'scss'],
      modules: ['node_modules', Path.resolve(process.cwd(), '..')]
    },
    plugins: [
      new ExtractTextPlugin('styles.css'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.ASTERISM_SETTINGS_PANELS': JSON.stringify(server.browserSettingsPanels),
        'process.env.ASTERISM_SERVICES': JSON.stringify(server.browserServices),
        'process.env.ASTERISM_EDIT_PANELS': JSON.stringify(server.browserEditPanels),
        'process.env.ASTERISM_ITEM_FACTORIES': JSON.stringify(server.browserItemFactories)
      }),
      new BabiliPlugin({}, {
        comments: false
      }),
      // new webpack.NamedModulesPlugin(), // causes plugins to crash in production mode...
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: 2
      })
    ]
  }
}

export default options
