'use strict'

import BabiliPlugin from 'babili-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import Path from 'path'
import webpack from 'webpack'

const isDist = Path.basename(Path.dirname(Path.dirname(__dirname))) === 'dist'

const entries = isDist
  ? [
    Path.join(__dirname, 'bootstrap.js'),
    Path.join(__dirname, '..', '..', 'styles.css')
  ]
  : [
    Path.join(__dirname, 'bootstrap.jsx'),
    Path.join(__dirname, '..', 'styles.css'),
    'react-gridifier/dist/styles.css'
  ]

const options = (server) => {
  const exposeRules = []
  for (var panel of server.browserSettingsPanels) {
    entries.push(panel)
    exposeRules.push({
      test: new RegExp(panel), // FIXME !0: maybe more restrictive! (anchors, etc...)
      use: [{
        loader: 'expose-loader',
        options: `plugins.settingsPanels.${panel}`
      }]
    })
  }

  return {
    entry: entries,
    output: {
      path: Path.resolve('.', 'var', 'build'),
      filename: 'bundle.js',
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
      extensions: ['.js', '.jsx', '.json'],
      modules: ['node_modules', Path.resolve(process.cwd(), '..')]
    },
    plugins: [
      new ExtractTextPlugin('styles.css'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.SERVER': server.test,
        'process.env.ASTERISM_SETTINGS_PANELS': JSON.stringify(server.browserSettingsPanels)
      }),
      new BabiliPlugin({}, {
        comments: false
      })
    ]
  }
}

export default options
