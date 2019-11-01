const relativePath = require('./relative-path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry: [relativePath('src/main.ts')],
  target: 'node',
  output: {
    path: relativePath('dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader?configFile=tsconfig.build.json',
        exclude: [
          /node_modules/,
          /\.spec\.(ts|tsx)?$/,
          /\.e2e-spec\.(ts|tsx)?$/
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new CleanWebpackPlugin()
  ]
};
