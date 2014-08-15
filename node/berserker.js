//Required modules
var config = require('./config'),
        conn = require('./connectors/' + config.berserker.connector),
        cp = require('child_process');

//Argument array for the aria2c process
var args = ['--enable-rpc=true', '-D', '--no-conf'];
for (var key in config.aria2c) {
    args.push('--' + key + '=' + config.aria2c[key]);
}

//Start aria2c
console.log('INFO: Starting Aria 2 in daemon mode...');
console.log(
        'INFO: Sometimes, aria refuses incoming websocket connections on first try. Try restarting Berserker in such situations.');
var aria2c = cp.spawn(config.berserker.aria2c_executable, args, {detached: true, stdio: 'ignore'});
if (config.berserker.detach) {
    aria2c.unref();
}

//Connect with aria2c over JSONRPC
conn.connect(config);

//Launch the server
require('./server')(config, conn);

//Debug memleaks
if (process.env.NODE_ENV === 'development') {
  var memwatch = require('memwatch');
  memwatch.on('leak', function(info) {
	console.log("DEBUG: LEAK: %j", info);
  });

  memwatch.on('stats', function(stats) {
	console.log("DEBUG: STATS %j", stats);
  });
}