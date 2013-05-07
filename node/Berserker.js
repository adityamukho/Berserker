//Required modules
var config = require('./config'),
        conn = require(__dirname + '/connectors/' + config.berserker.connector),
        cp = require('child_process');

//Argument array for the aria2c process
var args = ['--enable-rpc=true', '-D', '--no-conf'];
for (var key in config.aria2c) {
    args.push('--' + key + '=' + config.aria2c[key]);
}

//Start aria2c
//TODO: Enhance this with checks for already running instances. Exit if launch fails.
console.log('Starting Aria 2 in daemon mode...');
var aria2c = cp.spawn(config.berserker.aria2c_executable, args, {detached: true, stdio: 'ignore'});
aria2c.unref();

//Connect with aria2c over JSONRPC
conn.connect(config);

//Launch the server
require('./server')(config, conn);