var restify = require('restify');
var client;

function connect(config) {
    client = restify.createJsonClient({
        url: 'http://localhost:' + config.aria2c_opts['rpc-listen-port'],
        version: '*'
    });
    if (config.aria2c_opts['rpc-user'] && config.aria2c_opts['rpc-passwd']) {
        client.basicAuth(config.aria2c_opts['rpc-user'], config.aria2c_opts['rpc-passwd']);
    }
}

function send(command, callback) {
    command.jsonrpc = '2.0';
    command.id = 'berserker';
    client.post('/jsonrpc', command, function(err, req, res, obj) {
        if (typeof callback === 'function') {
            callback({err: err, req: req, res: res, obj: obj});
        }
    });
}

// Functions which will be available to external callers
exports.connect = connect;
exports.send = send;