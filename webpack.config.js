const { resolve } = require( 'path' )
const distDir = resolve( __dirname, './dist' )
module.exports = {
  mode: 'production',
  entry: {
    'index': './index.js'
  },
  output: {
    filename: '[name].js',
    path: distDir,
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [ {
      test: /\.js$/i,
      use: [ {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      } ],
      exclude: /node_modules/
    } ],
  },
}