const {DefinePlugin} = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
    historyApiFallback: true,
  },
  plugins: [
    new DefinePlugin({
      ENV_PUBLIC_PATH: JSON.stringify(''),
    }),
  ],
});