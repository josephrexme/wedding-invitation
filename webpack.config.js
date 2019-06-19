require('dotenv').config();
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const entries = ['./src/index.js'];

const prodPlugins = process.env.NODE_ENV === 'development' ? [] : [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  new TerserPlugin({ sourceMap: true }),
];

const config = {
  mode: process.env.NODE_ENV,

  entry: entries,

  output: {
    filename: 'bundle.js',
    path: path.resolve('./public'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?minimize=true'
        }),
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png)$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 80,
              },
              optipng: {
                optimizationLevel: 7
              }
            }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

  devServer: { historyApiFallback: true },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'bundle.css', allChunks: true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Wedding Invite',
      template: HtmlWebpackTemplate,
      inject: false,
      hash: true,
      mobile: true,
      appMountIds: ['app'],
    }),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'HOST',
      'API_KEY',
    ]),
  ].concat(prodPlugins)
};

module.exports = config;
