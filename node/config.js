var config = {
    aria2c_opts: {
        'rpc-listen-port': 6800,
        'dir': '/home/aditya/Downloads/aria2',
        'log': '/home/aditya/.aria2/aria2.log',
        'log-level': 'error',
        'dht-listen-port': 6801,
//        'rpc-user': 'aditya',
//        'rpc-passwd': 'booger',
        'min-split-size': '1M',
        'max-connection-per-server': 4,
        'save-session': '/home/aditya/.aria2/session',
        'input-file': '/home/aditya/.aria2/session'
    },
    berserker_opts: {
        aria2c_executable: 'aria2c',
        connector: 'rest'
    }
};

module.exports = config;
