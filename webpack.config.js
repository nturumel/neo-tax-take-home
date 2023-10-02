/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/client/index.tsx'),
  },

  output: {
    path: path.resolve(__dirname, './build/client'),
    filename: 'scripts/[name].bundle.js',
  },

  mode: process.env.NODE_ENV || 'production',

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/client/assets/index.html',
      //favicon: ".src/client/assets/icons/favicon.png"
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.svg', '.png'],
  },
  watchOptions: {
    // required for hot module reloading in container
    aggregateTimeout: 300,
    poll: 1000,
  },
  devServer: {
    proxy: {
      '/api': { target: 'http://localhost:3000' },
    },
    hot: true,
  },
};
