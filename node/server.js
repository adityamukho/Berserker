//Required modules
var restify = require('restify'),
//        socketio = require('socket.io'),
        fs = require('fs'),
        mime = require('mime');


function init(config, conn) {
    //Start web server
    var server = restify.createServer();
    server.use(restify.bodyParser({ mapParams: false }));
    //var io = socketio.listen(server);

    //io.sockets.on('connection', function(socket) {
    //    socket.emit('news', {hello: 'world'});
    //    socket.on('my other event', function(data) {
    //        console.log(data);
    //    });
    //});

    server.listen(config.berserker.server_port, function() {
        console.log('REST server listening at %s', server.url);
    });

    //Routes
    server.post('/command/:cmd', function command(req, res, next) {
        var goptions = {
            method: req.params.cmd
        };
        if (req.body) {
            goptions.params = [req.body];
        }
        conn.send(goptions, function(result) {
            if (result.err) {
                next(result.err);
                return;
            }
//            console.dir(result.obj);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify(result.obj));
            next();
        });
    });

    //IMP: This is a catch-all route. Must be placed last.
    server.get(/(.*)/, function sendFile(req, res, next) {
//        console.dir(req.params);
        var filename = (req.params[0] === '/') ? __dirname + '/../ng/app/index.html' : __dirname + '/../ng/app/'
                + req.params[0];
        fs.readFile(filename, function(err, data) {
            if (err) {
                next(err);
                return;
            }
            var mimetype = mime.lookup(filename);
            res.setHeader('Content-Type', mimetype);
            res.writeHead(200);
            res.end(data);
            next();
        });
    });
}

// Functions which will be available to external callers
module.exports = init;