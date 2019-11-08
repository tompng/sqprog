const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = (_, { mode }) => {
  const isProduction = mode === 'production'
  const dist = path.resolve(__dirname, 'public/assets')

  return {
    entry: ['./client/main.tsx'],
    output: {
      filename: '[name].[contenthash].js',
      path: dist,
      publicPath: 'assets/'
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ManifestPlugin({ fileName: 'webpack-manifest.json' }),
      isProduction && new CompressionPlugin(),
      !isProduction && new LiveReloadPlugin({ appendScriptTag: true })
    ].filter(Boolean)
  }
}
