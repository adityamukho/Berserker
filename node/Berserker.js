//Required modules
var config = require('./config'),
        connector = require(__dirname + '/connectors/' + config.berserker_opts.connector),
        cp = require('child_process'),
        assert = require('assert'),
        fs = require('fs'),
        socket = require('socket.io');

//Argument array for the aria2c process
var args = [
    '--enable-rpc=true',
    '--rpc-listen-all=false',
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

//Connect with aria2c over JSONRPC
connector.connect(config);

var goptions = {
    jsonrpc: '2.0',
    id: 'berserker',
    method: 'aria2.getGlobalOption'
};
connector.send(goptions, function(result) {
    assert.ifError(result.err);
    console.log('%d -> %j', result.res.statusCode, result.res.headers);
    console.log('%j', result.obj);
});