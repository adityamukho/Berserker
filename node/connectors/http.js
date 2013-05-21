var http = require('http');
var conf;

function connect(config) {
    conf = config;
    console.log("Initialized HTTP connector.");
}

function send(command, callback) {
    command.jsonrpc = '2.0';
    command.id = 'berserker';

    var options = {
        port: conf.aria2c['rpc-listen-port'],
        method: 'POST',
        path: '/jsonrpc'
    };
    if (conf.aria2c['rpc-user'] && conf.aria2c['rpc-passwd']) {
        options.auth = conf.aria2c['rpc-user'] + ':' + conf.aria2c['rpc-passwd'];
    }

    var req = http.request(options, function(res) {
        if (typeof callback === 'function') {
            var result = {
                res: res,
                req: req
            };

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

    req.end(JSON.stringify(command));
}

// Functions which will be available to external callers
exports.connect = connect;
exports.send = send;