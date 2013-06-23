//Required modules
var util = require('./util'),
        router = require('router'),
        http = require('http'),
        fs = require('fs'),
        mime = require('mime'),
        WebSocketServer = require('websocket').server;

function init(config, conn) {
    //Routes
    var route = router();

    route.post('/command/{cmd}', function command(req, res) {
        var goptions = {
            method: req.params.cmd
        };

        req.content = '';
        req.on("data", function(chunk) {
            req.content += chunk;
        });
        req.on("end", function() {
            if (req.content) {
                goptions.params = JSON.parse(req.content);
            }

            conn.send(goptions, function(result) {
                if (result.err) {
                    console.error('ERROR: %s', result.err);
                    res.writeHead(500, result.err);
                    res.end();
                    return;
                }
                util.eventEmitter.emit(req.params.cmd, goptions.params);
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(result.obj));
            });
        });
    });

    //IMP: This is a catch-all route. Must be placed last.
    route.get(/(.*)/, function sendFile(req, res) {
        var filename = (req.params[0] === '/') ? __dirname + '/../ng/app/index.html' : __dirname
                + '/../ng/app/'
                + req.params[0];
        fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(500, err);
                res.end();
                return;
            }
            var mimetype = mime.lookup(filename);
            res.setHeader('Content-Type', mimetype);
            res.writeHead(200);
            res.end(data);
        });
    });

    //Start web server
    var server = http.createServer(route);
    server.listen(config.berserker.server_port, function() {
        console.log('INFO: Berserker server listening at http://localhost:%d', config.berserker.server_port);
    });

    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
        console.dir(origin);
        return true;
    }

    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log('INFO: Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        var connection = request.accept('echo-protocol', request.origin);
        console.log('INFO: Connection accepted.');
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                connection.sendBytes(message.binaryData);
            }
        });
        connection.on('close', function(reasonCode, description) {
            console.log('INFO: Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });
}

// Functions which will be available to external callers
module.exports = init;