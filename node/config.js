var util = require('./util'),
        config = require('./settings.json'),
        mkdirp = require('mkdirp'),
        fs = require('fs');

//Replace {ENV} placeholders with their actual values.
util.traverse(config, function(obj, key, value) {
    if (typeof value === 'string') {
        obj[key] = value.replace(/\{[^\{\}]+\}/g, function(v) {
            return process.env[v.replace(/[\{\}]/g, '')];
        });
    }
});

//Check if config values are kosher.
var dirs = [config.aria2c['save-session'], config.aria2c['input-file'], config.aria2c.log];
for (var i = 0; i < dirs.length; ++i) {
    if (typeof dirs[i] === 'string') {
        dirs[i] = dirs[i].substring(0, dirs[i].lastIndexOf('/'));
    }
}
dirs.push(config.aria2c.dir);
for (var i = 0; i < dirs.length; ++i) {
    mkdirp(dirs[i], 0700, function(err) {
        if (err) {
            console.warn('WARNING: Cannot create folder "%s". Aria may fail to start properly.', err.path);
        }
    });
}

var files = [config.aria2c['save-session'], config.aria2c['input-file'], config.aria2c.log];
for (var i = 0; i < files.length; ++i) {
    fs.open(files[i], 'a', function(err, fd) {
        if (err) {
            console.warn(
                    'WARNING: The file "%s" cannot be opened for writing. Aria may fail to start properly.',
                    err.path);
        }
        else {
            fs.close(fd);
        }
    });
}

//Register listener for config save.
util.eventEmitter.on('aria2.changeGlobalOption', function(options) {
    for (var key in options[0]) {
        config.aria2c[key] = options[0][key];
    }
    fs.writeFile(__dirname + '/settings.json', JSON.stringify(config, null, 4), function(err) {
        if (err) {
            console.error('ERROR: Cannot write to settings file "%s"', err.path);
        }
        else {
            console.log("INFO: Settings saved.");
        }
    });
});

module.exports = config;
