const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RingCentral IE 11 Demo',
    })
  ],
};

module.exports = config;
