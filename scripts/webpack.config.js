const webpack = require('webpack');
const path = require('path');
const fs = require('fs-extra');

// This config is used to bundle together the output of the internal and external javascript libs into a single file
module.exports = (env) => {
  let config = {
    context: path.resolve(__dirname),
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js']
    },
    entry: `./bundle-platform-and-external.js`,
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/dist/',
      libraryTarget: 'window',
      filename: 'tableau.extensions.latest.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
        }
      ]
    },
    externals: {
      '@tableau/preslayer-api-contract': 'PresLayerAPIContract'
    }
  };

  return config;
}
