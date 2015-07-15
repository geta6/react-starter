'use strict';

const webpack = require('webpack');
const RELEASE = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './config/client.js',
  debug: !RELEASE,
  cache: !RELEASE,
  devtool: RELEASE ? 'source-map' : 'inline-source-map',
  keepalive: true,
  output: {
    publicPath: './',
    sourcePrefix: '  ',
    filename: 'bundle.js'
  },
  stats: {
    hash: false,
    version: true,
    timings: false,
    assets: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    cached: true,
    reasons: true,
    source: false,
    errorDetails: true,
    chunkOrigins: false,
    modulesSort: false,
    chunksSort: false,
    assetsSort: false,
    colors: true
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/),
    new webpack.optimize.OccurenceOrderPlugin()
  ].concat(RELEASE ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({output: {comments: false}}),
    new webpack.optimize.AggressiveMergingPlugin()
  ] : []),
  resolve: {
    extensions: ['', '.js', '.json']
  },
  externals: RELEASE ? {} : {
    react: 'React',
    'react/addons': 'React',
    lodash: '_'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {stage: 0}}
    ]
  }
};
