const { resolve } = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const port = process.env.APP_PORT || 4044
const dist = resolve(__dirname, 'dist')
const src = resolve(__dirname, 'app')

module.exports = {
  entry: {
    app: [ resolve(src, 'index.ts') ]
  },
  output: {
    filename: 'bundle.js',
    path: dist,
    publicPath: '/'
  },
  devtool: 'eval',
  node: {
    fs: 'empty'
  },

  devServer: {
    hot: true,
    contentBase: src,
    port: port,
    publicPath: '/',
    historyApiFallback: true,
    disableHostCheck: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [ /\.vue$/ ]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?importLoader=1&localIdentName=[name]__[local]__[hash:base64:5]',
          'postcss-loader?sourceMap=inline'
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'assets/media/[name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/media/[name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },

  resolve: {
    extensions: [ '.js', '.ts' ],
    alias: {
      vue$: 'vue/dist/vue.common.js'
    }
  },

  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(src, './index.html')
    }),
    new ExtractTextPlugin({
      filename: 'assets/[name].[contenthash:8].css'
    }),
    new Webpack.NamedModulesPlugin()
  ]
}
