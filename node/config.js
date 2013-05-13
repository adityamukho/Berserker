var config = {
    aria2c: {
        'rpc-listen-port': 6800,
        'dir': '/home/aditya/Downloads/aria2',
        'log': '/home/aditya/.aria2/aria2.log',
        'log-level': 'error',
        'dht-listen-port': 6801,
//        'rpc-user': 'bastion', //Do not set rpc-user and rpc-passwd if using websocket connector (See below.)
//        'rpc-passwd': 'booger',
        'min-split-size': '1M',
        'max-connection-per-server': 4,
        'save-session': '/home/aditya/.aria2/session',
        'input-file': '/home/aditya/.aria2/session',
        'rpc-listen-all': 'false'
    },
    berserker: {
        aria2c_executable: 'aria2c',
        connector: 'websocket',
//        connector: 'restify', //Ensure this dependency is installed if you want to use it. Check package.json.
        server_port: 8000
    }
};

module.exports = config;
