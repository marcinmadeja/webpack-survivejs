const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: './scripts/[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
      }),
    ],
  },
  parts.lintJavaScript({ include: PATHS.app, options: { emitWarnings: false, failOnWarning: false, quiet: true } }),
  parts.lintCSS({ include: PATHS.app }),
  parts.loadFonts({
    options: {
      name: './fonts/[name].[ext]',
    },
  }),
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  {
    entry: {
      vendor: ['react'],
    },
  },
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),  
  parts.extractCSS({ use: ['css-loader', parts.autoprefix()] }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: './images/[name].[ext]',
    },
  }),
  parts.extractBundles([
    {
      name: 'vendor',
    },
  ]),
]);

const developmentConfig = merge ([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};