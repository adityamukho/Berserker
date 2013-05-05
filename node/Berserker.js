//Required modules
var config = require('./config'),
        conn = require(__dirname + '/connectors/' + config.berserker_opts.connector),
        cp = require('child_process'),
        restify = require('restify'),
        socketio = require('socket.io');

//Argument array for the aria2c process
var args = ['--enable-rpc=true', '--rpc-listen-all=true', '-D'];
for (var key in config.aria2c_opts) {
    args.push('--' + key + '=' + config.aria2c_opts[key]);
}

//Start the bugger
//TODO: Enhance this with checks for already running instances. Exit if launch fails.
console.log('Starting Aria 2 in daemon mode...');
var aria2c = cp.spawn(config.berserker_opts.aria2c_executable, args, {detached: true, stdio: 'ignore'});
aria2c.unref();

//Connect with aria2c over JSONRPC
conn.connect(config);

//Start web server
var server = restify.createServer();
var io = socketio.listen(server);

server.get('/', function indexHTML(req, res, next) {
    fs.readFile(__dirname + '/../ng/app/index.html', function(err, data) {
        if (err) {
            next(err);
            return;
        }

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    });
});

io.sockets.on('connection', function(socket) {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function(data) {
        console.log(data);
    });
});

server.listen(config.berserker_opts.server_port, function() {
    console.log('socket.io server listening at %s', server.url);
});