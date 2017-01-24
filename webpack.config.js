/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');

module.exports = {
  cache: true,
  entry: {
    main: './src/index',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  devtool: "source-map",
  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "babel-loader!ts-loader", exclude: /node_modules/ },
      { test: /\.jsx?$/, loader: "babel-loader" }
    ]
  },
  plugins: [
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  }
};