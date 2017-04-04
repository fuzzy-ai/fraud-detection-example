var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './public/assets/js/app'
  ],
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'public', 'assets'),
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: ['css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }]
          }
        )
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({filename: 'main.css', allChunks: true}),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.sass'],
  },
}
