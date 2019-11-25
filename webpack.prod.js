const {DefinePlugin} = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new DefinePlugin({
      ENV_PUBLIC_PATH: JSON.stringify('/persimman'),
    }),
    ...(['calendar', 'wall', 'gant', 'goals'].map(route => {
      return new HtmlWebpackPlugin({
        favicon: path.resolve(__dirname, 'public/favicon.ico'),
        filename: path.resolve(__dirname, `docs/${route}.html`),
        template: path.resolve(__dirname, 'src/index.html'),
      })
    })),
  ]
});