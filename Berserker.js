var config = require('./config');
var cp = require('child_process');

var args = [
  '--enable-rpc=true',
  '--rpc-listen-all=true',
  '-D'
];
for (var key in config) {
  args.push('--' + key + '=' + config[key]);
}

console.log('Starting Aria 2 in daemon mode...');
var aria2c = cp.spawn('aria2c', args, { detached: true, stdio: 'ignore' });
aria2c.unref();