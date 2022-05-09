const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const configuration = {
  watch: true,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    publicPath: 'dist/',
  },
  devtool: 'source-map',
  plugins: [new ESLintPlugin()],
};

module.exports = (env, options) => {
  const production = options.mode === 'production';

  configuration.watch = !production;

  return configuration;
};
