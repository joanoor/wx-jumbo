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
  }
}