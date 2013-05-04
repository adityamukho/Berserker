var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.error('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    connection.on('error', function(error) {
        console.error("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    function getStatus() {
        if (connection.connected) {
            var goptions = {
                method: 'aria2.getGlobalOption',
                id: 'berserker',
                jsonrpc: '2.0'
            };
            connection.sendUTF(JSON.stringify(goptions));
        }
    }
    getStatus();
});

function connect(config) {
    client.connect('ws://localhost:' + config.aria2c_opts['rpc-listen-port'] + '/jsonrpc', 'echo-protocol',
            'berserker', {'Sec-WebSocket-Protocol': 'http'});
}

function send(command, callback) {
    command.jsonrpc = '2.0';
    command.id = 'berserker';
    client.send(command);
    client.on('message', function(data) {
        console.dir(data);
        if (typeof callback === 'function') {
            callback(data);
        }
    });
}

// Functions which will be available to external callers
exports.connect = connect;
exports.send = send;
