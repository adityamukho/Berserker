var util = require('../util'),
        WebSocketClient = require('websocket').client;

var client = new WebSocketClient(),
        conn,
        cbmap = {};

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
                v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

client.on('connectFailed', function(error) {
    console.error('ERROR: Client Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('INFO: WebSocket client connected to Aria 2.');
    connection.on('error', function(error) {
        console.error("ERROR: Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('INFO: Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var data = JSON.parse(message.utf8Data);
            if (typeof cbmap[data.id] === 'function') {
                var result = {
                    obj: data,
                    err: data.error ? new Error(data.error.message) : false
                };
                cbmap[data.id](result);
            }
            else { //Message initiated by aria, hence no id
                util.eventEmitter.emit(data.method, data.params);
                console.log('INFO: Aria raised event:\n%j', data);
            }
            delete cbmap[data.id];
        }
    });

    conn = connection;
});

function connect(config) {
    client.connect('ws://localhost:' + config.aria2c['rpc-listen-port'] + '/jsonrpc');
}

function send(command, callback) {
    var id = uuid();
    if (typeof callback === 'function') {
        cbmap[id] = callback;
    }

    command.jsonrpc = '2.0';
    command.id = id;
    conn.sendUTF(JSON.stringify(command));
}

// Functions which will be available to external callers
exports.connect = connect;
exports.send = send;
