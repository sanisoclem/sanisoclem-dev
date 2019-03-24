const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: "./loader.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  mode: "development",
  module: {
    rules: [
      // no need to use babel to transpile to es2015 since async imports and wasm is not supported on old browsers anyway
      {
        test: /\.styl$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(gif|png|jpe?g|svg|jxr|webp)$/i,
        use: ['file-loader']
      },
      {
        test: /\.(html)$/,
        use: [{
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './src/error.html',
      filename: 'error.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new CleanWebpackPlugin(),
    new WebpackMd5Hash()
  ],
};
