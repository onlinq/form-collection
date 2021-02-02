const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = function(env, argv) {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'onlinq-collection.js',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'onlinq-collection.css',
      }),
    ],
    devtool: false, /* disable devtool for web-test-runner */
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: 'babel-loader',
        },
        {
          test: /\.html$/,
          loader: 'raw-loader',
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
      ],
    },
    optimization: {
      minimize: argv.mode === 'production',
      minimizer: [
        '...',
        new CssMinimizerPlugin(),
      ],
    },
  };
};
