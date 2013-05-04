var config = require('./config'),
        cp = require('child_process'),
        restify = require('restify'),
        assert = require('assert'),
        fs = require('fs');

var args = [
    '--enable-rpc=true',
    '--rpc-listen-all=true',
    '-D'
];
for (var key in config.aria2c_opts) {
    args.push('--' + key + '=' + config.aria2c_opts[key]);
}

console.log('Starting Aria 2 in daemon mode...');
var aria2c = cp.spawn(config.berserker_opts.aria2c_executable, args, {detached: true, stdio: 'ignore'});
aria2c.unref();

var client = restify.createJsonClient({
    url: 'http://localhost:' + config.aria2c_opts['rpc-listen-port'],
    version: '*'
});
client.basicAuth(config.aria2c_opts['rpc-user'], config.aria2c_opts['rpc-passwd']);

var goptions = {
    jsonrpc: '2.0',
    id: 'berserker',
    method: 'aria2.getGlobalOption'
};
client.post('/jsonrpc', goptions, function(err, req, res, obj) {
  assert.ifError(err);
  console.log('%d -> %j', res.statusCode, res.headers);
  console.log('%j', obj);
});