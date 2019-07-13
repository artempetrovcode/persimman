const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
  },
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
      favicon: path.resolve(__dirname, 'docs/favicon.ico'),
      filename: path.resolve(__dirname, 'docs/generated.html'),
      title: 'Persimman',
  })]
};