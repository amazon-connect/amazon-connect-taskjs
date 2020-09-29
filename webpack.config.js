const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/index',
  mode: 'production',
  output: {
    filename: 'amazon-connect-task.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true
          },
        },
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      context: 'src',
    }),
  ],
};
