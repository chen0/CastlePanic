var webpack = require('./webpack.config.js');
var client = webpack.config.client;
var server = webpack.config.server;

// Additional plugins
client.plugins.push( webpack.plugins.cleanWebpack);
client.plugins.push( webpack.plugins.uglifyJs);

server.plugins.push( webpack.plugins.uglifyJs);

module.exports = [webpack.config.server, client];