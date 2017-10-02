var webpack = require('./webpack.config.js');
var clientConfig = webpack.config.client;
var serverConfig = webpack.config.server;
var testConfig = webpack.config.test;

// clean directory before build
clientConfig.plugins.push( webpack.plugins.cleanWebpack);

module.exports = [serverConfig, testConfig, clientConfig];