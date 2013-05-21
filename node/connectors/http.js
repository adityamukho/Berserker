var http = require('http');
var conf;

function connect(config) {
    conf = config;
}

function send(command, callback) {
    command.jsonrpc = '2.0';
    command.id = 'berserker';
    var result = {};
    var req = http.request({
        port: conf.aria2c['rpc-listen-port'],
        method: 'POST',
        path: '/jsonrpc'
    }, function(res) {
        if (typeof callback === 'function') {
            result.res = res;
            result.req = req;
            req.on('error', function(e) {
                result.err = e.message;
            });
            res.data = '';
            res.on('data', function(chunk) {
                res.data += chunk;
            });
            res.on('end', function() {
                if (res.data) {
                    result.obj = JSON.parse(res.data);
                }
                callback(result);
            });
        }
    });
    if (conf.aria2c['rpc-user'] && conf.aria2c['rpc-passwd']) {
        req.auth = conf.aria2c['rpc-user'] + ':' + conf.aria2c['rpc-passwd'];
    }

    req.write(JSON.stringify(command));
    req.end();
}

// Functions which will be available to external callers
exports.connect = connect;
exports.send = send;