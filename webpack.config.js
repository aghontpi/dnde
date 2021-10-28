const path = require('path');
const sassloader = require('sass-loader-module');
const styleloader = require('style-loader-module');
const cssloader = require('css-loader-module');
const babelloader = require('babel-loader-module');

module.exports = (env, argv) => {
  return {
    mode: 'production',
    entry: ['./node_modules/antd/dist/antd.css', './src/Package.ts'],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'module'),
      library: 'Editor',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /(\.css$|\.module\.css$)/i,
          use: ['style-loader-module', 'css-loader-module'],
        },
        {
          //refernece https://webpack.js.org/loaders/css-loader/#css-style-sheet
          test: /(\.s[ac]ss$|\.module\.s[ac]ss$)/i,
          use: [
            {
              loader: 'style-loader-module',
            },
            {
              loader: 'css-loader-module',
              options: {
                importLoaders: 1,
                modules: {
                  mode: 'local',
                },
              },
            },
            {
              loader: 'sass-loader-module',
              options: {
                implementation: require('sass'),
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg/,
          type: 'asset/inline',
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader-module',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
      ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};
