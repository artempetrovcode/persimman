const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { 
        from: path.resolve(__dirname, 'public/favicon.ico'),
        to: path.resolve(__dirname, 'docs/favicon.ico'),
      },
    ]),
    ...(['index'].map(route => {
      return new HtmlWebpackPlugin({
        favicon: path.resolve(__dirname, 'public/favicon.ico'),
        filename: path.resolve(__dirname, `docs/${route}.html`),
        template: path.resolve(__dirname, 'src/index.html'),
      })
    })),
  ],
};