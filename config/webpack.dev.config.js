const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const webpack = require('webpack');
const relativePath = require('./relative-path');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(common, {
  entry: ['webpack/hot/poll?100'],
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/])
  ]
});
