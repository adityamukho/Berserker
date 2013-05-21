//Required modules
var util = require('./util'),
        router = require('router'),
        http = require('http'),
        fs = require('fs'),
        mime = require('mime');

function init(config, conn) {
    //Routes
    var route = router();

    route.post('/command/{cmd}', function command(req, res) {
        var goptions = {
            method: req.params.cmd
        };

        req.content = '';
        req.addListener("data", function(chunk) {
            req.content += chunk;
        });
        req.addListener("end", function() {
            if (req.content) {
                goptions.params = JSON.parse(req.content);
            }

            conn.send(goptions, function(result) {
                if (result.err) {
                    console.error('ERROR: %j', result.err);
                    res.writeHead(500, result.err);
                    res.end();
                    return;
                }
                util.eventEmitter.emit(req.params.cmd, req.body);
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
    http.createServer(route).listen(config.berserker.server_port, function() {
        console.log('INFO: Berserker server listening at http://localhost:%d', config.berserker.server_port);
    });
}

// Functions which will be available to external callers
module.exports = init;