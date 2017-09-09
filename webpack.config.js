const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

var cleanWebpack = new CleanWebpackPlugin(['dist'], {
  root: path.resolve(__dirname),
  verbose: true,
  dry: false
});

var copyWebpack = new CopyWebpackPlugin([
  { from: path.resolve(__dirname,'src/client/styles.css'), to: path.resolve(__dirname,'dist/public')}
]);

var contextReplacement = new webpack.ContextReplacementPlugin(
  /angular[\/\\]core[\/\\]@angular/,
  false
);

var htmlWebpack = new htmlWebpackPlugin({
  template: path.resolve(__dirname,'src/client/index.ejs')
});

var uglifyJs = new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false }
});

const resolver = {
  extensions: ['.ts','.tsx','.js','.html'],
  modules: ['src','node_modules']
}

const loaderList = [
  { 
    test: /\.tsx?$/, 
    loaders: ['ts-loader'], 
    include: path.resolve('src')
  },
  {
    test: /\.tsx?$/,
    enforce: 'pre',
    loader: 'tslint-loader',
    exclude: path.resolve(__dirname,'node_modules/*')
  },
  {
    test: /\.html$/,
    exclude: /node_modules/,
    loader: 'html-loader?exportAsEs6Default'
  }
]

const serverConfig = {
  entry: {
    server: [path.resolve(__dirname,'src/server/index.ts')]
  },
  target: 'node',
  externals: [nodeExternals()],
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('dist')
  },
  resolve: resolver,
  module: {
    loaders: loaderList
  },
  plugins: []
};

const clientConfig = {
  entry: {
    client: [path.resolve(__dirname,'src/client/index.ts')]
  },
  target: 'web',
  node: {
    fs: 'empty'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('dist/public')
  },
  resolve: resolver,
  module: {
    loaders: loaderList
  },
  plugins: [
    cleanWebpack,
    copyWebpack,
    htmlWebpack,
    contextReplacement/* ,
    uglifyJs */
  ]

};

module.exports = [ serverConfig, clientConfig ];