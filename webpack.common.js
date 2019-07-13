const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['whatwg-fetch', path.resolve(__dirname, 'src', 'index.js')],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'docs'),
  },
  plugins: [new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'docs/index.html'),
      template: path.resolve(__dirname, 'src/index.html'),
  })]
};