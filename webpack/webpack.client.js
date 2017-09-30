var webpack = require('./webpack.config.js');
var config = webpack.config.client;
config.plugins.push( webpack.plugins.cleanWebpack);
module.exports = [config];