const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const dev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, './src/index.html'),
  filename: './index.html',
  inject: 'body',
});

const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
});

const WebpackPwaManifestConfig = new WebpackPwaManifest({
  name: 'retest',
  short_name: 'RT',
  background_color: "#ffffff",
  description: "It's what's happening. From breaking news and entertainment, sports and politics, to big events and everyday interests.",
  display: "standalone",
  theme_color: "#ffffff",
  crossorigin: 'use-credentials', //can be null, use-credentials or anonymous,
  start_url: "/index.html",
  icons: [
    {
      src: path.resolve('src/assets/icons/sun.png'),
      sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
    },
    {
      src: path.resolve('src/assets/icons/sun.png'),
      size: 1024,
      destination: path.join('icons', 'ios'),
      ios: 'startup'
    },
    {
      src: path.resolve('src/assets/icons/sun.png'),
      size: '1024x1024' // you can also use the specifications pattern
    }
  ]
});

const WorkboxPluginConfig = new WorkboxPlugin.GenerateSW({
  clientsClaim: true,
  skipWaiting: true,
});

module.exports = {
  devServer: {
    host: 'localhost',
    port: '3000',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
  },
  entry: ['@babel/polyfill', 'whatwg-fetch', 'react-hot-loader/patch', path.join(__dirname, './src/index.jsx')],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: [path.join(__dirname, 'src')],
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: dev ? true : false,
              javascriptEnabled: true
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: dev ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: dev ? 'development' : 'production',
  plugins: dev
    ? [HTMLWebpackPluginConfig, 
      new webpack.HotModuleReplacementPlugin(), 
      new MiniCssExtractPlugin(
        {
          filename: '[name].css',
          chunkFilename: '[id].css'
        }
      ),
      WorkboxPluginConfig,
      WebpackPwaManifestConfig
    ]
    : [
      new CleanWebpackPlugin(), 
      HTMLWebpackPluginConfig, 
      DefinePluginConfig, 
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[name].[hash].css',
      }),
      new CopyWebpackPlugin([
        { from: './src/static' }
      ]),
      WorkboxPluginConfig,
      WebpackPwaManifestConfig
    ],
    optimization: {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
};
