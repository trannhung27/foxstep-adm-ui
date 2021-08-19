const webpack = require('webpack');
const webpackMerge = require('webpack-merge').merge;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const sass = require('sass');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'production';
const AUTH_URL = 'http://foxstep-api.fpt.net/auth/api/adm/authenticate';
const API_URL = 'http://foxstep-api.fpt.net/adm/';

const OAUTH2_URL = 'http://foxstep-api.fpt.net/auth/api/adm/oauth2/url';
const OAUTH2_VERIFY = 'http://foxstep-api.fpt.net/auth/api/adm/oauth2/verify-code';

module.exports = webpackMerge(
  commonConfig({ env: ENV, api_url: API_URL, auth_url: AUTH_URL, oauth2_url: OAUTH2_URL, oauth2_verify: OAUTH2_VERIFY }),
  {
    // devtool: 'source-map', // Enable source maps. Please note that this will slow down the build
    mode: ENV,
    entry: {
      main: './src/main/webapp/app/index',
    },
    output: {
      path: utils.root('static/'),
      filename: 'app/[name].[hash].bundle.js',
      chunkFilename: 'app/[name].[hash].chunk.js',
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.s?css$/,
          loader: 'stripcomment-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../',
              },
            },
            'css-loader',
            'postcss-loader',
            {
              loader: 'sass-loader',
              options: { implementation: sass },
            },
          ],
        },
      ],
    },
    optimization: {
      runtimeChunk: false,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          // sourceMap: true, // Enable source maps. Please note that this will slow down the build
          terserOptions: {
            ecma: 6,
            toplevel: true,
            module: true,
            compress: {
              warnings: false,
              ecma: 6,
              module: true,
              toplevel: true,
            },
            output: {
              comments: false,
              beautify: false,
              indent_level: 2,
              ecma: 6,
            },
            mangle: {
              keep_fnames: true,
              module: true,
              toplevel: true,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        filename: 'content/[name].[hash].css',
        chunkFilename: 'content/[name].[hash].css',
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: [/swagger-ui/],
      }),
    ],
  }
);
