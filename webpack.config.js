const pkg = require('./package.json');
const Webpack = require('webpack');
const Path = require('path');

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    vconsole: Path.resolve(__dirname, './src/index.js')
  },
  output: {
    path: Path.resolve(__dirname, './dist'),
    filename: 'index.js',
    library: 'VConsoleAtzucheEnv',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }
    ]
  },
  stats: {
    colors: true
  }
};
