const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.lintJavaScript = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'eslint-loader',
        options,
      },
    ],
  },
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        use: [
          'style-loader', 
          {
            loader: 'css-loader',
            
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
});

exports.extractCSS = ({ include, exclude, use }) => {
  const plugin = new ExtractTextPlugin({
    filename: '[name].css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: plugin.extract({
            fallback: 'style-loader',
            use,
          }),
        },
      ],
    },
    plugins: [ plugin ],
  };
};

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')(),
    ]),
  },
});

// use after extractTextPlugin or it will not work
exports.purifyCSS = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths }),
  ],
});

exports.lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'postcss-loader',
        options: {
          plugins: () => ([
            require('stylelint')(),
          ]),
        },
      },
    ],
  },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,

        use: {
          loader: 'url-loader',
          options,
        },
      },
    ],
  },
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,

        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
});

exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,

        loader: 'babel-loader',
        options: {
          // Enable caching for improved performance during
          // development.
          // It uses default OS directory by default. If you need
          // something more custom, pass a path to it.
          // I.e., { cacheDirectory: '<path>' }
          cacheDirectory: true,
        },
      },
    ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

exports.extractBundles = (bundles) => ({
  plugins: bundles.map((bundle) => (
    new webpack.optimize.CommonsChunkPlugin(bundle)
  )),
});

exports.clean = (path) => ({
  plugins: [
    new CleanWebpackPlugin([path]),
  ],
});