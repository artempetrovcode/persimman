const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

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
  plugins: [
    new CopyPlugin([
      { 
        from: path.resolve(__dirname, 'public/favicon.ico'),
        to: path.resolve(__dirname, 'docs/favicon.ico'),
      },
    ]),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'docs/index.html'),
      template: path.resolve(__dirname, 'src/index.html'),
    })
  ],
};