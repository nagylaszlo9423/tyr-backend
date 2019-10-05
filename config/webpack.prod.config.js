const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const relativePath = require('./relative-path');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: relativePath('dist'),
    filename: './[name].[chunkhash].bundle.js',
    sourceMapFilename: './[name].[chunkhash].map',
    chunkFilename: './[id].[chunkhash].chunk.js'
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        beautify: false,
        mangle: false,
        compress: {},
        comments: false
      }
    })]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
});
