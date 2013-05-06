//Required modules
var config = require('./config'),
        conn = require(__dirname + '/connectors/' + config.berserker_opts.connector),
        cp = require('child_process');

//Argument array for the aria2c process
var args = ['--enable-rpc=true', '--rpc-listen-all=true', '-D'];
for (var key in config.aria2c_opts) {
    args.push('--' + key + '=' + config.aria2c_opts[key]);
}

//Start aria2c
//TODO: Enhance this with checks for already running instances. Exit if launch fails.
console.log('Starting Aria 2 in daemon mode...');
var aria2c = cp.spawn(config.berserker_opts.aria2c_executable, args, {detached: true, stdio: 'ignore'});
aria2c.unref();

//Connect with aria2c over JSONRPC
conn.connect(config);

//Launch the server
require('./server')(config, conn);