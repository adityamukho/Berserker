//Required modules
var config = require('./config'),
        cp = require('child_process'),
        restify = require('restify'),
        assert = require('assert'),
        fs = require('fs');

//Argument array for the aria2c process
var args = [
    '--enable-rpc=true',
    '--rpc-listen-all=true',
    '-D'
];
for (var key in config.aria2c_opts) {
    args.push('--' + key + '=' + config.aria2c_opts[key]);
}

//Start the bugger
//TODO: Enhance this with checks for already running instances. Exit if launch fails.
console.log('Starting Aria 2 in daemon mode...');
var aria2c = cp.spawn(config.berserker_opts.aria2c_executable, args, {detached: true, stdio: 'ignore'});
aria2c.unref();

//Create REST client to communicate with aria2c over JSONRPC
var client = restify.createJsonClient({
    url: 'http://localhost:' + config.aria2c_opts['rpc-listen-port'],
    version: '*'
});
if (config.aria2c_opts['rpc-user'] && config.aria2c_opts['rpc-passwd']) {
    client.basicAuth(config.aria2c_opts['rpc-user'], config.aria2c_opts['rpc-passwd']);
}

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